import { useApp } from '@/context/AppContext';
import { BarChart3, FileText, GraduationCap, ArrowLeft, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoWhite from '@/assets/logo-white.png';

const Landing = () => {
  const { setCurrentStep } = useApp();

  return (
    <div className="min-h-screen bg-[hsl(220,50%,13%)]" dir="rtl">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent/8 blur-[150px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/[0.03]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.05]" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-sm">
            <Award className="w-4 h-4 text-accent" />
            <span className="text-accent text-sm font-semibold">منصة هامش للتقييم المهني</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            قيّم مستواك المحاسبي
            <br />
            <span className="text-gradient-gold">بدقة احترافية</span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            اختبار متخصص حسب قطاعك + تقرير تفصيلي + جلسة استشارية مع خبراء المحاسبة
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => setCurrentStep(2)}
              className="h-14 px-10 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl gap-3 shadow-[0_0_30px_hsl(40,70%,50%,0.25)]"
            >
              <span>ابدأ اختبار المحاسبين</span>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => setCurrentStep(9)}
              variant="outline"
              className="h-14 px-10 text-lg font-bold border-white/20 text-white hover:bg-white/10 rounded-xl bg-transparent"
            >
              تسجيل الدخول
            </Button>
          </div>

          <p className="mt-6 text-white/30 text-sm">
            عدد المقاعد الاستشارية محدود — سجّل الآن
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-5xl mx-auto py-10 px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '+500', label: 'محاسب مُقيَّم' },
            { value: '45', label: 'سؤال متخصص' },
            { value: '5', label: 'محاور تقييم' },
            { value: '%95', label: 'نسبة الرضا' },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-3xl font-bold text-accent mb-1">{stat.value}</p>
              <p className="text-white/50 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 px-4 bg-[hsl(220,50%,13%)]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">لماذا اختبار هامش؟</h2>
          <p className="text-white/40 text-center mb-16 max-w-xl mx-auto">نقدم لك أدوات تقييم احترافية تساعدك على معرفة مستواك الحقيقي</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: BarChart3, title: 'تحليل دقيق', desc: 'تقييم شامل عبر 5 محاور محاسبية متخصصة حسب قطاعك' },
              { icon: FileText, title: 'تقرير مفصل', desc: 'تقرير احترافي يوضح نقاط القوة والضعف مع خطة تطوير' },
              { icon: GraduationCap, title: 'توصيات تدريبية', desc: 'دورات مخصصة لتطوير المحاور التي تحتاج تحسين' },
            ].map((item, i) => (
              <div key={i} className="group rounded-2xl p-8 border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300 text-center">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                  <item.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/50 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 px-4 bg-[hsl(220,45%,11%)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">كيف يعمل التقييم؟</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '١', label: 'سجّل بياناتك' },
              { step: '٢', label: 'ادفع رسوم الاختبار' },
              { step: '٣', label: 'أجب على 45 سؤال' },
              { step: '٤', label: 'احصل على تقريرك' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-xl mb-5">
                  {item.step}
                </div>
                <p className="text-white/80 font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-[hsl(220,50%,13%)]">
        <div className="max-w-2xl mx-auto text-center">
          <Shield className="w-12 h-12 text-accent mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">جاهز لمعرفة مستواك؟</h2>
          <p className="text-white/50 mb-10">ابدأ الآن واحصل على تقييم شامل لمهاراتك المحاسبية</p>
          <Button
            onClick={() => setCurrentStep(2)}
            className="h-14 px-12 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl shadow-[0_0_30px_hsl(40,70%,50%,0.25)]"
          >
            ابدأ الاختبار الآن
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-4 text-center">
        <p className="text-white/30 text-sm">© {new Date().getFullYear()} هامش — جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default Landing;
