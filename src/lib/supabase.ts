import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// On Vercel, environment variables might be missing during the pre-rendering phase of the build.
// We provide placeholder values to prevent '@supabase/ssr' from throwing an error.
// The real values will be available at runtime in the browser.
export const supabase = createBrowserClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
