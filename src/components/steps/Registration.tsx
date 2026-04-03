import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sector, SECTOR_LABELS } from '@/data/types';

const Registration = () => {
  const { setUser, setCurrentStep } = useApp();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', jobTitle: '', company: '', sector: '' as Sector | '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'الاسم مطلوب';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'بريد إلكتروني غير صالح';
    if (!form.phone.match(/^05\d{8}$/)) e.phone = 'رقم جوال سعودي غير صالح (05XXXXXXXX)';
    if (!form.jobTitle.trim()) e.jobTitle = 'الوظيفة مطلوبة';
    if (!form.company.trim()) e.company = 'الشركة مطلوبة';
    if (!form.sector) e.sector = 'القطاع مطلوب';
    if (form.password.length < 6) e.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'كلمتا المرور غير متطابقتين';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setUser({
      name: form.name, email: form.email, phone: form.phone,
      jobTitle: form.jobTitle, company: form.company, sector: form.sector as Sector,
      password: form.password, status: 'registered', paymentStatus: false,
    });
    setCurrentStep(3);
  };

  const sectors: { value: Sector; label: string }[] = [
    { value: 'tourism', label: SECTOR_LABELS.tourism },
    { value: 'restaurants', label: SECTOR_LABELS.restaurants },
    { value: 'healthcare', label: SECTOR_LABELS.healthcare },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">إنشاء حساب</h1>
          <p className="text-muted-foreground">سجّل بياناتك للبدء في الاختبار</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-card p-8 space-y-5">
          {([
            { key: 'name', label: 'الاسم الكامل', type: 'text', placeholder: 'أدخل اسمك' },
            { key: 'email', label: 'البريد الإلكتروني', type: 'email', placeholder: 'example@email.com' },
            { key: 'phone', label: 'رقم الجوال', type: 'tel', placeholder: '05XXXXXXXX' },
            { key: 'jobTitle', label: 'المسمى الوظيفي', type: 'text', placeholder: 'محاسب، مدير مالي...' },
            { key: 'company', label: 'الشركة', type: 'text', placeholder: 'اسم الشركة' },
          ] as const).map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <Label className="text-foreground font-medium mb-1.5 block">{label}</Label>
              <Input
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="h-12"
                dir="auto"
              />
              {errors[key] && <p className="text-destructive text-sm mt-1">{errors[key]}</p>}
            </div>
          ))}

          <div>
            <Label className="text-foreground font-medium mb-1.5 block">القطاع</Label>
            <div className="grid grid-cols-1 gap-3">
              {sectors.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setForm({ ...form, sector: s.value })}
                  className={`p-4 rounded-xl border-2 text-right transition-all ${
                    form.sector === s.value
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/30'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            {errors.sector && <p className="text-destructive text-sm mt-1">{errors.sector}</p>}
          </div>

          <div>
            <Label className="text-foreground font-medium mb-1.5 block">كلمة المرور</Label>
            <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="h-12" />
            {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
          </div>
          <div>
            <Label className="text-foreground font-medium mb-1.5 block">تأكيد كلمة المرور</Label>
            <Input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="h-12" />
            {errors.confirmPassword && <p className="text-destructive text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <Button type="submit" className="w-full h-14 text-lg font-bold bg-gradient-primary text-primary-foreground rounded-xl">
            إنشاء الحساب
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
