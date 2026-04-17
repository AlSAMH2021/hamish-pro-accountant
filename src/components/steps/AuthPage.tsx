import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Loader2 } from 'lucide-react';
import logoColor from '@/assets/logo-color.png';
import { SECTOR_LABELS, Sector } from '@/data/types';

type AuthTab = 'login' | 'register';

interface AuthPageProps {
  initialTab?: AuthTab;
}

const AuthPage = ({ initialTab = 'login' }: AuthPageProps) => {
  const { setCurrentStep } = useApp();
  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);
  const [animPhase, setAnimPhase] = useState<'idle' | 'exit' | 'enter'>('idle');

  const switchTab = (tab: AuthTab) => {
    if (tab === activeTab || animPhase !== 'idle') return;
    setAnimPhase('exit');
    setTimeout(() => {
      setActiveTab(tab);
      setAnimPhase('enter');
      setTimeout(() => setAnimPhase('idle'), 350);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <nav className="border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => setCurrentStep(1)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowRight className="w-5 h-5" />
          </button>
          <img src={logoColor} alt="هامش" className="h-9" />
          <div className="w-5" />
        </div>
      </nav>

      <div className="flex items-center justify-center py-8 md:py-12 px-4">
        <div className="w-full max-w-lg">
          {/* Tab Switcher */}
          <div className="relative flex bg-muted rounded-xl p-1 mb-8">
            <div
              className="absolute top-1 bottom-1 rounded-lg bg-background shadow-sm transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{
                width: 'calc(50% - 4px)',
                right: activeTab === 'login' ? '4px' : 'calc(50%)',
              }}
            />
            <button
              onClick={() => switchTab('login')}
              className={`relative z-10 flex-1 py-2.5 text-center text-sm font-bold rounded-lg transition-colors duration-300 ${
                activeTab === 'login' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/70'
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => switchTab('register')}
              className={`relative z-10 flex-1 py-2.5 text-center text-sm font-bold rounded-lg transition-colors duration-300 ${
                activeTab === 'register' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/70'
              }`}
            >
              إنشاء حساب
            </button>
          </div>

          {/* Content with animation */}
          <div className="overflow-hidden">
            <div
              className={`transition-opacity ease-out ${
                animPhase === 'exit'
                  ? 'duration-200 opacity-0'
                  : animPhase === 'enter'
                  ? 'duration-300 opacity-100'
                  : 'duration-0 opacity-100'
              }`}
            >
              {activeTab === 'login' ? (
                <LoginForm onSwitchToRegister={() => switchTab('register')} />
              ) : (
                <RegisterForm onSwitchToLogin={() => switchTab('login')} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Login Form ─── */
const LoginForm = ({ onSwitchToRegister }: { onSwitchToRegister: () => void }) => {
  const { signIn, setCurrentStep } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('يرجى إدخال البريد وكلمة المرور');
      return;
    }
    setSubmitting(true);
    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border p-6 md:p-8 space-y-4">
      <div className="text-center mb-2">
        <h1 className="text-xl font-bold text-foreground mb-1">مرحباً بعودتك</h1>
        <p className="text-muted-foreground text-sm">أدخل بياناتك للمتابعة</p>
      </div>

      <div>
        <Label className="text-foreground font-medium mb-1.5 block text-sm">البريد الإلكتروني</Label>
        <Input type="email" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" dir="auto" />
      </div>
      <div>
        <Label className="text-foreground font-medium mb-1.5 block text-sm">كلمة المرور</Label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11" />
      </div>

      {error && <p className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-xl">{error}</p>}

      <Button type="submit" disabled={submitting} className="w-full h-12 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-lg">
        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تسجيل الدخول'}
      </Button>

      <div className="text-center">
        <button type="button" onClick={() => setCurrentStep(11)} className="text-muted-foreground text-sm font-medium hover:text-foreground transition-colors">
          نسيت كلمة المرور؟
        </button>
      </div>
    </form>
  );
};

/* ─── Register Form ─── */
const RegisterForm = ({ onSwitchToLogin }: { onSwitchToLogin: () => void }) => {
  const { signUp } = useApp();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '', sector: '' as Sector | '',
    company: '', jobTitle: '', financialDeptSize: '',
    managerName: '', managerPhone: '', managerEmail: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'الاسم مطلوب';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'بريد إلكتروني غير صالح';
    if (!form.phone.match(/^05\d{8}$/)) e.phone = 'رقم جوال سعودي غير صالح (05XXXXXXXX)';
    if (form.password.length < 6) e.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    if (!form.sector) e.sector = 'يرجى اختيار القطاع';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'كلمتا المرور غير متطابقتين';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError('');
    const { error } = await signUp(form.email, form.password, {
      name: form.name, phone: form.phone, sector: form.sector,
      company: form.company, jobTitle: form.jobTitle, financialDeptSize: form.financialDeptSize,
    });
    if (error) {
      setServerError(error);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border p-6 md:p-8 space-y-4">
      <div className="text-center mb-2">
        <h1 className="text-xl font-bold text-foreground mb-1">إنشاء حساب جديد</h1>
        <p className="text-muted-foreground text-sm">سجّل بياناتك للبدء في التقييم</p>
      </div>

      {serverError && <p className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-xl">{serverError}</p>}

      {([
        { key: 'name', label: 'الاسم الكامل', type: 'text', placeholder: 'أدخل اسمك' },
        { key: 'email', label: 'البريد الإلكتروني', type: 'email', placeholder: 'example@email.com' },
        { key: 'phone', label: 'رقم الجوال', type: 'tel', placeholder: '05XXXXXXXX' },
      ] as const).map(({ key, label, type, placeholder }) => (
        <div key={key}>
          <Label className="text-foreground font-medium mb-1.5 block text-sm">{label}</Label>
          <Input type={type} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="h-11" dir="auto" />
          {errors[key] && <p className="text-destructive text-xs mt-1">{errors[key]}</p>}
        </div>
      ))}

      {/* Sector Selection */}
      <div>
        <Label className="text-foreground font-medium mb-1.5 block text-sm">القطاع</Label>
        <select
          value={form.sector}
          onChange={(e) => setForm({ ...form, sector: e.target.value as Sector })}
          className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">اختر القطاع</option>
          {(Object.entries(SECTOR_LABELS) as [Sector, string][]).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        {errors.sector && <p className="text-destructive text-xs mt-1">{errors.sector}</p>}
      </div>

      {/* Company */}
      <div>
        <Label className="text-foreground font-medium mb-1.5 block text-sm">اسم الشركة</Label>
        <Input type="text" placeholder="أدخل اسم الشركة" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="h-11" dir="auto" />
      </div>

      {/* Job Title */}
      <div>
        <Label className="text-foreground font-medium mb-1.5 block text-sm">المسمى الوظيفي</Label>
        <Input type="text" placeholder="أدخل المسمى الوظيفي" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} className="h-11" dir="auto" />
      </div>

      {/* Financial Dept Size */}
      <div>
        <Label className="text-foreground font-medium mb-1.5 block text-sm">عدد موظفين الإدارة المالية</Label>
        <select
          value={form.financialDeptSize}
          onChange={(e) => setForm({ ...form, financialDeptSize: e.target.value })}
          className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">اختر العدد</option>
          <option value="1">1</option>
          <option value="2-3">2-3</option>
          <option value="3-6">3-6</option>
          <option value="6+">6 فأكثر</option>
        </select>
      </div>

      <div>
        <Label className="text-foreground font-medium mb-1.5 block text-sm">كلمة المرور</Label>
        <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="h-11" />
        {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
      </div>
      <div>
        <Label className="text-foreground font-medium mb-1.5 block text-sm">تأكيد كلمة المرور</Label>
        <Input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="h-11" />
        {errors.confirmPassword && <p className="text-destructive text-xs mt-1">{errors.confirmPassword}</p>}
      </div>

      <Button type="submit" disabled={submitting} className="w-full h-12 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-lg mt-2">
        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'إنشاء الحساب'}
      </Button>
    </form>
  );
};

export default AuthPage;
