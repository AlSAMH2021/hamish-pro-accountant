import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Clock, Target, BookOpen, CheckCircle, ArrowLeft } from 'lucide-react';
import logoColor from '@/assets/logo-color.png';

const Briefing = () => {
  const { setCurrentStep, user } = useApp();

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <nav className="border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-center">
          <img src={logoColor} alt="هامش" className="h-9" />
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Welcome */}
        <div className="rounded-2xl border border-border p-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">مرحبًا {user?.name} 👋</h2>
          <p className="text-muted-foreground">إليك تفاصيل التقييم قبل البدء</p>
        </div>

        {/* Exam Details */}
        <div className="rounded-2xl border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-muted-foreground" />
            تفاصيل التقييم
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'عدد الأسئلة', value: '45 سؤال', icon: '📝' },
              { label: 'المحاور', value: '5 محاور', icon: '📊' },
              { label: 'المدة', value: '60 دقيقة', icon: '⏱' },
              { label: 'النوع', value: 'اختيار من متعدد', icon: '✅' },
            ].map((item, i) => (
              <div key={i} className="bg-muted/50 rounded-xl p-4 text-center">
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="font-bold text-foreground text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pass Criteria */}
        <div className="rounded-2xl border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-muted-foreground" />
            شروط النجاح
          </h3>
          <div className="flex items-start gap-3 bg-success/5 border border-success/20 rounded-xl p-4">
            <CheckCircle className="w-5 h-5 text-success mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-foreground text-sm">المجموع الكلي: أكثر من 50%</p>
              <p className="text-xs text-muted-foreground">يجب الإجابة على أكثر من نصف الأسئلة بشكل صحيح</p>
            </div>
          </div>
        </div>

        {/* Goal */}
        <div className="rounded-2xl border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-muted-foreground" />
            الهدف من التقييم
          </h3>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li className="flex gap-2"><span className="text-foreground">●</span> قياس المستوى الحقيقي في المحاسبة</li>
            <li className="flex gap-2"><span className="text-foreground">●</span> تحديد نقاط الضعف بدقة</li>
            <li className="flex gap-2"><span className="text-foreground">●</span> بناء خطة تطوير مهني شخصية</li>
          </ul>
        </div>

        <Button
          onClick={() => setCurrentStep(4)}
          className="w-full h-12 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-lg"
        >
          <span className="flex items-center gap-2">
            المتابعة للدفع
            <ArrowLeft className="w-5 h-5" />
          </span>
        </Button>
      </div>
    </div>
  );
};

export default Briefing;
