import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';
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

  const shareText = `🏅 حصلت على شارة اجتياز تقييم هامش للمحاسبين المعتمدين!\nالمستوى: ${performanceLevel}\nالنتيجة: ${totalScore}/45\n\nتحقق من شارتي:\n`;
  const shareUrl = window.location.origin;

  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`,
      '_blank'
    );
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };


  return (
    <DashboardLayout activePage="results">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Score Hero */}
        <div className="bg-card rounded-2xl shadow-elevated p-8 text-center animate-fade-in-up">
          <Trophy className={`w-14 h-14 mx-auto mb-3 ${passed ? 'text-success' : 'text-destructive'}`} />
          <h1 className="text-4xl font-bold text-foreground mb-1">{totalScore} / 45</h1>
          <p className={`text-lg font-bold mb-3 ${getPerformanceColor(performanceLevel)}`}>{performanceLevel}</p>
          <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold ${
            passed ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          }`}>
            {passed ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {passed ? 'ناجح — تم الاجتياز بنجاح' : 'لم يجتز — حاول مرة أخرى'}
          </div>
        </div>

        {/* Credly-style Badge Card */}
        {passed && (
          <div className="bg-card rounded-2xl shadow-elevated overflow-hidden animate-fade-in-up">
            {/* Badge header band */}
            <div className="bg-gradient-to-l from-[hsl(var(--brand-navy))] to-[hsl(var(--brand-navy)/0.85)] px-6 py-4">
              <h2 className="text-white text-lg font-bold text-center">شارة اجتياز تقييم هامش</h2>
              <p className="text-white/70 text-xs text-center mt-1">Hamesh Certified Accountant Assessment</p>
            </div>

            <div ref={badgeCardRef} className="p-8 flex flex-col items-center">
              {/* Badge image */}
              <div className="w-52 h-52 mb-6">
                <img
                  src={badgeImage}
                  alt="شارة اجتياز تقييم هامش المعتمد"
                  width={512}
                  height={512}
                  className="w-full h-full object-contain drop-shadow-xl"
                />
              </div>

              {/* Credential details */}
              <div className="text-center space-y-2 mb-6 w-full max-w-sm">
                <h3 className="text-xl font-bold text-foreground">تقييم هامش للمحاسبين</h3>
                <p className="text-muted-foreground text-sm">Hamesh Accountant Assessment</p>
                
                <div className="border border-border rounded-xl p-4 mt-4 space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">الحاصل على الشارة</span>
                    <span className="font-semibold text-foreground">{user?.name || '—'}</span>
                  </div>
                  <div className="border-t border-border" />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">تاريخ الاجتياز</span>
                    <span className="font-semibold text-foreground">{completionDate}</span>
                  </div>
                  <div className="border-t border-border" />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">المستوى</span>
                    <span className={`font-bold ${getPerformanceColor(performanceLevel)}`}>{performanceLevel}</span>
                  </div>
                  <div className="border-t border-border" />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">الدرجة</span>
                    <span className="font-bold text-foreground">{totalScore}/45</span>
                  </div>
                </div>
              </div>

              {/* Share & Download buttons */}
              <div className="w-full max-w-sm space-y-3">
                <p className="text-muted-foreground text-xs text-center">شارك إنجازك مع شبكتك المهنية</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={shareLinkedIn} variant="outline" className="gap-2 rounded-xl h-11">
                    <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                    LinkedIn
                  </Button>
                  <Button onClick={shareTwitter} variant="outline" className="gap-2 rounded-xl h-11">
                    <Twitter className="w-4 h-4" />
                    X (Twitter)
                  </Button>
                </div>
                <Button onClick={downloadBadge} variant="secondary" className="w-full gap-2 rounded-xl h-11">
                  <Download className="w-4 h-4" />
                  تحميل الشارة
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Axis Breakdown */}
        <div className="bg-card rounded-2xl shadow-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-5">تفاصيل المحاور</h2>
          <div className="space-y-5">
            {AXES.map(({ key, label, icon }) => {
              const score = axisScores[key];
              const ap = axisPassed[key];
              const pct = (score / 9) * 100;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-foreground font-medium flex items-center gap-2 text-sm">
                      {icon} {label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-bold text-sm">{score}/9</span>
                      {ap ? <CheckCircle className="w-4 h-4 text-success" /> : <XCircle className="w-4 h-4 text-destructive" />}
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-700 ${ap ? 'bg-gradient-primary' : 'bg-destructive'}`}
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
          const weakAxes = AXES.filter(({ key }) => {
            const score = axisScores[key as Axis];
            return (score / 9) < 0.5;
          });
          if (weakAxes.length === 0) return null;
          return (
            <div className="bg-card rounded-2xl shadow-card p-6 animate-fade-in-up">
              <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                دورات مقترحة لتطوير أدائك
              </h2>
              <p className="text-sm text-muted-foreground mb-5">بناءً على نتائجك، نرشح لك الدورات التالية في المحاور التي حصلت فيها على أقل من 50%:</p>
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
                        <p className="text-xs text-muted-foreground">{label} — نتيجتك: {pct}% ({score}/9)</p>
                      </div>
                      <span className="text-xs bg-warning/10 text-warning px-3 py-1 rounded-full font-bold">{rec.hours}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* CTA */}
        <div className="bg-card rounded-2xl shadow-card p-6 text-center">
          <h2 className="text-lg font-bold text-foreground mb-2">تحليل تفصيلي ينتظرك</h2>
          <p className="text-muted-foreground text-sm mb-5">احجز جلستك الاستشارية للحصول على التقرير الكامل</p>
          <Button
            onClick={() => setCurrentStep(7)}
            className="h-14 px-10 text-lg font-bold bg-gradient-gold text-accent-foreground rounded-xl gap-2"
          >
            احجز جلستك الاستشارية
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Results;
