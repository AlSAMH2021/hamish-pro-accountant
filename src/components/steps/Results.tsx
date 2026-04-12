import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import StepperLayout from '@/components/StepperLayout';
import { AXES, AXIS_RECOMMENDATIONS, Axis, getPerformanceColor } from '@/data/types';
import { CheckCircle, XCircle, Trophy, ArrowLeft, Download, Linkedin, Twitter, BookOpen } from 'lucide-react';
import badgeImage from '@/assets/badge-passed.png';
import { useRef, useCallback } from 'react';

const Results = () => {
  const { examResult, user, setCurrentStep } = useApp();
  const badgeCardRef = useRef<HTMLDivElement>(null);

  const downloadBadge = useCallback(() => {
    const link = document.createElement('a');
    link.href = badgeImage;
    link.download = `hamesh-badge-${user?.name || 'certified'}.png`;
    link.click();
  }, [user]);

  if (!examResult) return null;

  const { totalScore, performanceLevel, passed, axisScores, axisPassed } = examResult;
  const completionDate = new Date(examResult.completedAt).toLocaleDateString('ar-SA', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const pctTotal = Math.round((totalScore / 45) * 100);

  const shareText = `🏅 حصلت على شارة اجتياز تقييم هامش للمحاسبين المعتمدين!\nالمستوى: ${performanceLevel}\nالنتيجة: ${totalScore}/45\n`;
  const shareUrl = window.location.origin;

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`, '_blank');
  };
  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  return (
    <StepperLayout activePage="results">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Score Hero - Big circular score */}
        <div className="bg-card rounded-2xl shadow-elevated p-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Circular score */}
            <div className="relative w-40 h-40 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke={passed ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(pctTotal / 100) * 327} 327`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-foreground">{pctTotal}%</span>
                <span className="text-xs text-muted-foreground">{totalScore}/45</span>
              </div>
            </div>

            <div className="text-center md:text-right flex-1">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Trophy className={`w-6 h-6 ${passed ? 'text-success' : 'text-destructive'}`} />
                <h1 className="text-2xl font-bold text-foreground">{passed ? 'مبروك! اجتزت التقييم' : 'لم تجتز التقييم'}</h1>
              </div>
              <p className={`text-lg font-bold mb-3 ${getPerformanceColor(performanceLevel)}`}>{performanceLevel}</p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                passed ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
              }`}>
                {passed ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {passed ? 'ناجح — تم الاجتياز بنجاح' : 'لم يجتز — يمكنك المحاولة مرة أخرى'}
              </div>
            </div>
          </div>
        </div>

        {/* Axis Breakdown - Visual bars */}
        <div className="bg-card rounded-2xl shadow-card p-6 animate-fade-in-up">
          <h2 className="text-lg font-bold text-foreground mb-5">أداء المحاور</h2>
          <div className="space-y-4">
            {AXES.map(({ key, label, icon }) => {
              const score = axisScores[key];
              const ap = axisPassed[key];
              const pct = Math.round((score / 9) * 100);
              return (
                <div key={key} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-foreground font-medium flex items-center gap-2 text-sm">
                      <span className="text-lg">{icon}</span> {label}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${ap ? 'text-success' : 'text-destructive'}`}>{pct}%</span>
                      <span className="text-xs text-muted-foreground">{score}/9</span>
                      {ap ? <CheckCircle className="w-4 h-4 text-success" /> : <XCircle className="w-4 h-4 text-destructive" />}
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-700 ${ap ? 'bg-success' : 'bg-destructive'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Course Recommendations */}
        {(() => {
          const weakAxes = AXES.filter(({ key }) => (axisScores[key as Axis] / 9) < 0.5);
          if (weakAxes.length === 0) return null;
          return (
            <div className="bg-card rounded-2xl shadow-card p-6 animate-fade-in-up">
              <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                دورات مقترحة لتطوير أدائك
              </h2>
              <p className="text-sm text-muted-foreground mb-4">بناءً على نتائجك، نرشح لك هذه الدورات:</p>
              <div className="space-y-3">
                {weakAxes.map(({ key, label, icon }) => {
                  const rec = AXIS_RECOMMENDATIONS[key as Axis];
                  const score = axisScores[key as Axis];
                  const pct = Math.round((score / 9) * 100);
                  return (
                    <div key={key} className="flex items-center gap-4 p-4 rounded-xl bg-warning/5 border border-warning/20">
                      <span className="text-2xl">{icon}</span>
                      <div className="flex-1">
                        <p className="font-bold text-foreground text-sm">{rec.course}</p>
                        <p className="text-xs text-muted-foreground">{label} — نتيجتك: {pct}%</p>
                      </div>
                      <span className="text-xs bg-warning/10 text-warning px-3 py-1 rounded-full font-bold">{rec.hours}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Badge Card for passed users */}
        {passed && (
          <div className="bg-card rounded-2xl shadow-elevated overflow-hidden animate-fade-in-up">
            <div className="bg-gradient-to-l from-[hsl(var(--brand-navy))] to-[hsl(var(--brand-navy)/0.85)] px-6 py-3">
              <h2 className="text-primary-foreground text-base font-bold text-center">شارة اجتياز تقييم هامش</h2>
            </div>
            <div ref={badgeCardRef} className="p-6 flex flex-col items-center">
              <div className="w-36 h-36 mb-4">
                <img src={badgeImage} alt="شارة اجتياز" className="w-full h-full object-contain drop-shadow-xl" />
              </div>
              <div className="text-center space-y-1 mb-4">
                <h3 className="text-lg font-bold text-foreground">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">{completionDate} • {performanceLevel}</p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={shareLinkedIn} variant="outline" className="gap-2 rounded-xl h-10 text-sm">
                    <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                    LinkedIn
                  </Button>
                  <Button onClick={shareTwitter} variant="outline" className="gap-2 rounded-xl h-10 text-sm">
                    <Twitter className="w-4 h-4" />
                    X
                  </Button>
                </div>
                <Button onClick={downloadBadge} variant="secondary" className="w-full gap-2 rounded-xl h-10 text-sm">
                  <Download className="w-4 h-4" />
                  تحميل الشارة
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-card rounded-2xl shadow-card p-6 text-center animate-fade-in-up">
          <h2 className="text-lg font-bold text-foreground mb-2">الخطوة التالية</h2>
          <p className="text-muted-foreground text-sm mb-4">احجز جلستك الاستشارية للحصول على التقرير الكامل</p>
          <Button
            onClick={() => setCurrentStep(7)}
            className="h-12 px-8 text-base font-bold bg-gradient-gold text-accent-foreground rounded-xl gap-2"
          >
            احجز جلستك الاستشارية
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </StepperLayout>
  );
};

export default Results;
