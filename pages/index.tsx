import React, { useState } from 'react';
import AssessmentForm, { Answer } from '../components/AssessmentForm';
import InvestmentSuggestions from '../components/InvestmentSuggestions';
import SimulationChart from '../components/SimulationChart';

function simulateGrowth(initial: number, monthly: number, years: number, annualRate: number) {
  const months = Math.round(years * 12);
  const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
  let balance = initial;
  const history: { year: number; balance: number }[] = [];
  for (let m = 1; m <= months; m++) {
    balance += monthly;
    balance *= 1 + monthlyRate;
    if (m % 12 === 0) history.push({ year: m / 12, balance: Math.round(balance * 100) / 100 });
  }
  return { balance: Math.round(balance * 100) / 100, history };
}

export default function Home() {
  const [answers, setAnswers] = useState<Answer[] | null>(null);
  const [risk, setRisk] = useState<'Low' | 'Medium' | 'High' | null>(null);
  const [sim, setSim] = useState<{ balance: number; history: { year: number; balance: number }[] } | null>(null);

  const handleComplete = async (ans: Answer[], riskLevel: string) => {
    setAnswers(ans);
    const r = riskLevel as 'Low' | 'Medium' | 'High';
    setRisk(r);

    // Run a default simulation based on risk
    const rate = r === 'High' ? 0.09 : r === 'Medium' ? 0.06 : 0.03;
    const simRes = simulateGrowth(100, 25, 10, rate);
    setSim(simRes);

    // Save to Supabase
    try {
      await fetch('/api/submitProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ riskLevel: r, answers: ans })
      });
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold">SmartStart Investing</h1>
          <p className="text-gray-600">Assess your risk and explore starter-friendly investments.</p>
        </header>

        {!answers ? (
          <AssessmentForm onComplete={handleComplete} />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              {risk && <InvestmentSuggestions risk={risk} />}
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">Your Answers</h3>
                <pre className="text-sm mt-2">{JSON.stringify(answers, null, 2)}</pre>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">Simulation (10 years)</h3>
                {sim && <p className="text-sm">Projected: <strong>${sim.balance}</strong></p>}
                {sim && <SimulationChart data={sim.history} />}
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">Next Steps</h3>
                <p className="text-sm">
                  Consider starting with a small allocation in the suggested funds and increase over time.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
