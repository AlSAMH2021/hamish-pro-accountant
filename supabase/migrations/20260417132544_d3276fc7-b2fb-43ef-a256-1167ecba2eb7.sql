ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS manager_name TEXT,
  ADD COLUMN IF NOT EXISTS manager_phone TEXT,
  ADD COLUMN IF NOT EXISTS manager_email TEXT;