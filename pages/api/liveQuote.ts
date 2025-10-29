
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { symbol } = req.query;
  const key = process.env.NEXT_PUBLIC_ALPHAVANTAGE_KEY;
  if (!key) return res.status(500).json({ error: 'Alpha Vantage key not configured' });
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(String(symbol))}&apikey=${key}`;
    const r = await axios.get(url);
    return res.status(200).json(r.data);
  } catch (err:any) {
    return res.status(500).json({ error: String(err.message) });
  }
}
