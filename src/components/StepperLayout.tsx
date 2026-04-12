import { useApp } from '@/context/AppContext';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import NotificationBell from '@/components/NotificationBell';
import logoColor from '@/assets/logo-color.png';

export type StepId = 'briefing' | 'payment' | 'nda' | 'exam' | 'results' | 'booking' | 'report' | 'profile';

const STEPS: { id: StepId; label: string; step: number }[] = [
  { id: 'briefing', label: 'الإرشادات', step: 3 },
  { id: 'payment', label: 'الدفع', step: 4 },
  { id: 'nda', label: 'السرية', step: 12 },
  { id: 'exam', label: 'التقييم', step: 5 },
  { id: 'results', label: 'النتائج', step: 6 },
  { id: 'booking', label: 'الحجز', step: 7 },
  { id: 'report', label: 'التقرير', step: 8 },
];

interface StepperLayoutProps {
  children: React.ReactNode;
  activePage: StepId;
}

const StepperLayout = ({ children, activePage }: StepperLayoutProps) => {
  const { user, setCurrentStep, examResult, booking, sessionCompleted, signOut } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  const activeIndex = STEPS.findIndex(s => s.id === activePage);

  const getStepState = (step: typeof STEPS[number], index: number) => {
    // Determine if step is completed, current, or upcoming
    if (index < activeIndex) return 'completed';
    if (index === activeIndex) return 'current';
    return 'upcoming';
  };

  const isStepClickable = (step: typeof STEPS[number]) => {
    switch (step.id) {
      case 'briefing': return true;
      case 'payment': return !user?.paymentStatus ? true : false;
      case 'nda': return user?.paymentStatus === true;
      case 'exam': return user?.paymentStatus && !examResult;
      case 'results': return !!examResult;
      case 'booking': return !!examResult;
      case 'report': return !!examResult;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          {/* Top row: logo + actions */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <img src={logoColor} alt="هامش" className="h-8" />
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-foreground leading-tight">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell />
              <button
                onClick={() => setCurrentStep(10)}
                className="w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                title="الملف الشخصي"
              >
                <User className="w-4 h-4" />
              </button>
              <button
                onClick={handleLogout}
                className="w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stepper - Desktop */}
          <div className="hidden md:flex items-center pb-4 gap-1">
            {STEPS.map((step, index) => {
              const state = getStepState(step, index);
              const clickable = isStepClickable(step);

              return (
                <div key={step.id} className="flex items-center flex-1 last:flex-initial">
                  <button
                    onClick={() => {
                      if (clickable || state === 'completed') {
                        setCurrentStep(step.step);
                      }
                    }}
                    disabled={state === 'upcoming' && !clickable}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm font-medium whitespace-nowrap ${
                      state === 'current'
                        ? 'bg-primary/10 text-primary'
                        : state === 'completed'
                        ? 'text-success hover:bg-success/10 cursor-pointer'
                        : 'text-muted-foreground/50 cursor-not-allowed'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      state === 'current'
                        ? 'bg-primary text-primary-foreground'
                        : state === 'completed'
                        ? 'bg-success text-success-foreground'
                        : 'bg-muted text-muted-foreground/50'
                    }`}>
                      {state === 'completed' ? '✓' : index + 1}
                    </span>
                    <span>{step.label}</span>
                  </button>
                  {index < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 rounded-full min-w-[16px] ${
                      state === 'completed' ? 'bg-success/40' : 'bg-border'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Stepper - Mobile */}
          <div className="md:hidden pb-3">
            {/* Progress bar */}
            <div className="flex items-center gap-1 mb-2">
              {STEPS.map((step, index) => {
                const state = getStepState(step, index);
                return (
                  <div
                    key={step.id}
                    className={`flex-1 h-1.5 rounded-full transition-all ${
                      state === 'current'
                        ? 'bg-primary'
                        : state === 'completed'
                        ? 'bg-success'
                        : 'bg-muted'
                    }`}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                الخطوة {activeIndex + 1} من {STEPS.length}
              </p>
              <p className="text-xs font-bold text-foreground">
                {STEPS[activeIndex]?.label}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
};

export default StepperLayout;
