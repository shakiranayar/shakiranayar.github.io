// --- DATA ---
let streams = [
  { name: "Full-time Job", target: 35000, earned: Number(localStorage.getItem('stream-0')) || 25000 },
  { name: "Freelance Photo/Design", target: 25000, earned: Number(localStorage.getItem('stream-1')) || 0 },
  { name: "Creator (YT + Collabs + UGC)", target: 20000, earned: Number(localStorage.getItem('stream-2')) || 0 },
  { name: "LinkedIn Services", target: 15000, earned: Number(localStorage.getItem('stream-3')) || 0 },
];

let dailyTasks = JSON.parse(localStorage.getItem('dailyTasks')) || [
  { name: "Check emails & messages", done: false },
  { name: "Create content snippet", done: false },
  { name: "Engage on LinkedIn", done: false },
  { name: "Work on side project", done: false },
  { name: "Pitch 1-2 brands", done: false }
];

let weeklyTasks = JSON.parse(localStorage.getItem('weeklyTasks')) || [
  { name: "Post 3-4 LinkedIn posts/week", done:false },
  { name: "3-4 Shorts/Reels per week", done:false },
  { name: "5-10 brand pitches/week", done:false },
  { name: "1 long YouTube video/week", done:false },
  { name: "2 hrs/day blocked for side projects", done:false },
  { name: "Weekly income review (Sunday)", done:false }
];

// --- LOCAL STORAGE HELPERS ---
function saveStreams(){ streams.forEach((s,i)=>localStorage.setItem(`stream-${i}`, s.earned)); }
function saveDailyTasks(){ localStorage.setItem('dailyTasks', JSON.stringify(dailyTasks)); }
function saveWeeklyTasks(){ localStorage.setItem('weeklyTasks', JSON.stringify(weeklyTasks)); }

// --- PROGRESS CALCULATIONS ---
function calcProgress(tasks){ return tasks.reduce((a,b)=>a+(b.done?1:0),0)/tasks.length*100; }
function updateProgressBar(barId, percent){ const bar = document.getElementById(barId); if(bar) bar.querySelector('.progress-bar-fill').style.width = percent + '%'; }

// --- DAILY TASKS ---
function renderDailyTasks(){
  const container = document.getElementById('dailyTasksContainer');
  if(!container) return;
  container.innerHTML = '';
  dailyTasks.forEach((t,i)=>{
    const div = document.createElement('div');
    div.className='task';
    div.innerHTML=`<label><input type="checkbox" data-id="${i}" ${t.done?'checked':''}> ${t.name}</label>`;
    container.appendChild(div);
  });
  container.querySelectorAll('input[type=checkbox]').forEach(cb=>{
    cb.addEventListener('change', e=>{
      const id = e.target.dataset.id;
      dailyTasks[id].done = e.target.checked;
      saveDailyTasks();
      updateProgressBar('dailyProgressBar', calcProgress(dailyTasks));
    });
  });
  updateProgressBar('dailyProgressBar', calcProgress(dailyTasks));
}

// --- WEEKLY STREAMS & TASKS ---
function renderWeeklyStreamsTasks(){
  const streamsDiv = document.getElementById('weeklyStreams');
  const tasksDiv = document.getElementById('weeklyTasks');
  if(!streamsDiv || !tasksDiv) return;
  streamsDiv.innerHTML='<h2>Streams</h2>';
  tasksDiv.innerHTML='<h2>Weekly Tasks</h2>';

  streams.forEach((s,i)=>{
    const div = document.createElement('div');
    div.className='stream';
    div.innerHTML=`<span>${s.name}</span><input type="number" data-id="${i}" value="${s.earned}"> / ₹${s.target.toLocaleString()}`;
    streamsDiv.appendChild(div);
  });
  streamsDiv.querySelectorAll('input[type=number]').forEach(inp=>{
    inp.addEventListener('input', e=>{
      const id = e.target.dataset.id;
      streams[id].earned = Number(e.target.value)||0;
      saveStreams();
      updateProgressBar('weeklyProgressBar', calcProgress(streams.map(s=>({done:s.earned>=s.target}))));
    });
  });

  weeklyTasks.forEach((t,i)=>{
    const div = document.createElement('div');
    div.className='task';
    div.innerHTML=`<label><input type="checkbox" data-id="${i}" ${t.done?'checked':''}> ${t.name}</label>`;
    tasksDiv.appendChild(div);
  });
  tasksDiv.querySelectorAll('input[type=checkbox]').forEach(cb=>{
    cb.addEventListener('change', e=>{
      const id = e.target.dataset.id;
      weeklyTasks[id].done = e.target.checked;
      saveWeeklyTasks();
      updateProgressBar('weeklyProgressBar', calcProgress(weeklyTasks));
    });
  });

  updateProgressBar('weeklyProgressBar', (calcProgress(weeklyTasks)+calcProgress(streams.map(s=>({done:s.earned>=s.target}))))/2 );
}

// --- CHARTS ---
function renderOverallChart(){
  const ctx = document.getElementById('overallChart');
  if(!ctx) return;
  new Chart(ctx.getContext('2d'),{
    type:'bar',
    data:{
      labels:['Goal','Achieved'],
      datasets:[{
        label:'Amount (₹)',
        data:[100000, streams.reduce((a,b)=>a+b.earned,0)],
        backgroundColor:['#b03060','#800020']
      }]
    },
    options:{ responsive:true, plugins:{ legend:{display:false} }, scales:{y:{beginAtZero:true}} }
  });
}

function renderStreamPie(){
  const ctx = document.getElementById('streamPie');
  if(!ctx) return;
  new Chart(ctx.getContext('2d'),{
    type:'pie',
    data:{
      labels: streams.map(s=>s.name),
      datasets:[{
        data: streams.map(s=>s.earned),
        backgroundColor:['#800020','#b03060','#a02040','#a8325b']
      }]
    },
    options:{ responsive:true, plugins:{ legend:{position:'bottom'} } }
  });
}

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', ()=>{
  renderDailyTasks();
  renderWeeklyStreamsTasks();
  renderOverallChart();
  renderStreamPie();
});
