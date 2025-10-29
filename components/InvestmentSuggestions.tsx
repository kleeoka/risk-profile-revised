import React from 'react';

// Expanded list of real ETFs and stock examples per risk profile.
// Each item includes ticker (if applicable) and a short note.
// These are educational examples — not investment advice.

const suggestions: Record<string, { name: string; ticker?: string; note: string }[]> = {
  Low: [
    { name: 'Vanguard Total Bond Market ETF', ticker: 'BND', note: 'Broad exposure to US investment-grade bonds; lower volatility than stocks.' },
    { name: 'iShares 1-3 Year Treasury Bond ETF', ticker: 'SHY', note: 'Short-term U.S. Treasury bonds with lower interest-rate sensitivity.' },
    { name: 'Vanguard Short-Term Treasury ETF', ticker: 'VGSH', note: 'Very short-term Treasuries (low risk, lower yield).' },
    { name: 'High-Yield Savings Account', note: 'FDIC-insured cash alternative for emergency funds.' }
  ],
  Medium: [
    { name: 'Vanguard Total Stock Market ETF', ticker: 'VTI', note: 'Broad U.S. equity exposure — core holding for many investors.' },
    { name: 'Vanguard FTSE All-World ex-US ETF', ticker: 'VEU', note: 'Diversified international equity exposure.' },
    { name: 'Schwab U.S. Dividend Equity ETF', ticker: 'SCHD', note: 'Dividend-focused U.S. stocks for income & stability.' },
    { name: 'iShares Core U.S. Aggregate Bond ETF', ticker: 'AGG', note: 'Core bond allocation to balance equity exposure.' }
  ],
  High: [
    { name: 'SPDR S&P 500 ETF Trust', ticker: 'SPY', note: 'Tracks the S&P 500 — exposes you to large-cap U.S. stocks.' },
    { name: 'Invesco QQQ Trust', ticker: 'QQQ', note: 'Concentrated on major tech and growth companies (higher volatility).' },
    { name: 'ARK Innovation ETF', ticker: 'ARKK', note: 'Active ETF focused on disruptive innovation — high risk/high potential.' },
    { name: 'Tesla, Inc.', ticker: 'TSLA', note: 'Individual stock — high volatility. Consider diversification if holding.' },
    { name: 'Cryptocurrency (education only)', note: 'Highly volatile — only for investors who accept significant risk.' }
  ]
};

export default function InvestmentSuggestions({ risk }: { risk: 'Low'|'Medium'|'High' }) {
  const list = suggestions[risk] || suggestions['Medium'];
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold">Suggested Investments — {risk} Risk</h3>
      <ul className="mt-3 list-disc ml-6 space-y-2">
        {list.map((s, i) => (
          <li key={i}>
            <strong>{s.name}</strong>{s.ticker ? ` (${s.ticker})` : ''} — <span className="text-sm text-gray-600">{s.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
