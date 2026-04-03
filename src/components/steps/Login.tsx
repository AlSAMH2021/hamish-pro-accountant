import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, ArrowRight, Loader2 } from 'lucide-react';
import logoColor from '@/assets/logo-color.png';

const Login = () => {
  const { setCurrentStep, signIn } = useApp();
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
    // Auth state change listener handles navigation
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="bg-card border-b border-border">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => setCurrentStep(1)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <span className="text-accent font-bold text-sm">هـ</span>
            </div>
            <span className="font-bold text-foreground">هامش</span>
          </div>
          <div className="w-5" />
        </div>
      </div>

      <div className="flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">تسجيل الدخول</h1>
            <p className="text-muted-foreground text-sm">أدخل بياناتك للمتابعة</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-card p-6 md:p-8 space-y-4">
            <div>
              <Label className="text-foreground font-medium mb-1.5 block text-sm">البريد الإلكتروني</Label>
              <Input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                dir="auto"
              />
            </div>
            <div>
              <Label className="text-foreground font-medium mb-1.5 block text-sm">كلمة المرور</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>

            {error && (
              <p className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-xl">{error}</p>
            )}

            <Button type="submit" disabled={submitting} className="w-full h-13 text-base font-bold bg-gradient-primary text-primary-foreground rounded-xl">
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تسجيل الدخول'}
            </Button>

            <div className="text-center">
              <button type="button" onClick={() => setCurrentStep(11)} className="text-primary text-sm font-medium hover:underline">
                نسيت كلمة المرور؟
              </button>
            </div>

            <div className="text-center pt-1">
              <p className="text-muted-foreground text-sm">
                ليس لديك حساب؟{' '}
                <button type="button" onClick={() => setCurrentStep(2)} className="text-primary font-medium hover:underline">
                  إنشاء حساب جديد
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
