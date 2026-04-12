
import { useApp } from '@/context/AppContext';
import { BarChart3, FileText, GraduationCap, ArrowLeft, Shield, Calculator, UserCheck, Briefcase, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoWhite from '@/assets/logo-white.png';
import platformPreview from '@/assets/hero-dashboard.png';
import { useEffect, useRef, useState } from 'react';

import clientDco from '@/assets/clients/dco.png';
import clientSafran from '@/assets/clients/safran.png';
import clientSaptco from '@/assets/clients/saptco.png';
import clientThespace from '@/assets/clients/thespace.png';
import clientNad from '@/assets/clients/nad.png';
import clientAlowfi from '@/assets/clients/alowfi.png';
import clientAyb from '@/assets/clients/ayb.png';
import clientBrsk from '@/assets/clients/brsk.png';
import clientKdc from '@/assets/clients/kdc.webp';
import clientDrtooth from '@/assets/clients/drtooth.png';
import clientRooh from '@/assets/clients/rooh-alqarya.png';
import clientSyn from '@/assets/clients/syn-architects.png';
import clientSheeria from '@/assets/clients/sheeria.png';
import clientPhi from '@/assets/clients/phi.png';
import clientFranway from '@/assets/clients/franway.png';
import clientGrove from '@/assets/clients/grove.png';
import clientKazameeza from '@/assets/clients/kazameeza.png';
import clientAlmanco from '@/assets/clients/almanco.png';
import clientNudhum from '@/assets/clients/nudhum.png';
import clientNrrc from '@/assets/clients/nrrc.png';
import clientWaraq from '@/assets/clients/waraq-khuzama.png';

const clientLogos = [
  { src: clientDco, alt: 'DCO' },
  { src: clientSafran, alt: 'Safran' },
  { src: clientSaptco, alt: 'سابتكو' },
  { src: clientThespace, alt: 'The Space' },
  { src: clientNad, alt: 'Nad Designs' },
  { src: clientAlowfi, alt: 'العوفي وشركاه' },
  { src: clientAyb, alt: 'آيب' },
  { src: clientBrsk, alt: 'بريسك' },
  { src: clientKdc, alt: 'تمور المملكة' },
  { src: clientDrtooth, alt: 'Dr. Tooth' },
  { src: clientRooh, alt: 'روح القرية' },
  { src: clientSyn, alt: 'Syn Architects' },
  { src: clientSheeria, alt: 'Sheeria Group' },
  { src: clientPhi, alt: 'Phi Valuation' },
  { src: clientFranway, alt: 'فران واي' },
  { src: clientGrove, alt: 'قروف' },
  { src: clientKazameeza, alt: 'كزا ميزا' },
  { src: clientAlmanco, alt: 'مصنع المانع' },
  { src: clientNudhum, alt: 'نظم' },
  { src: clientNrrc, alt: 'هيئة الرقابة النووية' },
  { src: clientWaraq, alt: 'ورق خزامى' },
];

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

/* ── Fade-up element ── */
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal(0.15);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
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
    <div className="min-h-screen bg-white" dir="rtl">

      {/* Navbar */}
      <nav className="border-b border-border/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <img src={logoWhite} alt="هامش" className="h-9 brightness-0" />
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setCurrentStep(9)}
              variant="ghost"
              className="text-foreground/70 hover:text-foreground font-medium"
            >
              تسجيل الدخول
            </Button>
            <Button
              onClick={() => setCurrentStep(2)}
              className="bg-foreground text-white hover:bg-foreground/90 rounded-lg px-6 font-semibold"
            >
              ابدأ التقييم
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Right - Text */}
          <div>
            <FadeUp>
              <div className="inline-flex items-center gap-2 bg-muted rounded-full px-4 py-1.5 text-sm text-muted-foreground mb-6">
                <span className="w-2 h-2 rounded-full bg-primary" />
                منصة تقييم المحاسبين الأولى
              </div>
            </FadeUp>
            <FadeUp delay={100}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-foreground leading-[1.4] mb-6 tracking-tight">
                قيّم مستواك المحاسبي
                <br />
                <span className="text-primary">بدقة احترافية</span>
              </h1>
            </FadeUp>
            <FadeUp delay={200}>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
                تقييم متخصص حسب قطاعك مع تقرير تفصيلي وجلسة استشارية مع خبراء المحاسبة لتطوير مهاراتك المهنية.
              </p>
            </FadeUp>
            <FadeUp delay={300}>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setCurrentStep(2)}
                  className="h-12 px-8 text-base font-semibold bg-foreground text-white hover:bg-foreground/90 rounded-lg gap-2"
                >
                  ابدأ تقييم المحاسبين
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </div>
            </FadeUp>
            <FadeUp delay={400}>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 text-sm text-muted-foreground">
                {['45 سؤال متخصص', '5 محاور تقييم', 'تقرير مفصل'].map((t, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    {t}
                  </span>
                ))}
              </div>
            </FadeUp>
          </div>

          {/* Left - Platform Preview */}
          <FadeUp delay={200}>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-border shadow-xl">
                <img
                  src={platformPreview}
                  alt="منصة هامش - لوحة التقييم"
                  width={1024}
                  height={768}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/60 bg-muted/30">
        <div className="max-w-6xl mx-auto py-10 px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '+500', label: 'محاسب مُقيَّم' },
            { value: '45', label: 'سؤال متخصص' },
            { value: '5', label: 'محاور تقييم' },
            { value: '95%', label: 'نسبة الرضا' },
          ].map((stat, i) => (
            <FadeUp key={i} delay={i * 100}>
              <p className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Client Logos Marquee */}
      <section className="py-12 overflow-hidden">
        <FadeUp>
          <p className="text-center text-muted-foreground text-sm mb-8">عملاؤنا يثقون بنا</p>
        </FadeUp>
        <div className="relative">
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="flex animate-marquee gap-16 items-center w-max">
            {[...clientLogos, ...clientLogos].map((logo, i) => (
              <img
                key={i}
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                className="h-12 md:h-14 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-3">لماذا تقييم هامش؟</h2>
          </FadeUp>
          <FadeUp delay={100}>
            <p className="text-muted-foreground text-center mb-14 max-w-xl mx-auto">أدوات تقييم احترافية تساعدك على معرفة مستواك الحقيقي</p>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: BarChart3, title: 'تحليل دقيق', desc: 'تقييم شامل عبر 5 محاور محاسبية متخصصة حسب قطاعك' },
              { icon: FileText, title: 'تقرير مفصل', desc: 'تقرير احترافي يوضح نقاط القوة والضعف مع خطة تطوير' },
              { icon: GraduationCap, title: 'توصيات تدريبية', desc: 'دورات مخصصة لتطوير المحاور التي تحتاج تحسين' },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 150}>
                <div className="rounded-xl p-7 border border-border bg-card hover:shadow-lg transition-all duration-300 text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-3">من يستفيد من التقييم؟</h2>
          </FadeUp>
          <FadeUp delay={100}>
            <p className="text-muted-foreground text-center mb-14 max-w-xl mx-auto">التقييم مصمم خصيصاً للفئات التالية</p>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Calculator, title: 'المحاسبين', desc: 'تقييم شامل لمهاراتك المحاسبية عبر 5 محاور متخصصة لمعرفة مستواك الحقيقي وتطويره' },
              { icon: UserCheck, title: 'مسؤولي التوظيف', desc: 'أداة موثوقة لتقييم كفاءة المحاسبين المرشحين واتخاذ قرارات توظيف مبنية على بيانات دقيقة' },
              { icon: Briefcase, title: 'مسؤولي الإدارة المالية', desc: 'تقييم فريق المحاسبة لديك وتحديد الاحتياجات التدريبية لرفع كفاءة الأداء المالي' },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 150}>
                <div className="rounded-xl p-7 border border-border bg-card hover:shadow-lg transition-all duration-300 text-center">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-14">كيف يعمل التقييم؟</h2>
          </FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { step: '١', label: 'سجّل بياناتك' },
              { step: '٢', label: 'ادفع رسوم التقييم' },
              { step: '٣', label: 'أجب على 45 سؤال' },
              { step: '٤', label: 'احصل على تقريرك' },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 150} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-foreground text-white flex items-center justify-center font-bold text-lg mb-4">
                  {item.step}
                </div>
                <p className="text-foreground font-medium">{item.label}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-foreground">
        <FadeUp>
          <div className="max-w-2xl mx-auto text-center">
            <Shield className="w-10 h-10 text-white/80 mx-auto mb-5" />
            <h2 className="text-3xl font-bold text-white mb-4">جاهز لمعرفة مستواك؟</h2>
            <p className="text-white/60 mb-8">ابدأ الآن واحصل على تقييم شامل لمهاراتك المحاسبية</p>
            <Button
              onClick={() => setCurrentStep(2)}
              className="h-12 px-10 text-base font-semibold bg-white text-foreground hover:bg-white/90 rounded-lg"
            >
              ابدأ التقييم الآن
            </Button>
          </div>
        </FadeUp>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center">
        <img src={logoWhite} alt="هامش" className="h-8 mx-auto mb-3 opacity-30 brightness-0" />
        <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} هامش — جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default Landing;
