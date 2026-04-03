
-- Notify all admins helper function
CREATE OR REPLACE FUNCTION public.notify_admins(p_title TEXT, p_message TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, message)
  SELECT user_id, p_title, p_message
  FROM public.user_roles
  WHERE role = 'admin';
END;
$$;

-- Notify a specific user helper function
CREATE OR REPLACE FUNCTION public.notify_user(p_user_id UUID, p_title TEXT, p_message TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, message)
  VALUES (p_user_id, p_title, p_message);
END;
$$;

-- 1. New user registered → notify admins
CREATE OR REPLACE FUNCTION public.on_profile_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM notify_admins('تسجيل جديد', 'قام ' || NEW.name || ' بإنشاء حساب جديد');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profile_created
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.on_profile_created();

-- 2. Payment or status changes on profile → notify accordingly
CREATE OR REPLACE FUNCTION public.on_profile_updated()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Payment completed
  IF OLD.payment_status = false AND NEW.payment_status = true THEN
    PERFORM notify_admins('دفع جديد', 'قام ' || NEW.name || ' بإتمام الدفع');
    PERFORM notify_user(NEW.user_id, 'تم تأكيد الدفع', 'تم تأكيد عملية الدفع بنجاح. يمكنك الآن بدء الاختبار.');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profile_updated
AFTER UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.on_profile_updated();

-- 3. Exam completed → notify admins + user
CREATE OR REPLACE FUNCTION public.on_exam_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name TEXT;
  v_result TEXT;
BEGIN
  SELECT name INTO v_name FROM public.profiles WHERE user_id = NEW.user_id;
  v_result := CASE WHEN NEW.passed THEN 'ناجح' ELSE 'لم يجتز' END;
  PERFORM notify_admins('اختبار جديد', v_name || ' أكمل الاختبار — ' || v_result || ' (' || NEW.total_score || '%)');
  PERFORM notify_user(NEW.user_id, 'نتيجة الاختبار', 'تم تسجيل نتيجتك: ' || NEW.total_score || '% — ' || v_result);
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_exam_created
AFTER INSERT ON public.exam_results
FOR EACH ROW EXECUTE FUNCTION public.on_exam_created();

-- 4. Booking created → notify admins
CREATE OR REPLACE FUNCTION public.on_booking_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name TEXT;
BEGIN
  SELECT name INTO v_name FROM public.profiles WHERE user_id = NEW.user_id;
  PERFORM notify_admins('حجز جلسة جديد', v_name || ' حجز جلسة بتاريخ ' || NEW.date || ' الساعة ' || NEW.time);
  PERFORM notify_user(NEW.user_id, 'تم تأكيد الحجز', 'تم حجز جلستك بتاريخ ' || NEW.date || ' الساعة ' || NEW.time || '. سيتم إرسال الرابط قريباً.');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_booking_created
AFTER INSERT ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.on_booking_created();

-- 5. Booking updated (link sent or session completed) → notify user
CREATE OR REPLACE FUNCTION public.on_booking_updated()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Session link added/changed
  IF (OLD.session_link IS NULL OR OLD.session_link = '') AND NEW.session_link IS NOT NULL AND NEW.session_link != '' THEN
    PERFORM notify_user(NEW.user_id, 'رابط الجلسة', 'تم إرسال رابط جلستك الاستشارية. يمكنك الاطلاع عليه من صفحة الحجز.');
  END IF;
  -- Session completed
  IF OLD.session_completed = false AND NEW.session_completed = true THEN
    PERFORM notify_user(NEW.user_id, 'اكتملت الجلسة', 'تم تحديث حالة جلستك كمكتملة. يمكنك الآن الاطلاع على التقرير.');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_booking_updated
AFTER UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.on_booking_updated();
