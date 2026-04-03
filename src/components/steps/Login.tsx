import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn } from 'lucide-react';

const Login = () => {
  const { setCurrentStep, loginUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('يرجى إدخال البريد وكلمة المرور');
      return;
    }
    const success = loginUser(email, password);
    if (!success) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">تسجيل الدخول</h1>
          <p className="text-muted-foreground">أدخل بياناتك للمتابعة</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-card p-8 space-y-5">
          <div>
            <Label className="text-foreground font-medium mb-1.5 block">البريد الإلكتروني</Label>
            <Input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
              dir="auto"
            />
          </div>
          <div>
            <Label className="text-foreground font-medium mb-1.5 block">كلمة المرور</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12"
            />
          </div>

          {error && (
            <p className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-lg">{error}</p>
          )}

          <Button type="submit" className="w-full h-14 text-lg font-bold bg-gradient-primary text-primary-foreground rounded-xl">
            تسجيل الدخول
          </Button>

          <div className="text-center pt-2">
            <p className="text-muted-foreground text-sm">
              ليس لديك حساب؟{' '}
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-primary font-medium hover:underline"
              >
                إنشاء حساب جديد
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
