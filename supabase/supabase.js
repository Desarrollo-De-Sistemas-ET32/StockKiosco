// supabase/supabase.js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://vqkilvejuwcsxufssdvx.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxa2lsdmVqdXdjc3h1ZnNzZHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjA2MzEsImV4cCI6MjA2MzIzNjYzMX0.qO5W9toOEze0NPtJiV6E1aDTput2MSWy6Mzf38AjYK8'
);
