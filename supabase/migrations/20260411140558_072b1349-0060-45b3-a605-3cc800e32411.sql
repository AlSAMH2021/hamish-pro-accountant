
-- Add receipt_url and nda_accepted to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS receipt_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nda_accepted boolean NOT NULL DEFAULT false;

-- Create discount_codes table
CREATE TABLE public.discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_percent integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  max_uses integer,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage discount codes" ON public.discount_codes
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can view active codes" ON public.discount_codes
  FOR SELECT TO authenticated
  USING (is_active = true);

-- Create discount_code_usages table
CREATE TABLE public.discount_code_usages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code_id uuid NOT NULL REFERENCES public.discount_codes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  used_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.discount_code_usages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all usages" ON public.discount_code_usages
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert their own usage" ON public.discount_code_usages
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for receipts
INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', false);

CREATE POLICY "Users can upload their own receipt" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own receipt" ON storage.objects
  FOR SELECT USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all receipts" ON storage.objects
  FOR SELECT USING (bucket_id = 'receipts' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
