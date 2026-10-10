import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("SUPABASE_URL / SUPABASE_KEY belum diisi (cek file .env atau Environment Variables di Vercel)");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
