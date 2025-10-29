
import axios from 'axios';

export async function getQuote(symbol: string) {
  const key = process.env.NEXT_PUBLIC_ALPHAVANTAGE_KEY;
  if (!key) throw new Error('Alpha Vantage API key not set');
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${key}`;
  const resp = await axios.get(url);
  return resp.data;
}
