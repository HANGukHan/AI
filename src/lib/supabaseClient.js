import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const isValidUrl = (url) => {
  return url && (url.startsWith('http://') || url.startsWith('https://'));
};

const finalUrl = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder.supabase.co';
const finalKey = (isValidUrl(supabaseUrl) && supabaseAnonKey) ? supabaseAnonKey : 'placeholder-key';

if (!isValidUrl(supabaseUrl) || !supabaseAnonKey) {
  console.warn(
    'Supabase URL or Anon Key is missing or invalid. Falling back to LocalStorage.'
  )
}

export const supabase = createClient(finalUrl, finalKey)
