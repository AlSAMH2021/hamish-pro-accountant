import { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { getQuestionsBySetor, correctAnswers } from '@/data/questions';
import { AXES, Axis, ExamResult, getPerformanceLevel } from '@/data/types';
import { AlertTriangle, Clock, ChevronRight, ChevronLeft } from 'lucide-react';

const ExamEngine = () => {
  const { user, setExamResult, setCurrentStep, updateUserStatus } = useApp();
  const questions = getQuestionsBySetor(user?.sector || 'tourism');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(60 * 60);
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

    const result: ExamResult = {
      answers,
      axisScores,
      totalScore,
      performanceLevel: getPerformanceLevel(totalScore),
      passed: passTotal,
      axisPassed,
      completedAt: new Date().toISOString(),
    };

    setExamResult(result);
    updateUserStatus('exam_completed');
    setCurrentStep(6);
  }, [answers, questions, user?.sector, setExamResult, updateUserStatus, setCurrentStep]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { submitExam(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitExam]);

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
  const currentAxisIndex = Math.floor(currentQ / 9);
  const currentAxis = AXES[currentAxisIndex];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Warning overlay */}
      {showWarning && (
        <div className="fixed inset-0 z-50 bg-foreground/80 flex items-center justify-center">
          <div className="bg-background p-8 rounded-2xl text-center max-w-md mx-4 border border-border">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">تنبيه!</h2>
            <p className="text-muted-foreground">تم رصد مغادرة الصفحة ({tabWarnings} مرات). يرجى البقاء في صفحة التقييم.</p>
          </div>
        </div>
      )}

      {/* Confirm submit */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center">
          <div className="bg-background p-8 rounded-2xl text-center max-w-md mx-4 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-2">تأكيد تسليم التقييم</h2>
            <p className="text-muted-foreground mb-2">أجبت على {answeredCount} من 45 سؤال</p>
            {answeredCount < 45 && <p className="text-warning text-sm mb-4">لم تُجب على {45 - answeredCount} سؤال بعد</p>}
            <div className="flex gap-3">
              <Button onClick={() => setShowConfirm(false)} variant="outline" className="flex-1 h-12 rounded-lg">العودة</Button>
              <Button onClick={submitExam} className="flex-1 h-12 bg-foreground text-background hover:bg-foreground/90 rounded-lg">تسليم</Button>
            </div>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-lg">{currentAxis?.icon}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{currentAxis?.label}</p>
                <p className="text-xs text-muted-foreground">السؤال {(currentQ % 9) + 1} من 9</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-lg ${
              timeLeft < 300 ? 'text-destructive bg-destructive/5' : 'text-foreground bg-muted'
            }`}>
              <Clock className="w-4 h-4" />
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-foreground h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
            <span>السؤال {currentQ + 1} من 45</span>
            <span>{answeredCount} إجابة</span>
          </div>
        </div>
      </div>

      {/* Content: Question + Map side by side */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-6">
        {/* Question - left on screen (main) */}
        <div className="flex-1 min-w-0">
          <div className="rounded-2xl border border-border p-6 md:p-8 animate-fade-in-up">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-muted text-foreground text-xs font-bold mb-4">
                سؤال {currentQ + 1}
              </span>
              <h2 className="text-lg md:text-xl font-bold text-foreground leading-relaxed">{q.text}</h2>
            </div>

            <div className="space-y-3 mb-8">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setAnswers({ ...answers, [currentQ]: i })}
                  className={`w-full text-right p-4 rounded-xl border-2 transition-all ${
                    answers[currentQ] === i
                      ? 'border-foreground bg-foreground/5 text-foreground font-medium'
                      : 'border-border hover:border-foreground/20 text-foreground'
                  }`}
                >
                  <span className="inline-flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0 ${
                      answers[currentQ] === i ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground'
                    }`}>
                      {['أ', 'ب', 'ج', 'د'][i]}
                    </span>
                    <span className="text-sm">{opt}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                disabled={currentQ === 0}
                className="h-12 px-6 gap-2 rounded-lg"
              >
                <ChevronRight className="w-4 h-4" />
                السابق
              </Button>
              
              {currentQ < 44 ? (
                <Button
                  onClick={() => setCurrentQ(currentQ + 1)}
                  className="h-12 px-6 bg-foreground text-background hover:bg-foreground/90 gap-2 rounded-lg"
                >
                  التالي
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => setShowConfirm(true)}
                  className="h-12 px-6 bg-foreground text-background hover:bg-foreground/90 font-bold rounded-lg"
                >
                  تسليم التقييم
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Question map - right sidebar */}
        <div className="md:w-64 shrink-0">
          <div className="rounded-2xl border border-border p-5 md:sticky md:top-28">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-foreground">خريطة الأسئلة</p>
              <Button variant="ghost" onClick={() => setShowConfirm(true)} className="text-xs h-8 text-muted-foreground hover:text-foreground">
                تسليم
              </Button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 45 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQ(i)}
                  className={`w-full aspect-square rounded-lg text-xs font-bold transition-all ${
                    currentQ === i
                      ? 'bg-foreground text-background ring-2 ring-foreground/20 scale-110'
                      : answers[i] !== undefined
                      ? 'bg-foreground/15 text-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamEngine;
