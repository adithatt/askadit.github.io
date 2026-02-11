import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export type Topic = {
  id: string;
  section: string;
  title: string;
  photo: string | null;
  preview: string | null;
  content: string | null;
};

export type Quote = {
  id: string;
  quote_text: string;
  author: string;
  reflection: string | null;
}
