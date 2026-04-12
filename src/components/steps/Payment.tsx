import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StepperLayout from '@/components/StepperLayout';
import { CreditCard, Shield, Building2, Copy, CheckCircle, Clock, Upload, Tag, Loader2 } from 'lucide-react';

type PaymentMethod = 'transfer' | 'card' | null;

const Payment = () => {
  const { setPaymentStatus, setCurrentStep, user } = useApp();
  const [method, setMethod] = useState<PaymentMethod>(null);
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [copied, setCopied] = useState(false);
  const [transferConfirmed, setTransferConfirmed] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState<{ percent: number; codeId: string } | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [checkingCode, setCheckingCode] = useState(false);

  const basePrice = 299;
  const finalPrice = discountApplied ? Math.round(basePrice * (1 - discountApplied.percent / 100)) : basePrice;

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    setCheckingCode(true);
    setDiscountError('');
    try {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('id, discount_percent, max_uses')
        .eq('code', discountCode.trim().toUpperCase())
        .eq('is_active', true)
        .maybeSingle();

      if (error || !data) {
        setDiscountError('كود الخصم غير صالح');
        setCheckingCode(false);
        return;
      }

      if (data.max_uses) {
        const { count } = await supabase
          .from('discount_code_usages')
          .select('id', { count: 'exact', head: true })
          .eq('code_id', data.id);
        if ((count || 0) >= data.max_uses) {
          setDiscountError('تم استنفاد هذا الكود');
          setCheckingCode(false);
          return;
        }
      }

      setDiscountApplied({ percent: data.discount_percent, codeId: data.id });
    } catch {
      setDiscountError('حدث خطأ');
    }
    setCheckingCode(false);
  };

  const recordDiscountUsage = async () => {
    if (!discountApplied) return;
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;
    await supabase.from('discount_code_usages').insert({
      code_id: discountApplied.codeId,
      user_id: authUser.id,
    });
  };

  const handleCardPayment = async () => {
    setProcessing(true);
    await recordDiscountUsage();
    setTimeout(() => {
      setPaymentStatus(true);
      setProcessing(false);
      setCurrentStep(12);
    }, 2000);
  };

  const uploadReceipt = async (): Promise<string | null> => {
    if (!receiptFile) return null;
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return null;

    const ext = receiptFile.name.split('.').pop();
    const path = `${authUser.id}/receipt-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('receipts')
      .upload(path, receiptFile);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    await supabase.from('profiles').update({ receipt_url: path }).eq('user_id', authUser.id);
    return path;
  };

  const handleTransferConfirm = async () => {
    if (!receiptFile) return;
    setProcessing(true);
    setUploadingReceipt(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      await uploadReceipt();
      await recordDiscountUsage();

      await supabase
        .from('profiles')
        .update({ status: 'pending_payment' })
        .eq('user_id', authUser.id);

      await supabase.rpc('notify_admins', {
        p_title: 'طلب تأكيد تحويل بنكي',
        p_message: `${user?.name || 'مستخدم'} قام بتأكيد تحويل بنكي بمبلغ ${finalPrice} ر.س — يرجى التحقق وتحديث حالة الدفع.`,
      });

      setTransferConfirmed(true);
    } catch (err) {
      console.error('Error confirming transfer:', err);
    } finally {
      setProcessing(false);
      setUploadingReceipt(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bankDetails = {
    bank: 'بنك الراجحي',
    name: 'مؤسسة هامش للتدريب',
    iban: 'SA0380000000608010167519',
    amount: `${finalPrice} ر.س`,
  };

  return (
    <StepperLayout activePage="payment">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Price Hero */}
        <div className="rounded-2xl border border-border p-6 text-center">
          <p className="text-muted-foreground text-sm mb-1">رسوم التقييم</p>
          {discountApplied ? (
            <div>
              <p className="text-xl text-muted-foreground line-through">{basePrice} ر.س</p>
              <p className="text-4xl font-bold text-foreground">{finalPrice} <span className="text-base text-muted-foreground">ر.س</span></p>
              <span className="inline-block mt-2 bg-success/10 text-success text-xs font-bold px-3 py-1 rounded-full">خصم {discountApplied.percent}%</span>
            </div>
          ) : (
            <p className="text-4xl font-bold text-foreground">{basePrice} <span className="text-base text-muted-foreground">ر.س</span></p>
          )}
          <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            <span className="bg-muted px-3 py-1.5 rounded-lg">✓ 45 سؤال</span>
            <span className="bg-muted px-3 py-1.5 rounded-lg">✓ تقرير تفصيلي</span>
            <span className="bg-muted px-3 py-1.5 rounded-lg">✓ جلسة استشارية</span>
          </div>
        </div>

        {/* Discount Code */}
        <div className="rounded-2xl border border-border p-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Label className="text-foreground font-medium mb-1.5 block text-xs flex items-center gap-1">
                <Tag className="w-3 h-3 text-muted-foreground" />
                كود الخصم
              </Label>
              <Input
                placeholder="أدخل الكود"
                value={discountCode}
                onChange={e => { setDiscountCode(e.target.value.toUpperCase()); setDiscountError(''); }}
                disabled={!!discountApplied}
                className="h-10"
              />
            </div>
            <Button
              onClick={handleApplyDiscount}
              disabled={!!discountApplied || checkingCode || !discountCode.trim()}
              variant="outline"
              className="h-10 px-4"
            >
              {checkingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : discountApplied ? <CheckCircle className="w-4 h-4 text-success" /> : 'تطبيق'}
            </Button>
          </div>
          {discountError && <p className="text-destructive text-xs mt-1.5">{discountError}</p>}
          {discountApplied && <p className="text-success text-xs mt-1.5">تم تطبيق خصم {discountApplied.percent}%!</p>}
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMethod('transfer')}
            className={`p-5 rounded-2xl border-2 transition-all text-center ${
              method === 'transfer' ? 'border-foreground bg-foreground/5' : 'border-border hover:border-foreground/20'
            }`}
          >
            <Building2 className={`w-8 h-8 mx-auto mb-2 ${method === 'transfer' ? 'text-foreground' : 'text-muted-foreground'}`} />
            <p className="font-bold text-foreground text-sm">تحويل بنكي</p>
            <p className="text-xs text-muted-foreground mt-1">حوّل وأرفق الإيصال</p>
          </button>
          <button
            onClick={() => setMethod('card')}
            className={`p-5 rounded-2xl border-2 transition-all text-center ${
              method === 'card' ? 'border-foreground bg-foreground/5' : 'border-border hover:border-foreground/20'
            }`}
          >
            <CreditCard className={`w-8 h-8 mx-auto mb-2 ${method === 'card' ? 'text-foreground' : 'text-muted-foreground'}`} />
            <p className="font-bold text-foreground text-sm">بطاقة بنكية</p>
            <p className="text-xs text-muted-foreground mt-1">مدى / فيزا / ماستركارد</p>
          </button>
        </div>

        {/* Transfer Details */}
        {method === 'transfer' && (
          <div className="rounded-2xl border border-border p-5 animate-fade-in-up space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Building2 className="w-5 h-5 text-muted-foreground" />
              بيانات الحوالة
            </h3>
            <div className="space-y-2">
              {[
                { label: 'البنك', value: bankDetails.bank },
                { label: 'اسم الحساب', value: bankDetails.name },
                { label: 'IBAN', value: bankDetails.iban, copyable: true },
                { label: 'المبلغ', value: bankDetails.amount },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-foreground font-medium text-sm" dir="ltr">{item.value}</p>
                  </div>
                  {item.copyable && (
                    <button onClick={() => copyToClipboard(item.value)} className="text-foreground hover:text-foreground/70 transition-colors">
                      {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Receipt Upload */}
            <div>
              <Label className="text-foreground font-medium mb-1.5 block text-xs flex items-center gap-1">
                <Upload className="w-3 h-3 text-muted-foreground" />
                إرفاق الإيصال <span className="text-destructive">*</span>
              </Label>
              <div className="border-2 border-dashed border-border rounded-xl p-3 text-center hover:border-foreground/20 transition-colors">
                <input type="file" accept="image/*,.pdf" onChange={e => setReceiptFile(e.target.files?.[0] || null)} className="hidden" id="receipt-upload" />
                <label htmlFor="receipt-upload" className="cursor-pointer">
                  {receiptFile ? (
                    <div className="flex items-center justify-center gap-2 text-success">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">{receiptFile.name}</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-6 h-6 mx-auto text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">اضغط لرفع الإيصال</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-warning/5 border border-warning/20">
              <p className="text-xs text-warning font-medium">⚠️ يرجى كتابة اسمك في ملاحظات التحويل</p>
            </div>

            <Button
              onClick={handleTransferConfirm}
              disabled={transferConfirmed || !receiptFile || processing}
              className="w-full h-12 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-lg"
            >
              {uploadingReceipt ? (
                <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />جاري الرفع...</span>
              ) : transferConfirmed ? (
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" />تم الإرسال</span>
              ) : (
                'تأكيد التحويل'
              )}
            </Button>

            {transferConfirmed && (
              <div className="p-4 rounded-xl bg-muted/50 border border-border text-center space-y-1">
                <Clock className="w-6 h-6 text-foreground mx-auto" />
                <p className="font-bold text-foreground text-sm">طلبك قيد المراجعة</p>
                <p className="text-xs text-muted-foreground">سيتم التحقق وتفعيل حسابك خلال وقت قصير</p>
              </div>
            )}
          </div>
        )}

        {/* Card Form */}
        {method === 'card' && (
          <div className="rounded-2xl border border-border p-5 animate-fade-in-up space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              بيانات البطاقة
            </h3>
            <div className="space-y-3">
              <div>
                <Label className="text-foreground font-medium mb-1 block text-xs">رقم البطاقة</Label>
                <Input
                  placeholder="XXXX XXXX XXXX XXXX"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())}
                  className="h-11 text-left" dir="ltr"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-foreground font-medium mb-1 block text-xs">تاريخ الانتهاء</Label>
                  <Input placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="h-11 text-left" dir="ltr" />
                </div>
                <div>
                  <Label className="text-foreground font-medium mb-1 block text-xs">CVV</Label>
                  <Input placeholder="XXX" value={cvv} onChange={(e) => setCvv(e.target.value)} className="h-11 text-left" dir="ltr" type="password" />
                </div>
              </div>
            </div>

            <Button
              onClick={handleCardPayment}
              disabled={processing}
              className="w-full h-12 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-lg"
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري المعالجة...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  ادفع {finalPrice} ر.س
                </span>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3 h-3" />
              <span>دفع آمن ومشفر</span>
            </div>
          </div>
        )}
      </div>
    </StepperLayout>
  );
};

export default Payment;
