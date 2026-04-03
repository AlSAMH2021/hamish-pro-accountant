import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';
import { AXES, getPerformanceColor } from '@/data/types';
import { CheckCircle, XCircle, Trophy, ArrowLeft } from 'lucide-react';

const Results = () => {
  const { examResult, setCurrentStep } = useApp();
  if (!examResult) return null;

  const { totalScore, performanceLevel, passed, axisScores, axisPassed } = examResult;

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
