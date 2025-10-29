const questions = [
  { prompt: 'What is your age range?', options:['Under 25','25-34','35-44','45-54','55+'] },
  { prompt: 'Primary financial goal?', options:['Preserve money','Steady income','Grow aggressively'] },
  { prompt: 'How long before you need the money?', options:['<3 years','3-7 years','>7 years'] },
  { prompt: 'Income stability?', options:['Very stable','Somewhat stable','Unstable'] },
  { prompt: 'Emergency savings?', options:['<3 months','3-6 months','>6 months'] },
  { prompt: 'If you lost 20% this year, would you?', options:['Sell','Wait','Buy more'] },
  { prompt: 'Comfort with monthly fluctuations?', options:['Uncomfortable','Somewhat','Comfortable'] },
  { prompt: 'Experience with investing?', options:['None','Some','Moderate','Extensive'] },
  { prompt: 'Significant debts?', options:['Yes','Some','None'] },
  { prompt: 'Investing personality?', options:['Cautious','Balanced','Ambitious'] },
];

const qDiv = document.getElementById('questions');
questions.forEach((q,i)=>{
  const d = document.createElement('div');
  d.innerHTML = `<p>${i+1}. ${q.prompt}</p>`;
  q.options.forEach((opt,idx)=>{
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.onclick = ()=> {
      d.querySelectorAll('button').forEach(b=>{b.style.background=''; b.style.color='black';});
      btn.style.background='#3182ce'; btn.style.color='white';
      d.dataset.choice = idx;
      checkReady();
    };
    btn.style.marginRight = '6px';
    d.appendChild(btn);
  });
  qDiv.appendChild(d);
});

function checkReady(){
  const answered = Array.from(qDiv.children).filter(d=>d.dataset.choice!==undefined).length;
  document.getElementById('resultsBtn').disabled = answered < questions.length;
  if(answered > questions.length) document.getElementById('resultsBtn').textContent = 'Show My Results';
}

document.getElementById('resultsBtn').onclick = ()=>{
  const scores = Array.from(qDiv.children).map((d,i)=>{
    const idx = Number(d.dataset.choice||0);
    const optCount = questions[i].options.length;
    return Math.round((idx/(optCount-1))*2)+1;
  });
  const total = scores.reduce((a,b)=>a+b,0);
  const pct = total / (questions.length*3) * 100;
  let level = pct < 40 ? 'Low Risk' : pct < 70 ? 'Medium Risk' : 'High Risk';
  document.getElementById('profile').textContent = `Your profile: ${level}`;
};

function simulate(initial, monthly, years, annualRate){
  const months = Math.round(years*12);
  let balance = Number(initial);
  const monthlyRate = Math.pow(1+annualRate, 1/12)-1;
  for(let m=1;m<=months;m++){
    balance += Number(monthly);
    balance *= 1+monthlyRate;
  }
  return Math.round(balance*100)/100;
}

document.getElementById('runSim').onclick = ()=>{
  const initial = Number(document.getElementById('initial').value);
  const monthly = Number(document.getElementById('monthly').value);
  const years = Number(document.getElementById('years').value);
  if(document.getElementById('risk-level').value === 'Low'){
    rate = 0.03;
  } 
  else if(document.getElementById('risk-level').value === 'Medium'){
    rate = 0.06;
  } 
  else {
    rate = 0.09;
  }
  const res = simulate(initial, monthly, years, rate);
  document.getElementById('simResult').textContent = `Projected balance: $${res}`;
};

document.getElementById('getQuote').onclick = async ()=>{
  const symbol = document.getElementById('symbol').value.trim();
  const key = '142PVNI3ODQ6E60C';
  if(!key){ document.getElementById('quoteResult').textContent = 'No key provided — using mock data.'; return; }
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${key}`;
  try {
    const r = await fetch(url);
    const data = await r.json();
  // Check if the expected data block exists
        const quote = data['Global Quote'];
        
        if (!quote || Object.keys(quote).length === 0) {
            // Handle API errors or limits
            const errorMessage = data['Error Message'] || 'No quote data found. Check symbol or API key.';
            document.getElementById('quoteResult').textContent = `Error: ${errorMessage}`;
            return;
        }

        // --- Extract and Format Key Metrics ---
        
        // Define a helper function for consistent number formatting (2 decimal places)
        const formatNum = (value) => Number(value).toFixed(2);
        
        // Use padEnd for consistent spacing/alignment in plain text
        const labelWidth = 15;
        
        // 1. Core Price Info
        let output = `--- STOCK QUOTE ---\n`;
        output += `SYMBOL:         ${quote['01. symbol']}\n`;
        output += `PRICE:          $${formatNum(quote['05. price'])}\n`;
        output += `---------------------\n`;
        
        // 2. Change Info
        const change = formatNum(quote['09. change']);
        const changePercent = quote['10. change percent'];
        
        output += `CHANGE (USD):   ${change > 0 ? '+' : ''}$${change}\n`;
        output += `CHANGE (%):     ${changePercent}\n`;
        output += `---------------------\n`;
        
        // 3. Daily Metrics
        output += 'DAILY METRICS:\n';
        output += ' '.repeat(3) + 'Open:'.padEnd(labelWidth) + `$${formatNum(quote['02. open'])}\n`;
        output += ' '.repeat(3) + 'High:'.padEnd(labelWidth) + `$${formatNum(quote['03. high'])}\n`;
        output += ' '.repeat(3) + 'Low:'.padEnd(labelWidth) + `$${formatNum(quote['04. low'])}\n`;
        output += ' '.repeat(3) + 'Volume:'.padEnd(labelWidth) + `${Number(quote['06. volume']).toLocaleString()}\n`;
        output += `---------------------\n`;


        // Update the plain text element
        document.getElementById('quoteResult').textContent = output;

    } catch (e) {
        document.getElementById('quoteResult').textContent = `Error fetching quote: ${e.message || 'Network failed.'}`;
    }

  
};