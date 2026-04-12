import { useApp } from '@/context/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { User, Mail, Phone, Building2, Briefcase, Shield } from 'lucide-react';
import { SECTOR_LABELS } from '@/data/types';

const Profile = () => {
  const { user, examResult, booking } = useApp();
  if (!user) return null;

  const infoItems = [
    { icon: <User className="w-5 h-5" />, label: 'الاسم', value: user.name },
    { icon: <Mail className="w-5 h-5" />, label: 'البريد الإلكتروني', value: user.email },
    { icon: <Phone className="w-5 h-5" />, label: 'رقم الجوال', value: user.phone },
    { icon: <Briefcase className="w-5 h-5" />, label: 'المسمى الوظيفي', value: user.jobTitle },
    { icon: <Building2 className="w-5 h-5" />, label: 'الشركة', value: user.company },
    { icon: <Shield className="w-5 h-5" />, label: 'القطاع', value: SECTOR_LABELS[user.sector] },
  ];

  const statusSteps = [
    { label: 'التسجيل', done: true },
    { label: 'الدفع', done: user.paymentStatus },
    { label: 'التقييم', done: !!examResult },
    { label: 'الجلسة', done: !!booking },
  ];

  return (
    <DashboardLayout activePage="profile">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress */}
        <div className="bg-card rounded-2xl shadow-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-5">مراحل التقدم</h2>
          <div className="flex items-center">
            {statusSteps.map((s, i) => (
              <div key={i} className="flex items-center flex-1 last:flex-initial">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2 ${
                    s.done ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {s.done ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs font-medium ${s.done ? 'text-success' : 'text-muted-foreground'}`}>{s.label}</span>
                </div>
                {i < statusSteps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-6 ${s.done ? 'bg-success' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-card rounded-2xl shadow-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-5">المعلومات الشخصية</h2>
          <div className="space-y-4">
            {infoItems.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-foreground font-medium truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
