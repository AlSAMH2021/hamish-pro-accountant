
import { useApp } from '@/context/AppContext';
import { BarChart3, FileText, GraduationCap, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoWhite from '@/assets/logo-white.png';
import { useEffect, useRef, useState, useCallback } from 'react';

/* ── Intersection Observer hook ── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── Animated counter ── */
function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useReveal(0.3);

  useEffect(() => {
    if (!visible) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [visible, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count}{suffix}
    </span>
  );
}

/* ── Reveal text word-by-word ── */
function RevealText({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  const { ref, visible } = useReveal(0.2);
  const words = text.split(' ');

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
        >
          <span
            className="inline-block transition-all duration-700"
            style={{
              transitionDelay: `${delay + i * 100}ms`,
              transform: visible ? 'translateY(0)' : 'translateY(110%)',
              opacity: visible ? 1 : 0,
            }}
          >
            {word}&nbsp;
          </span>
        </span>
      ))}
    </span>
  );
}

/* ── Fade-up element ── */
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal(0.15);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        opacity: visible ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
}

const Landing = () => {
  const { setCurrentStep } = useApp();

  return (
    <div className="min-h-screen bg-[hsl(220,50%,13%)]" dir="rtl">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-[pulse_6s_ease-in-out_infinite]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent/8 blur-[150px] animate-[pulse_8s_ease-in-out_infinite_1s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/[0.03]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.05]" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <FadeUp>
            <img src={logoWhite} alt="هامش" className="h-16 md:h-20 mx-auto mb-8" />
          </FadeUp>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            <RevealText text="قيّم مستواك المحاسبي" delay={200} />
            <br />
            <span className="text-gradient-gold">
              <RevealText text="بدقة احترافية" delay={600} />
            </span>
          </h1>

          <FadeUp delay={900}>
            <p className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
              اختبار متخصص حسب قطاعك + تقرير تفصيلي + جلسة استشارية مع خبراء المحاسبة
            </p>
          </FadeUp>

          <FadeUp delay={1100}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => setCurrentStep(2)}
                className="h-14 px-10 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl gap-3 shadow-[0_0_30px_hsl(40,70%,50%,0.25)] transition-transform duration-200 hover:scale-105"
              >
                <span>ابدأ اختبار المحاسبين</span>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => setCurrentStep(9)}
                variant="outline"
                className="h-14 px-10 text-lg font-bold border-white/20 text-white hover:bg-white/10 rounded-xl bg-transparent transition-transform duration-200 hover:scale-105"
              >
                تسجيل الدخول
              </Button>
            </div>
          </FadeUp>

          <FadeUp delay={1300}>
            <p className="mt-6 text-white/30 text-sm">
              عدد المقاعد الاستشارية محدود — سجّل الآن
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-5xl mx-auto py-10 px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 500, prefix: '+', suffix: '', label: 'محاسب مُقيَّم' },
            { value: 45, prefix: '', suffix: '', label: 'سؤال متخصص' },
            { value: 5, prefix: '', suffix: '', label: 'محاور تقييم' },
            { value: 95, prefix: '', suffix: '%', label: 'نسبة الرضا' },
          ].map((stat, i) => (
            <FadeUp key={i} delay={i * 150}>
              <p className="text-3xl font-bold text-accent mb-1">
                <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </p>
              <p className="text-white/50 text-sm">{stat.label}</p>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 px-4 bg-[hsl(220,50%,13%)]">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">لماذا اختبار هامش؟</h2>
          </FadeUp>
          <FadeUp delay={100}>
            <p className="text-white/40 text-center mb-16 max-w-xl mx-auto">نقدم لك أدوات تقييم احترافية تساعدك على معرفة مستواك الحقيقي</p>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: BarChart3, title: 'تحليل دقيق', desc: 'تقييم شامل عبر 5 محاور محاسبية متخصصة حسب قطاعك' },
              { icon: FileText, title: 'تقرير مفصل', desc: 'تقرير احترافي يوضح نقاط القوة والضعف مع خطة تطوير' },
              { icon: GraduationCap, title: 'توصيات تدريبية', desc: 'دورات مخصصة لتطوير المحاور التي تحتاج تحسين' },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 200}>
                <div className="group rounded-2xl p-8 border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300 text-center hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                    <item.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-white/50 leading-relaxed text-sm">{item.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 px-4 bg-[hsl(220,45%,11%)]">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">كيف يعمل التقييم؟</h2>
          </FadeUp>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '١', label: 'سجّل بياناتك' },
              { step: '٢', label: 'ادفع رسوم الاختبار' },
              { step: '٣', label: 'أجب على 45 سؤال' },
              { step: '٤', label: 'احصل على تقريرك' },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 200} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-xl mb-5 transition-all duration-300 hover:scale-110 hover:bg-accent/20 hover:shadow-[0_0_20px_hsl(40,70%,50%,0.2)]">
                  {item.step}
                </div>
                <p className="text-white/80 font-medium">{item.label}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-[hsl(220,50%,13%)]">
        <FadeUp>
          <div className="max-w-2xl mx-auto text-center">
            <Shield className="w-12 h-12 text-accent mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">جاهز لمعرفة مستواك؟</h2>
            <p className="text-white/50 mb-10">ابدأ الآن واحصل على تقييم شامل لمهاراتك المحاسبية</p>
            <Button
              onClick={() => setCurrentStep(2)}
              className="h-14 px-12 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl shadow-[0_0_30px_hsl(40,70%,50%,0.25)] transition-transform duration-200 hover:scale-105"
            >
              ابدأ الاختبار الآن
            </Button>
          </div>
        </FadeUp>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-4 text-center">
        <img src={logoWhite} alt="هامش" className="h-10 mx-auto mb-3 opacity-40" />
        <p className="text-white/30 text-sm">© {new Date().getFullYear()} هامش — جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default Landing;
