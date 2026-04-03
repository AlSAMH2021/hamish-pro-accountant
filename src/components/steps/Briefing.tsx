import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Clock, Target, BookOpen, CheckCircle, AlertTriangle } from 'lucide-react';

const Briefing = () => {
  const { setCurrentStep, user } = useApp();

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">مرحبًا {user?.name}</h1>
          <p className="text-muted-foreground">إليك تفاصيل الاختبار قبل البدء</p>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-8 space-y-8">
          {/* Exam Details */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              تفاصيل الاختبار
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'عدد الأسئلة', value: '45 سؤال', icon: '📝' },
                { label: 'المحاور', value: '5 محاور × 9 أسئلة', icon: '📊' },
                { label: 'المدة', value: '60 دقيقة', icon: '⏱' },
                { label: 'نوع الأسئلة', value: 'اختيار من متعدد', icon: '✅' },
              ].map((item, i) => (
                <div key={i} className="bg-muted/50 rounded-xl p-4 text-center">
                  <span className="text-2xl mb-2 block">{item.icon}</span>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="font-bold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pass Criteria */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              شروط النجاح
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-success/10 rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-success mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">المجموع الكلي: 25 من 45 (54%)</p>
                  <p className="text-sm text-muted-foreground">يجب تحقيق 25 درجة على الأقل</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-warning/10 rounded-xl p-4">
                <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">الحد الأدنى لكل محور: 6 من 9 (67%)</p>
                  <p className="text-sm text-muted-foreground">يجب اجتياز كل محور على حدة</p>
                </div>
              </div>
            </div>
          </div>

          {/* Goal */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              الهدف من التقييم
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-2"><span className="text-primary">●</span> قياس المستوى الحقيقي في المحاسبة</li>
              <li className="flex gap-2"><span className="text-primary">●</span> تحديد نقاط الضعف بدقة</li>
              <li className="flex gap-2"><span className="text-primary">●</span> بناء خطة تطوير مهني شخصية</li>
            </ul>
          </div>

          <Button
            onClick={() => setCurrentStep(4)}
            className="w-full h-14 text-lg font-bold bg-gradient-gold text-accent-foreground rounded-xl"
          >
            المتابعة للدفع ←
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Briefing;
