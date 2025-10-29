
import React, { useState, FormEvent } from 'react';

const QUESTIONS = [
  'What is your age range? (younger investors often tolerate more risk)',
  'What is your primary financial goal for investing?',
  'How long do you plan to keep your investments before needing the money?',
  'How stable is your income or employment situation?',
  'How much do you have saved for emergencies?',
  'If your investment dropped 20% in value this year, what would you do?',
  'How comfortable are you with investments that can change in value from month to month?',
  'How much experience do you have with investing?',
  'Do you currently have significant debts (credit cards, loans, etc.)?',
  'Which best describes your investing personality?'
];

export default function AssessmentForm({ onComplete }: { onComplete: (result: { riskLevel: string; answers: number[] }) => void }) {
  const [answers, setAnswers] = useState<number[]>(Array(QUESTIONS.length).fill(1));

  const handleChange = (i:number, v:number) => {
    const copy = [...answers]; copy[i]=v; setAnswers(copy);
  };

  const calc = () => {
    // map answers 1..5 -> score 1..3 scale roughly
    const scores = answers.map((a) => Math.round(((a-1)/4)*2)+1);
    const total = scores.reduce((s,n)=>s+n,0);
    const pct = total / (QUESTIONS.length * 3) * 100;
    const level = pct < 40 ? 'Low' : pct < 70 ? 'Medium' : 'High';
    return { level, scores };
  };

  const onSubmit = (e:FormEvent) => {
    e.preventDefault();
    const { level, scores } = calc();
    onComplete({ riskLevel: level, answers: scores });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      {QUESTIONS.map((q,i)=> (
        <div key={i}>
          <label className="block font-medium mb-1">{i+1}. {q}</label>
          <input type="range" min={1} max={5} value={answers[i]} onChange={(e)=>handleChange(i, Number(e.target.value))} className="w-full" />
          <div className="text-sm text-gray-600">Selected: {answers[i]}</div>
        </div>
      ))}
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">See My Profile</button>
      </div>
    </form>
  );
}
