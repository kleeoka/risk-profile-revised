
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { riskLevel, answers, userId } = req.body;
  const { data, error } = await supabase.from('risk_profiles').insert([{ user_id: userId || null, risk_level: riskLevel, responses: answers }]);
  if (error) return res.status(500).json({ error });
  return res.status(200).json({ success: true, data });
}
