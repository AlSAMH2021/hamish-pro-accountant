import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Shield, CheckCircle } from 'lucide-react';

const Payment = () => {
  const { setPaymentStatus, setCurrentStep } = useApp();
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setPaymentStatus(true);
      setProcessing(false);
      setCurrentStep(5);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">الدفع الآمن</h1>
          <p className="text-muted-foreground">ادفع رسوم الاختبار للبدء</p>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-8">
          {/* Price */}
          <div className="text-center mb-8 pb-6 border-b border-border">
            <p className="text-muted-foreground text-sm mb-2">رسوم الاختبار</p>
            <p className="text-5xl font-bold text-foreground">299 <span className="text-lg text-muted-foreground">ر.س</span></p>
            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              <p>✓ 45 سؤال متخصص حسب قطاعك</p>
              <p>✓ تقرير أداء تفصيلي</p>
              <p>✓ جلسة استشارية مع خبير</p>
            </div>
          </div>

          {/* Card Form */}
          <div className="space-y-4 mb-6">
            <div>
              <Label className="text-foreground font-medium mb-1.5 block">رقم البطاقة</Label>
              <Input
                placeholder="XXXX XXXX XXXX XXXX"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())}
                className="h-12 text-left"
                dir="ltr"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground font-medium mb-1.5 block">تاريخ الانتهاء</Label>
                <Input placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="h-12 text-left" dir="ltr" />
              </div>
              <div>
                <Label className="text-foreground font-medium mb-1.5 block">CVV</Label>
                <Input placeholder="XXX" value={cvv} onChange={(e) => setCvv(e.target.value)} className="h-12 text-left" dir="ltr" type="password" />
              </div>
            </div>
          </div>

          <Button
            onClick={handlePayment}
            disabled={processing}
            className="w-full h-14 text-lg font-bold bg-gradient-primary text-primary-foreground rounded-xl"
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                جاري المعالجة...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                ادفع 299 ر.س
              </span>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>دفع آمن ومشفر</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
