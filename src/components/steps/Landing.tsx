import { useApp } from '@/context/AppContext';
import { CheckCircle, BarChart3, FileText, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';

const Landing = () => {
  const { setCurrentStep } = useApp();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-4 py-2 rounded-full border border-accent/30 bg-accent/10">
            <span className="text-accent text-sm font-medium">منصة هامش للتقييم المهني</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            قيّم مستواك المحاسبي
            <br />
            <span className="text-gradient-gold">بدقة احترافية</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            اختبار متخصص حسب قطاعك + تقرير تفصيلي + جلسة استشارية مع خبراء المحاسبة
          </p>
          <Button
            onClick={() => setCurrentStep(2)}
            className="h-14 px-10 text-lg font-bold bg-gradient-gold hover:opacity-90 text-accent-foreground rounded-xl animate-pulse-glow"
          >
            ابدأ اختبار المحاسبين ←
          </Button>
          <p className="mt-4 text-primary-foreground/50 text-sm">
            عدد المقاعد الاستشارية محدود — سجّل الآن
          </p>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-14">لماذا اختبار هامش؟</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BarChart3, title: 'تحليل دقيق', desc: 'تقييم شامل عبر 5 محاور محاسبية متخصصة حسب قطاعك' },
              { icon: FileText, title: 'تقرير مفصل', desc: 'تقرير احترافي يوضح نقاط القوة والضعف مع خطة تطوير' },
              { icon: GraduationCap, title: 'توصيات تدريبية', desc: 'دورات مخصصة لتطوير المحاور التي تحتاج تحسين' },
            ].map((item, i) => (
              <div key={i} className="bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-300 text-center group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-14">كيف يعمل التقييم؟</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {['سجّل بياناتك', 'ادفع رسوم الاختبار', 'أجب على 45 سؤال', 'احصل على تقريرك'].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg mb-4">
                  {i + 1}
                </div>
                <p className="text-foreground font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
