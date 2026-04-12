import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import StepperLayout from '@/components/StepperLayout';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

const NdaAgreement = () => {
  const { setCurrentStep, session } = useApp();
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAccept = async () => {
    if (!agreed || !session?.user) return;
    setSubmitting(true);
    await supabase.from('profiles').update({ nda_accepted: true }).eq('user_id', session.user.id);
    setCurrentStep(5);
    setSubmitting(false);
  };

  return (
    <StepperLayout activePage="nda">
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">اتفاقية عدم إفشاء السرية</h2>
              <p className="text-xs text-muted-foreground">يرجى قراءة الاتفاقية والموافقة عليها</p>
            </div>
          </div>

          <div className="bg-muted/30 rounded-xl p-5 space-y-4 text-sm text-foreground leading-relaxed max-h-[350px] overflow-y-auto border border-border/50">
            <p className="font-bold">اتفاقية عدم إفشاء وسرية المعلومات</p>
            <p>بموجب هذه الاتفاقية، أتعهد أنا المتقدم/ة للتقييم بالآتي:</p>
            <ol className="list-decimal space-y-3 pr-5">
              <li><strong>السرية التامة:</strong> أتعهد بالحفاظ على سرية جميع أسئلة التقييم ومحتوياته وعدم مشاركتها مع أي طرف آخر بأي شكل من الأشكال.</li>
              <li><strong>عدم التصوير أو النسخ:</strong> أتعهد بعدم تصوير أو نسخ أو تسجيل أي جزء من التقييم أو نتائجه التفصيلية.</li>
              <li><strong>الاستخدام الشخصي:</strong> أقر بأن هذا التقييم مخصص لاستخدامي الشخصي فقط.</li>
              <li><strong>حماية الملكية الفكرية:</strong> أقر بأن جميع المحتويات ملكية فكرية لمؤسسة هامش للتدريب.</li>
              <li><strong>المسؤولية القانونية:</strong> أدرك أن مخالفة هذه الاتفاقية قد تعرضني للمساءلة القانونية.</li>
            </ol>
            <p className="text-muted-foreground text-xs mt-4">بالموافقة أقر بأنني قرأت وفهمت جميع البنود وأوافق على الالتزام بها.</p>
          </div>

          <div className="mt-5">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-border text-foreground focus:ring-foreground"
              />
              <span className="text-sm text-foreground font-medium">أقر بأنني قرأت اتفاقية عدم إفشاء السرية وأوافق على جميع بنودها</span>
            </label>
          </div>

          <Button
            onClick={handleAccept}
            disabled={!agreed || submitting}
            className="w-full h-12 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-lg mt-5 gap-2"
          >
            الموافقة والبدء بالتقييم
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </StepperLayout>
  );
};

export default NdaAgreement;
