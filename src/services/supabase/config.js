import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket names
export const BUCKETS = {
  GALLERY: 'gallery-images',
  PRODUCTS: 'product-images',
  CONTENT: 'content-images',
};

export default supabase;
