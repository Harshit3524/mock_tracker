import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type MockEntry = {
  id: string;
  user_name: string;
  exam_name: string;
  exam_date: string;
  score: number;
  max_score: number;
  accuracy: number;
  platform: string;
  notes: string;
  created_at: string;
};

export type PdfDoc = {
  id: string;
  name: string;
  description: string;
  uploaded_by: string;
  file_path: string;
  created_at: string;
};
