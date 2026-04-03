import { useApp } from '@/context/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { AXES, AXIS_RECOMMENDATIONS, SECTOR_LABELS, getPerformanceColor } from '@/data/types';
import { getQuestionsBySetor, correctAnswers } from '@/data/questions';
import { CheckCircle, XCircle, Share2, FileText, Award } from 'lucide-react';
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
    <DashboardLayout activePage="report">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-card rounded-2xl shadow-elevated p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Award className="w-7 h-7 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">تقرير الأداء</h1>
                <p className="text-muted-foreground text-sm">هامش — تقييم المحاسبين</p>
              </div>
            </div>
            <div className={`text-center px-5 py-3 rounded-2xl ${passed ? 'bg-success/10' : 'bg-destructive/10'}`}>
              <p className="text-2xl font-bold text-foreground">{totalScore}/45</p>
              <p className={`text-sm font-bold ${getPerformanceColor(performanceLevel)}`}>{performanceLevel}</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-card rounded-2xl shadow-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">بيانات المتقدم</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              ['الاسم', user.name],
              ['الشركة', user.company],
              ['القطاع', SECTOR_LABELS[user.sector]],
              ['الوظيفة', user.jobTitle],
              ['تاريخ الاختبار', new Date(examResult.completedAt).toLocaleDateString('ar-SA')],
              ['الحالة', passed ? 'ناجح ✅' : 'لم يجتز ❌'],
            ].map(([label, value]) => (
              <div key={label} className="bg-muted/30 rounded-xl p-3">
                <p className="text-muted-foreground text-xs">{label}</p>
                <p className="text-foreground font-medium text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Axis Breakdown */}
        <div className="bg-card rounded-2xl shadow-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-5">تفاصيل المحاور</h2>
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
                      <td className="p-3 text-muted-foreground text-xs">
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
        <div className="bg-card rounded-2xl shadow-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-5">مراجعة الأسئلة</h2>
          <div className="space-y-3">
            {questions.map((q, i) => {
              const userAnswer = answers[i];
              const correctAnswer = correct[i];
              const isCorrect = userAnswer === correctAnswer;
              return (
                <details key={i} className={`rounded-xl border-2 overflow-hidden ${isCorrect ? 'border-success/20' : 'border-destructive/20'}`}>
                  <summary className={`p-4 cursor-pointer flex items-center gap-3 ${isCorrect ? 'bg-success/5' : 'bg-destructive/5'}`}>
                    {isCorrect ? <CheckCircle className="w-4 h-4 text-success shrink-0" /> : <XCircle className="w-4 h-4 text-destructive shrink-0" />}
                    <span className="text-foreground text-sm font-medium flex-1">{i + 1}. {q.text}</span>
                  </summary>
                  <div className="p-4 bg-card grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {q.options.map((opt, oi) => (
                      <div
                        key={oi}
                        className={`px-3 py-2 rounded-lg ${
                          oi === correctAnswer ? 'bg-success/15 text-success font-medium'
                          : oi === userAnswer && !isCorrect ? 'bg-destructive/15 text-destructive line-through'
                          : 'text-muted-foreground'
                        }`}
                      >
                        {['أ', 'ب', 'ج', 'د'][oi]}. {opt}
                      </div>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        </div>

        {/* Dev Plan */}
        {failedAxes.length > 0 && (
          <div className="bg-card rounded-2xl shadow-card p-6">
            <h2 className="text-lg font-bold text-foreground mb-5">خطة التطوير المهني</h2>
            <div className="space-y-3">
              {failedAxes.map(({ key, label, icon }) => {
                const rec = AXIS_RECOMMENDATIONS[key];
                return (
                  <div key={key} className="flex items-center gap-4 bg-warning/10 rounded-xl p-4">
                    <span className="text-2xl">{icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm">{label}</p>
                      <p className="text-muted-foreground text-xs">{rec.course}</p>
                    </div>
                    <div className="text-left shrink-0">
                      <p className="font-bold text-foreground text-sm">{rec.hours} ساعة</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Share */}
        <div className="bg-card rounded-2xl shadow-card p-6 text-center">
          <h2 className="text-lg font-bold text-foreground mb-4">شارك إنجازك</h2>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(shareText)}`, '_blank')}
              variant="outline"
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              LinkedIn
            </Button>
            <Button
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank')}
              variant="outline"
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              X
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Report;
