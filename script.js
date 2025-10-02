// --- Shared Data ---
const streams = [
  { name: "Full-time Job", target: 35000, earned: 25000 },
  { name: "Freelance Photo/Design", target: 25000, earned: 0 },
  { name: "Creator (YT + Collabs + UGC)", target: 20000, earned: 0 },
  { name: "LinkedIn Services", target: 15000, earned: 0 },
];
const weeklyTasks = [
  "Post 3-4 LinkedIn posts/week",
  "3-4 Shorts/Reels per week",
  "5-10 brand pitches/week",
  "1 long YouTube video/week",
  "2 hrs/day blocked for side projects",
  "Weekly income review (Sunday)"
];
const dailyTasks = [
  "Check emails & messages",
  "Create content snippet",
  "Engage on LinkedIn",
  "Work on side project",
  "Pitch 1-2 brands"
];
const months = [
  { name: "Jan", target: 25000, earned: 25000 },
  { name: "Feb", target: 30000, earned: 0 },
  { name: "Mar", target: 35000, earned: 0 },
  { name: "Apr", target: 40000, earned: 0 },
  { name: "May", target: 45000, earned: 0 },
  { name: "Jun", target: 50000, earned: 0 },
  { name: "Jul", target: 55000, earned: 0 },
  { name: "Aug", target: 60000, earned: 0 },
  { name: "Sep", target: 65000, earned: 0 },
  { name: "Oct", target: 70000, earned: 0 },
  { name: "Nov", target: 75000, earned: 0 },
  { name: "Dec", target: 80000, earned: 0 },
];

// --- FUNCTIONS ---
function totalEarned(){ return streams.reduce((a,b)=>a+b.earned,0); }

// --- Daily Page ---
function renderDailyTasks(){
  const container = document.getElementById('dailyTasksContainer');
  if(!container) return;
  container.innerHTML = '';
  dailyTasks.forEach((t,i)=>{
    const div = document.createElement('div');
    div.className = 'task';
    const checked = sessionStorage.getItem(`daily-${i}`) === '1' ? 'checked' : '';
    div.innerHTML = `<label><input type="checkbox" id="daily-${i}" ${checked}> ${t}</label>`;
    container.appendChild(div);
    document.getElementById(`daily-${i}`).addEventListener('change',(e)=>{
      sessionStorage.setItem(`daily-${i}`, e.target.checked ? '1':'0');
    });
  });
}
function clearDailyTasks(){
  dailyTasks.forEach((_,i)=>sessionStorage.removeItem(`daily-${i}`));
  renderDailyTasks();
}

// --- Weekly Page ---
function renderWeeklyStreamsTasks(){
  const streamsDiv = document.getElementById('weeklyStreams');
  const tasksDiv = document.getElementById('weeklyTasks');
  if(!streamsDiv || !tasksDiv) return;
  streamsDiv.innerHTML = '<h2>Streams</h2>';
  tasksDiv.innerHTML = '<h2>Weekly Tasks</h2>';

  streams.forEach((s,i)=>{
    const div = document.createElement('div');
    div.className='stream';
    div.innerHTML=`<span>${s.name}</span><input type="number" id="week-stream-${i}" value="${s.earned}"> / ₹${s.target.toLocaleString()}`;
    streamsDiv.appendChild(div);
    document.getElementById(`week-stream-${i}`).addEventListener('input',(e)=>{ s.earned=Number(e.target.value)||0; });
  });

  weeklyTasks.forEach((t,i)=>{
    const div = document.createElement('div');
    div.className='task';
    const checked = sessionStorage.getItem(`weekly-${i}`) === '1' ? 'checked':'';
    div.innerHTML=`<label><input type="checkbox" id="weekly-${i}" ${checked}> ${t}</label>`;
    tasksDiv.appendChild(div);
    document.getElementById(`weekly-${i}`).addEventListener('change',(e)=>{ sessionStorage.setItem(`weekly-${i}`, e.target.checked?'1':'0'); });
  });

  const exportBtn = document.getElementById('exportWeeklyCSV');
  if(exportBtn) exportBtn.addEventListener('click',()=>{
    let csv='Type,Name,Target,Earned\n';
    streams.forEach(s=>{ csv+=`Stream,${s.name},${s.target},${s.earned}\n`; });
    weeklyTasks.forEach((t,i)=>{
      const done = document.getElementById(`weekly-${i}`).checked?1:0;
      csv+=`Task,${t},,${done}\n`;
    });
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='weekly.csv'; a.click(); URL.revokeObjectURL(url);
  });
}

// --- Monthly Page ---
function renderMonthlyChart(){
  const ctx=document.getElementById('monthlyChart');
  if(!ctx) return;
  new Chart(ctx.getContext('2d'),{
    type:'line',
    data:{
      labels: months.map(m=>m.name),
      datasets:[
        { label:'Target', data: months.map(m=>m.target), borderColor:'#a78bfa', backgroundColor:'#a78bfa33', tension:0.4 },
        { label:'Earned', data: months.map((m,i)=>streams[i]?streams[i].earned:0), borderColor:'#34d399', backgroundColor:'#34d39933', tension:0.4 }
      ]
    },
    options:{ responsive:true, plugins:{ legend:{ position:'top' } }, scales:{ y:{ beginAtZero:true, ticks:{ callback:v=>'₹'+v.toLocaleString() } } } }
  });

  const exportBtn = document.getElementById('exportMonthlyCSV');
  if(exportBtn) exportBtn.addEventListener('click',()=>{
    let csv='Month,Target,Earned\n';
    months.forEach((m,i)=>{ csv+=`${m.name},${m.target},${streams[i]?streams[i].earned:0}\n`; });
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='monthly.csv'; a.click(); URL.revokeObjectURL(url);
  });
}
