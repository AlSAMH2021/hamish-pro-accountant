import { useApp } from '@/context/AppContext';
import StepperLayout from '@/components/StepperLayout';
import { User, Mail, Phone, Building2, Briefcase, Shield, CheckCircle, Clock, CreditCard, BookOpen, CalendarCheck, ArrowRight } from 'lucide-react';
import { SECTOR_LABELS } from '@/data/types';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const { user, examResult, booking, sessionCompleted, currentStep, setCurrentStep } = useApp();
  if (!user) return null;

  const statusSteps = [
    { label: 'التسجيل', icon: <User className="w-4 h-4" />, done: true },
    { label: 'الدفع', icon: <CreditCard className="w-4 h-4" />, done: user.paymentStatus },
    { label: 'التقييم', icon: <BookOpen className="w-4 h-4" />, done: !!examResult },
    { label: 'الجلسة', icon: <CalendarCheck className="w-4 h-4" />, done: !!booking },
  ];

  const completedSteps = statusSteps.filter(s => s.done).length;
  const progressPct = (completedSteps / statusSteps.length) * 100;

  const infoGroups = [
    {
      title: 'المعلومات الأساسية',
      items: [
        { icon: <User className="w-4 h-4" />, label: 'الاسم', value: user.name },
        { icon: <Mail className="w-4 h-4" />, label: 'البريد الإلكتروني', value: user.email },
        { icon: <Phone className="w-4 h-4" />, label: 'رقم الجوال', value: user.phone },
      ],
    },
    {
      title: 'المعلومات المهنية',
      items: [
        { icon: <Briefcase className="w-4 h-4" />, label: 'المسمى الوظيفي', value: user.jobTitle },
        { icon: <Building2 className="w-4 h-4" />, label: 'الشركة', value: user.company },
        { icon: <Shield className="w-4 h-4" />, label: 'القطاع', value: SECTOR_LABELS[user.sector] },
      ],
    },
  ];

  return (
    <StepperLayout activePage="profile">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => {
            if (sessionCompleted) setCurrentStep(8);
            else if (booking) setCurrentStep(7);
            else if (examResult) setCurrentStep(6);
            else if (user.paymentStatus) setCurrentStep(5);
            else setCurrentStep(3);
          }}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowRight className="w-4 h-4" />
          رجوع
        </Button>

        {/* User Header Card */}
        <div className="rounded-2xl border border-border p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center">
              <span className="text-2xl font-bold text-foreground">
                {user.name?.charAt(0) || 'م'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-foreground truncate">{user.name}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  user.paymentStatus ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                }`}>
                  {user.paymentStatus ? (
                    <><CheckCircle className="w-3 h-3" /> مفعّل</>
                  ) : (
                    <><Clock className="w-3 h-3" /> في الانتظار</>
                  )}
                </span>
                <span className="text-xs text-muted-foreground">
                  {SECTOR_LABELS[user.sector]}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-foreground">التقدم</p>
              <p className="text-xs text-muted-foreground">{completedSteps} من {statusSteps.length}</p>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-4">
              <div
                className="bg-success h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {statusSteps.map((s, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                    s.done ? 'bg-success/5' : 'bg-muted/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    s.done ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {s.done ? <CheckCircle className="w-4 h-4" /> : s.icon}
                  </div>
                  <span className={`text-[11px] font-medium text-center leading-tight ${
                    s.done ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Groups */}
        {infoGroups.map((group, gi) => (
          <div key={gi} className="rounded-2xl border border-border p-6">
            <h2 className="text-sm font-bold text-foreground mb-4">{group.title}</h2>
            <div className="space-y-1">
              {group.items.filter(item => item.value).map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-muted-foreground leading-none mb-1">{item.label}</p>
                    <p className="text-sm text-foreground font-medium truncate">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Exam Summary (if available) */}
        {examResult && (
          <div className="rounded-2xl border border-border p-6">
            <h2 className="text-sm font-bold text-foreground mb-4">ملخص التقييم</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-4 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-foreground">{examResult.totalScore}</p>
                <p className="text-[11px] text-muted-foreground mt-1">من 45</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-foreground">{Math.round((examResult.totalScore / 45) * 100)}%</p>
                <p className="text-[11px] text-muted-foreground mt-1">النسبة</p>
              </div>
              <div className={`text-center p-4 rounded-xl ${examResult.passed ? 'bg-success/5' : 'bg-destructive/5'}`}>
                <p className={`text-lg font-bold ${examResult.passed ? 'text-success' : 'text-destructive'}`}>
                  {examResult.passed ? 'ناجح' : 'لم يجتز'}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">الحالة</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </StepperLayout>
  );
};

export default Profile;
