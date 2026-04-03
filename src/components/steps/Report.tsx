import { useApp } from '@/context/AppContext';
import { AXES, AXIS_RECOMMENDATIONS, SECTOR_LABELS, getPerformanceColor, Axis } from '@/data/types';
import { getQuestionsBySetor, correctAnswers } from '@/data/questions';
import { CheckCircle, XCircle, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Report = () => {
  const { user, examResult, booking } = useApp();
  if (!user || !examResult) return null;

  const { totalScore, performanceLevel, passed, axisScores, axisPassed, answers } = examResult;
  const questions = getQuestionsBySetor(user.sector);
  const correct = correctAnswers[user.sector];

  const failedAxes = AXES.filter(({ key }) => !axisPassed[key]);

  const shareText = `أتممت تقييم هامش للمحاسبين\nمستواي: ${performanceLevel}\nالنتيجة: ${totalScore}/45`;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-card rounded-2xl shadow-elevated p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">تقرير الأداء</h1>
              <p className="text-muted-foreground">هامش — تقييم المحاسبين</p>
            </div>
            <div className={`text-center px-6 py-3 rounded-2xl ${passed ? 'bg-success/10' : 'bg-destructive/10'}`}>
              <p className="text-3xl font-bold text-foreground">{totalScore}/45</p>
              <p className={`font-bold ${getPerformanceColor(performanceLevel)}`}>{performanceLevel}</p>
            </div>
          </div>

          {/* User Info */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {[
              ['الاسم', user.name],
              ['الشركة', user.company],
              ['القطاع', SECTOR_LABELS[user.sector]],
              ['الوظيفة', user.jobTitle],
              ['تاريخ الاختبار', new Date(examResult.completedAt).toLocaleDateString('ar-SA')],
              ['الحالة', passed ? 'ناجح ✅' : 'لم يجتز ❌'],
            ].map(([label, value]) => (
              <div key={label} className="bg-muted/50 rounded-xl p-3">
                <p className="text-muted-foreground text-xs">{label}</p>
                <p className="text-foreground font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Axis Breakdown Table */}
        <div className="bg-card rounded-2xl shadow-card p-8 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-6">تفاصيل المحاور</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-right p-3 text-muted-foreground font-medium">المحور</th>
                  <th className="text-center p-3 text-muted-foreground font-medium">الدرجة</th>
                  <th className="text-center p-3 text-muted-foreground font-medium">الحالة</th>
                  <th className="text-right p-3 text-muted-foreground font-medium">التوصية</th>
                </tr>
              </thead>
              <tbody>
                {AXES.map(({ key, label, icon }) => {
                  const score = axisScores[key];
                  const ap = axisPassed[key];
                  const rec = AXIS_RECOMMENDATIONS[key];
                  return (
                    <tr key={key} className="border-b border-border/50">
                      <td className="p-3 font-medium text-foreground">{icon} {label}</td>
                      <td className="p-3 text-center font-bold text-foreground">{score}/9</td>
                      <td className="p-3 text-center">
                        {ap ? <CheckCircle className="w-5 h-5 text-success mx-auto" /> : <XCircle className="w-5 h-5 text-destructive mx-auto" />}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {ap ? '—' : `${rec.course} (${rec.hours} ساعة)`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Questions Review */}
        <div className="bg-card rounded-2xl shadow-card p-8 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-6">مراجعة الأسئلة</h2>
          <div className="space-y-4">
            {questions.map((q, i) => {
              const userAnswer = answers[i];
              const correctAnswer = correct[i];
              const isCorrect = userAnswer === correctAnswer;

              return (
                <div key={i} className={`rounded-xl border-2 p-5 ${isCorrect ? 'border-success/20 bg-success/5' : 'border-destructive/20 bg-destructive/5'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <p className="font-medium text-foreground text-sm flex-1">{i + 1}. {q.text}</p>
                    {isCorrect ? <CheckCircle className="w-5 h-5 text-success shrink-0 mr-2" /> : <XCircle className="w-5 h-5 text-destructive shrink-0 mr-2" />}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {q.options.map((opt, oi) => (
                      <div
                        key={oi}
                        className={`px-3 py-2 rounded-lg ${
                          oi === correctAnswer
                            ? 'bg-success/20 text-success font-medium'
                            : oi === userAnswer && !isCorrect
                            ? 'bg-destructive/20 text-destructive line-through'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {['أ', 'ب', 'ج', 'د'][oi]}. {opt}
                        {oi === correctAnswer && ' ✅'}
                        {oi === userAnswer && !isCorrect && ' ❌'}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Development Plan */}
        {failedAxes.length > 0 && (
          <div className="bg-card rounded-2xl shadow-card p-8 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-6">خطة التطوير المهني</h2>
            <div className="space-y-4">
              {failedAxes.map(({ key, label, icon }) => {
                const rec = AXIS_RECOMMENDATIONS[key];
                return (
                  <div key={key} className="flex items-center gap-4 bg-warning/10 rounded-xl p-5">
                    <span className="text-3xl">{icon}</span>
                    <div className="flex-1">
                      <p className="font-bold text-foreground">{label}</p>
                      <p className="text-muted-foreground">{rec.course}</p>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-foreground">{rec.hours} ساعة</p>
                      <p className="text-xs text-muted-foreground">تدريبية</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Social Badge */}
        <div className="bg-gradient-hero rounded-2xl p-8 text-center text-primary-foreground mb-8">
          <h2 className="text-2xl font-bold mb-4">شارك إنجازك</h2>
          <div className="bg-card/10 backdrop-blur rounded-2xl p-6 max-w-sm mx-auto mb-6 border border-primary-foreground/20">
            <p className="text-lg font-bold mb-1">أتممت تقييم هامش للمحاسبين</p>
            <p className="text-accent text-2xl font-bold mb-1">{performanceLevel}</p>
            <p className="text-primary-foreground/80">{totalScore}/45</p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(shareText)}`, '_blank')}
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Share2 className="w-4 h-4 ml-2" />
              LinkedIn
            </Button>
            <Button
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank')}
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Share2 className="w-4 h-4 ml-2" />
              X
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
