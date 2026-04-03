import { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { getQuestionsBySetor, correctAnswers } from '@/data/questions';
import { AXES, Axis, ExamResult, getPerformanceLevel } from '@/data/types';
import { AlertTriangle, Clock } from 'lucide-react';

const ExamEngine = () => {
  const { user, setExamResult, setCurrentStep, updateUserStatus } = useApp();
  const questions = getQuestionsBySetor(user?.sector || 'tourism');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes
  const [showWarning, setShowWarning] = useState(false);
  const [tabWarnings, setTabWarnings] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  const submitExam = useCallback(() => {
    const sector = user?.sector || 'tourism';
    const correct = correctAnswers[sector];
    const axisScores: Record<Axis, number> = { financial: 0, cost: 0, tax: 0, regulations: 0, ifrs: 0 };
    let totalScore = 0;

    questions.forEach((q, i) => {
      if (answers[i] === correct[i]) {
        axisScores[q.axis]++;
        totalScore++;
      }
    });

    const axisPassed: Record<Axis, boolean> = {
      financial: axisScores.financial >= 6,
      cost: axisScores.cost >= 6,
      tax: axisScores.tax >= 6,
      regulations: axisScores.regulations >= 6,
      ifrs: axisScores.ifrs >= 6,
    };

    const passTotal = totalScore >= 25;
    const passAllAxes = Object.values(axisPassed).every(Boolean);

    const result: ExamResult = {
      answers,
      axisScores,
      totalScore,
      performanceLevel: getPerformanceLevel(totalScore),
      passed: passTotal && passAllAxes,
      axisPassed,
      completedAt: new Date().toISOString(),
    };

    setExamResult(result);
    updateUserStatus('exam_completed');
    setCurrentStep(6);
  }, [answers, questions, user?.sector, setExamResult, updateUserStatus, setCurrentStep]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { submitExam(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitExam]);

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabWarnings((p) => p + 1);
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const q = questions[currentQ];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / 45) * 100;

  // Get current axis info
  const currentAxisIndex = Math.floor(currentQ / 9);
  const currentAxis = AXES[currentAxisIndex];

  return (
    <div className="min-h-screen bg-background">
      {/* Warning overlay */}
      {showWarning && (
        <div className="fixed inset-0 z-50 bg-foreground/80 flex items-center justify-center">
          <div className="bg-card p-8 rounded-2xl text-center max-w-md mx-4">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">تنبيه!</h2>
            <p className="text-muted-foreground">تم رصد مغادرة الصفحة ({tabWarnings} مرات). يرجى البقاء في صفحة الاختبار.</p>
          </div>
        </div>
      )}

      {/* Confirm submit dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center">
          <div className="bg-card p-8 rounded-2xl text-center max-w-md mx-4">
            <h2 className="text-xl font-bold text-foreground mb-2">تأكيد تسليم الاختبار</h2>
            <p className="text-muted-foreground mb-2">أجبت على {answeredCount} من 45 سؤال</p>
            {answeredCount < 45 && <p className="text-warning text-sm mb-4">لم تُجب على {45 - answeredCount} سؤال بعد</p>}
            <div className="flex gap-3">
              <Button onClick={() => setShowConfirm(false)} variant="outline" className="flex-1 h-12">العودة</Button>
              <Button onClick={submitExam} className="flex-1 h-12 bg-gradient-primary text-primary-foreground">تسليم</Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border shadow-card">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{currentAxis?.icon} {currentAxis?.label}</span>
            </div>
            <div className={`flex items-center gap-1.5 font-mono font-bold text-lg ${timeLeft < 300 ? 'text-destructive' : 'text-foreground'}`}>
              <Clock className="w-4 h-4" />
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-gradient-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>السؤال {currentQ + 1} من 45</span>
            <span>{answeredCount} إجابة</span>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-card rounded-2xl shadow-card p-8 animate-fade-in-up">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              سؤال {currentQ + 1}
            </span>
            <h2 className="text-xl font-bold text-foreground leading-relaxed">{q.text}</h2>
          </div>

          <div className="space-y-3 mb-8">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setAnswers({ ...answers, [currentQ]: i })}
                className={`w-full text-right p-4 rounded-xl border-2 transition-all ${
                  answers[currentQ] === i
                    ? 'border-primary bg-primary/5 text-foreground font-medium'
                    : 'border-border hover:border-primary/30 text-foreground'
                }`}
              >
                <span className="inline-flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0 ${
                    answers[currentQ] === i ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'
                  }`}>
                    {['أ', 'ب', 'ج', 'د'][i]}
                  </span>
                  {opt}
                </span>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
              disabled={currentQ === 0}
              className="h-12 px-6"
            >
              السابق
            </Button>
            
            {currentQ < 44 ? (
              <Button
                onClick={() => setCurrentQ(currentQ + 1)}
                className="h-12 px-6 bg-gradient-primary text-primary-foreground"
              >
                التالي
              </Button>
            ) : (
              <Button
                onClick={() => setShowConfirm(true)}
                className="h-12 px-6 bg-gradient-gold text-accent-foreground font-bold"
              >
                تسليم الاختبار
              </Button>
            )}
          </div>
        </div>

        {/* Question map */}
        <div className="mt-6 bg-card rounded-2xl shadow-card p-6">
          <p className="text-sm font-medium text-foreground mb-3">خريطة الأسئلة</p>
          <div className="grid grid-cols-9 gap-2">
            {Array.from({ length: 45 }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`w-full aspect-square rounded-lg text-xs font-bold transition-all ${
                  currentQ === i
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
                    : answers[i] !== undefined
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamEngine;
