import { createClient } from "@supabase/supabase-js";

// .env.local に書いた値を読む（NEXT_PUBLIC_ で始まる名前だけブラウザから使える）
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
