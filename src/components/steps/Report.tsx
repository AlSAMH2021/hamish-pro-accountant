import { useApp } from '@/context/AppContext';
import StepperLayout from '@/components/StepperLayout';
import { AXES, AXIS_RECOMMENDATIONS, SECTOR_LABELS, getPerformanceColor } from '@/data/types';
import { getQuestionsBySetor, correctAnswers } from '@/data/questions';
import { CheckCircle, XCircle, Share2, FileText, Award, CalendarDays, BookOpen, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts';

const Report = () => {
  const { user, examResult, booking, sessionCompleted, setCurrentStep } = useApp();

  if (!user || !examResult) {
    return (
      <StepperLayout activePage="report">
        <div className="max-w-lg mx-auto text-center py-16 space-y-6">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
            <FileText className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">لا يوجد تقرير</h1>
          <p className="text-muted-foreground">يرجى إكمال التقييم أولاً.</p>
        </div>
      </StepperLayout>
    );
  }

  if (!sessionCompleted) {
    return (
      <StepperLayout activePage="report">
        <div className="max-w-lg mx-auto text-center py-16 space-y-6">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
            <CalendarDays className="w-10 h-10 text-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">التقرير قيد الإعداد</h1>
          <p className="text-muted-foreground leading-relaxed">
            سيتم عرض التقرير التفصيلي بعد إتمام الجلسة الاستشارية.
          </p>
          {booking && (
            <div className="rounded-2xl border border-border p-5 text-right space-y-3 max-w-sm mx-auto">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <CalendarDays className="w-5 h-5 text-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">موعد جلستك</p>
                  <p className="text-foreground font-medium text-sm">{booking.date} — {booking.time}</p>
                </div>
              </div>
            </div>
          )}
          {!booking && (
            <Button onClick={() => setCurrentStep(7)} className="gap-2 rounded-lg bg-foreground text-background hover:bg-foreground/90">
              <CalendarDays className="w-4 h-4" />
              احجز جلستك الاستشارية
            </Button>
          )}
        </div>
      </StepperLayout>
    );
  }

  const { totalScore, performanceLevel, passed, axisScores, axisPassed, answers } = examResult;
  const questions = getQuestionsBySetor(user.sector);
  const correct = correctAnswers[user.sector];
  const failedAxes = AXES.filter(({ key }) => !axisPassed[key]);
  const correctCount = questions.filter((_, i) => answers[i] === correct[i]).length;
  const wrongCount = questions.length - correctCount;
  const radarChartData = [
    { shortLabel: 'المالية', fullLabel: 'المحاسبة المالية', icon: '📊', score: axisScores['financial'], fullMark: 9 },
    { shortLabel: 'التكاليف', fullLabel: 'محاسبة التكاليف', icon: '💰', score: axisScores['cost'], fullMark: 9 },
    { shortLabel: 'الضرائب', fullLabel: 'الضرائب والزكاة', icon: '🧾', score: axisScores['tax'], fullMark: 9 },
    { shortLabel: 'التشريعات', fullLabel: 'التشريعات والأنظمة', icon: '⚖️', score: axisScores['regulations'], fullMark: 9 },
    { shortLabel: 'IFRS', fullLabel: 'المعايير الدولية IFRS', icon: '🌐', score: axisScores['ifrs'], fullMark: 9 },
  ];

  return (
    <StepperLayout activePage="report">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl border border-border p-8">
          <div className="absolute top-0 left-0 w-full h-1 bg-foreground" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                <Award className="w-8 h-8 text-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">تقرير الأداء التفصيلي</h1>
                <p className="text-muted-foreground text-sm mt-1">هامش — تقييم المحاسبين • {SECTOR_LABELS[user.sector]}</p>
              </div>
            </div>
            <div className={`text-center px-8 py-4 rounded-2xl border ${passed ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'}`}>
              <p className="text-3xl font-bold text-foreground">{totalScore}<span className="text-lg text-muted-foreground">/45</span></p>
              <p className={`text-sm font-bold mt-1 ${getPerformanceColor(performanceLevel)}`}>{performanceLevel}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'الإجابات الصحيحة', value: correctCount, icon: <CheckCircle className="w-5 h-5" />, color: 'text-success', bg: 'bg-success/10' },
            { label: 'الإجابات الخاطئة', value: wrongCount, icon: <XCircle className="w-5 h-5" />, color: 'text-destructive', bg: 'bg-destructive/10' },
            { label: 'المحاور الناجحة', value: AXES.filter(a => axisPassed[a.key]).length, icon: <TrendingUp className="w-5 h-5" />, color: 'text-foreground', bg: 'bg-muted' },
            { label: 'تحتاج تطوير', value: failedAxes.length, icon: <AlertTriangle className="w-5 h-5" />, color: 'text-warning', bg: 'bg-warning/10' },
          ].map((stat, i) => (
            <div key={i} className="rounded-2xl border border-border p-5 text-center">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mx-auto mb-3 ${stat.color}`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border p-6">
            <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
              خريطة الكفاءات
            </h2>
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarChartData} cx="50%" cy="50%" outerRadius="52%">
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="shortLabel" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} />
                  <PolarRadiusAxis angle={90} domain={[0, 9]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} tickCount={4} />
                  <Radar name="الدرجة" dataKey="score" stroke="hsl(var(--foreground))" fill="hsl(var(--foreground))" fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {radarChartData.map((axis) => (
                  <div key={axis.shortLabel} className="flex items-start gap-3 rounded-xl bg-muted/50 px-3 py-2">
                    <span className="mt-0.5 text-base leading-none">{axis.icon}</span>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-foreground">{axis.shortLabel}</p>
                      <p className="text-xs leading-relaxed text-muted-foreground">{axis.fullLabel}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border p-6">
            <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-muted-foreground" />
              أداء المحاور
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={[
                  { name: 'المالية', score: axisScores['financial'], key: 'financial' },
                  { name: 'التكاليف', score: axisScores['cost'], key: 'cost' },
                  { name: 'الضرائب', score: axisScores['tax'], key: 'tax' },
                  { name: 'التشريعات', score: axisScores['regulations'], key: 'regulations' },
                  { name: 'IFRS', score: axisScores['ifrs'], key: 'ifrs' },
                ]}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} interval={0} tickLine={false} axisLine={{ stroke: 'hsl(var(--border))' }} />
                <YAxis domain={[0, 9]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} width={30} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12, direction: 'rtl' }}
                  formatter={(value: number) => [`${value}/9`, 'الدرجة']}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={40}>
                  {AXES.map(({ key }) => (
                    <Cell key={key} fill={axisPassed[key] ? 'hsl(var(--success))' : 'hsl(var(--destructive))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-border p-6 lg:col-span-2">
            <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-muted-foreground" />
              نسبة الإجابات
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie
                    data={[{ name: 'صحيحة', value: correctCount }, { name: 'خاطئة', value: wrongCount }]}
                    cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value" strokeWidth={0}
                  >
                    <Cell fill="hsl(var(--success))" />
                    <Cell fill="hsl(var(--destructive))" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-sm text-foreground font-medium">صحيحة: {correctCount}</span>
                  <span className="text-xs text-muted-foreground">({Math.round((correctCount / questions.length) * 100)}%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-sm text-foreground font-medium">خاطئة: {wrongCount}</span>
                  <span className="text-xs text-muted-foreground">({Math.round((wrongCount / questions.length) * 100)}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="rounded-2xl border border-border p-6">
          <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-muted-foreground" />
            بيانات المتقدم
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              ['الاسم', user.name],
              ['الشركة', user.company],
              ['القطاع', SECTOR_LABELS[user.sector]],
              ['الوظيفة', user.jobTitle],
              ['تاريخ التقييم', new Date(examResult.completedAt).toLocaleDateString('ar-SA')],
              ['الحالة', passed ? 'ناجح ✅' : 'لم يجتز ❌'],
            ].map(([label, value]) => (
              <div key={label} className="bg-muted/50 rounded-xl p-3">
                <p className="text-muted-foreground text-xs">{label}</p>
                <p className="text-foreground font-medium text-sm mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Axis Breakdown */}
        <div className="rounded-2xl border border-border p-6">
          <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
            تحليل المحاور
          </h2>
          <div className="space-y-3">
            {AXES.map(({ key, label, icon }) => {
              const score = axisScores[key];
              const ap = axisPassed[key];
              const pct = Math.round((score / 9) * 100);
              return (
                <div key={key} className={`rounded-xl border p-4 ${ap ? 'border-success/20 bg-success/5' : 'border-destructive/20 bg-destructive/5'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{icon}</span>
                      <span className="font-medium text-foreground text-sm">{label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-foreground">{score}/9</span>
                      {ap ? <CheckCircle className="w-4 h-4 text-success" /> : <XCircle className="w-4 h-4 text-destructive" />}
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted/50">
                    <div className={`h-full rounded-full transition-all ${ap ? 'bg-success' : 'bg-destructive'}`} style={{ width: `${pct}%` }} />
                  </div>
                  {!ap && (
                    <p className="text-xs text-muted-foreground mt-2">
                      📚 التوصية: {AXIS_RECOMMENDATIONS[key].course} ({AXIS_RECOMMENDATIONS[key].hours} ساعة)
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Questions Review */}
        <div className="space-y-6">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-muted-foreground" />
            مراجعة تفصيلية للأسئلة
          </h2>

          {AXES.map(({ key, label, icon }) => {
            const axisQuestions = questions
              .map((q, i) => ({ q, i }))
              .filter(({ q }) => q.axis === key);

            return (
              <div key={key} className="rounded-2xl border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{icon}</span>
                      <h3 className="font-bold text-foreground text-sm">{label}</h3>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {axisScores[key]}/9
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {axisQuestions.map(({ q, i }) => {
                    const userAnswer = answers[i];
                    const correctAnswer = correct[i];
                    const isCorrect = userAnswer === correctAnswer;
                    return (
                      <div key={i} className="px-6 py-4">
                        <div className="flex items-start gap-3 mb-3">
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                          )}
                          <p className="text-sm text-foreground leading-relaxed">{q.text}</p>
                        </div>
                        <div className="mr-8 space-y-1.5">
                          {q.options.map((opt, oi) => {
                            let optClass = 'bg-muted/30 text-muted-foreground';
                            if (oi === correctAnswer) optClass = 'bg-success/10 text-success font-medium';
                            else if (oi === userAnswer && !isCorrect) optClass = 'bg-destructive/10 text-destructive line-through';
                            return (
                              <div key={oi} className={`text-xs px-3 py-2 rounded-lg ${optClass}`}>
                                {['أ', 'ب', 'ج', 'د'][oi]}. {opt}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </StepperLayout>
  );
};

export default Report;
