-- Fix auth callback: allow users to insert own profile on first sign-in
-- Without this, RLS blocks the upsert when a new user signs in via Google OAuth

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);
