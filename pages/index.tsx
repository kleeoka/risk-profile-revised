
import React, { useState } from 'react';
import AssessmentForm from '../components/AssessmentForm';
import InvestmentSuggestions from '../components/InvestmentSuggestions';
import SimulationChart from '../components/SimulationChart';
import axios from 'axios';

export default function Home() {
  const [profile, setProfile] = useState<{ riskLevel: 'Low'|'Medium'|'High'; answers:number[] }|null>(null);
  const [simData, setSimData] = useState<{ year:number; balance:number }[]|null>(null);
  const [quote, setQuote] = useState<any>(null);

  const onComplete = async (res:{ riskLevel:string; answers:number[] }) => {
    const level = res.riskLevel as 'Low'|'Medium'|'High';
    setProfile({ riskLevel: level, answers: res.answers });
    // simple simulation: 3%,6%,9%
    const rate = level==='Low'?0.03:level==='Medium'?0.06:0.09;
    const years = 10;
    const initial = 100;
    const monthly = 25;
    const months = years*12;
    const monthlyRate = Math.pow(1+rate,1/12)-1;
    let balance = initial;
    const history = [];
    for (let m=1;m<=months;m++){ balance += monthly; balance *= 1+monthlyRate; if(m%12===0) history.push({ year: m/12, balance: Math.round(balance*100)/100 }); }
    setSimData(history);

    // save to supabase via API route
    try {
      await axios.post('/api/submitProfile', { riskLevel: level, answers: res.answers });
    } catch(err){ console.error('Failed to save profile', err); }
  };

  const fetchQuote = async (ticker:string) => {
    setQuote(null);
    try {
      const r = await axios.get('/api/liveQuote', { params: { symbol: ticker } });
      setQuote(r.data);
    } catch(err){ setQuote({ error: 'Failed to fetch quote' }); }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold">SmartStart Investing — Live Demo</h1>
          <p className="text-gray-600">Assess risk, see suggestions, save to Supabase.</p>
        </header>

        {!profile && <AssessmentForm onComplete={onComplete} />}

        {profile && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="bg-white p-4 rounded shadow">
                <h2 className="font-semibold">Your Risk Profile</h2>
                <div className="text-xl font-bold">{profile.riskLevel} Risk</div>
                <div className="mt-2"><InvestmentSuggestions level={profile.riskLevel} onFetch={fetchQuote} /></div>
              </div>
              <div className="mt-4 bg-white p-4 rounded shadow">
                <h3 className="font-semibold">Live Quote</h3>
                <div className="mt-2">
                  <input placeholder="Ticker (e.g. VOO)" id="tickerInput" className="p-2 border rounded w-full" />
                  <button className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded" onClick={()=>{ const val=(document.getElementById('tickerInput') as HTMLInputElement).value; fetchQuote(val); }}>Get Quote</button>
                </div>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">{quote?JSON.stringify(quote,null,2):'No quote yet'}</pre>
              </div>
            </div>

            <div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">Simulation (10 years)</h3>
                {simData ? <SimulationChart data={simData} /> : <div>No simulation yet</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
