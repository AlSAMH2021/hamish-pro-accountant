import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';
import { AXES, getPerformanceColor } from '@/data/types';
import { CheckCircle, XCircle, Trophy, ArrowLeft, Share2, Download } from 'lucide-react';
import badgeImage from '@/assets/badge-passed.png';
import { useRef } from 'react';

const Results = () => {
  const { examResult, user, setCurrentStep } = useApp();
  const badgeRef = useRef<HTMLDivElement>(null);
  if (!examResult) return null;

  const { totalScore, performanceLevel, passed, axisScores, axisPassed } = examResult;

  const shareText = `🏅 أتممت تقييم هامش للمحاسبين بنجاح!\nمستواي: ${performanceLevel}\nالنتيجة: ${totalScore}/45\n\n#هامش #محاسبة #تقييم_مهني`;
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
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Score Hero */}
        <div className="bg-card rounded-2xl shadow-elevated p-8 text-center animate-fade-in-up">
          <Trophy className={`w-16 h-16 mx-auto mb-4 ${passed ? 'text-success' : 'text-destructive'}`} />
          <h1 className="text-4xl font-bold text-foreground mb-2">{totalScore} / 45</h1>
          <p className={`text-xl font-bold mb-3 ${getPerformanceColor(performanceLevel)}`}>{performanceLevel}</p>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            passed ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          }`}>
            {passed ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {passed ? 'ناجح' : 'لم يجتز'}
          </div>
        </div>

        {/* Badge & Share - Only if passed */}
        {passed && (
          <div className="bg-card rounded-2xl shadow-elevated p-8 text-center animate-fade-in-up">
            <div ref={badgeRef} className="inline-block">
              <div className="relative w-48 h-48 mx-auto mb-4">
                <img
                  src={badgeImage}
                  alt="شارة اجتياز تقييم هامش"
                  width={192}
                  height={192}
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-1">🎉 مبارك الاجتياز!</h2>
              {user && <p className="text-muted-foreground text-sm mb-1">{user.name}</p>}
              <p className="text-muted-foreground text-xs mb-4">
                تاريخ الاجتياز: {new Date(examResult.completedAt).toLocaleDateString('ar-SA')}
              </p>
            </div>

            <p className="text-muted-foreground text-sm mb-5">شارك إنجازك مع شبكتك المهنية</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button onClick={shareLinkedIn} variant="outline" className="gap-2 rounded-xl">
                <Share2 className="w-4 h-4" />
                مشاركة في LinkedIn
              </Button>
              <Button onClick={shareTwitter} variant="outline" className="gap-2 rounded-xl">
                <Share2 className="w-4 h-4" />
                مشاركة في X
              </Button>
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
