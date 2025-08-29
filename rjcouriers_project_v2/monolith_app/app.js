// Monolith v2 behavior (localStorage)
const sections = document.querySelectorAll('.panel');
const navBtns = document.querySelectorAll('.sidebar button');
const pageTitle = document.getElementById('pageTitle');

navBtns.forEach(b=>b.addEventListener('click', ()=> {
  navBtns.forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  const s = b.dataset.section;
  sections.forEach(p=>p.classList.remove('show'));
  document.getElementById(s).classList.add('show');
  pageTitle.textContent = b.textContent;
}));

const STORAGE='rj_shipments_v2';
function load(){ return JSON.parse(localStorage.getItem(STORAGE)||'[]') }
function save(arr){ localStorage.setItem(STORAGE, JSON.stringify(arr)) }

function renderCards(){
  const cards = document.getElementById('cards');
  cards.innerHTML='';
  const arr = load().slice().reverse();
  if(arr.length===0){ cards.innerHTML='<div class="card">No shipments yet — create one!</div>'; return; }
  arr.slice(0,8).forEach(s=>{
    const div = document.createElement('div'); div.className='card';
    div.innerHTML = `<h4>${s.id} — ${s.name}</h4><div>From: ${s.from}</div><div>To: ${s.to}</div><div>Weight: ${s.weight}kg</div><div>Status: ${s.status}</div>`;
    cards.appendChild(div);
  });
}

document.getElementById('createForm').addEventListener('submit', e=>{
  e.preventDefault();
  const f = e.target; const name=f.name.value, from=f.from.value, to=f.to.value, weight=f.weight.value;
  const id = 'RJ'+Math.floor(Math.random()*900000+100000);
  const ship = {id,name,from,to,weight,created:new Date().toISOString(),status:'Created'};
  const arr = load(); arr.push(ship); save(arr);
  document.getElementById('createMsg').textContent = 'Created '+id;
  renderCards();
  f.reset();
});

// Quick create modal
const modal = document.getElementById('modal');
document.getElementById('openCreate').addEventListener('click', ()=>{ modal.setAttribute('aria-hidden','false'); });
document.getElementById('closeModal').addEventListener('click', ()=>{ modal.setAttribute('aria-hidden','true'); });
document.getElementById('modalForm').addEventListener('submit', e=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  const name = fd.get('name'), from = fd.get('from'), to = fd.get('to'), weight = fd.get('weight');
  const id = 'RJ'+Math.floor(Math.random()*900000+100000);
  const ship = {id,name,from,to,weight,created:new Date().toISOString(),status:'Created'};
  const arr = load(); arr.push(ship); save(arr);
  document.getElementById('modalMsg').textContent = 'Created '+id;
  renderCards();
  e.target.reset();
  setTimeout(()=> modal.setAttribute('aria-hidden','true'), 800);
});

document.getElementById('doTrack').addEventListener('click', ()=>{
  const id = document.getElementById('trackId').value.trim(); const arr = load();
  const found = arr.find(x=>x.id===id);
  document.getElementById('trackResult').textContent = found ? `${found.id} — ${found.status} (From ${found.from} to ${found.to})` : 'Not found';
});

document.getElementById('calcPrice').addEventListener('click', ()=>{
  const d = parseFloat(document.getElementById('dist').value)||0;
  const w = parseFloat(document.getElementById('pweight').value)||0;
  const price = 50 + (5*d) + (20*w);
  document.getElementById('priceResult').textContent = 'Estimated ₹'+price.toFixed(2);
});

document.getElementById('adminLogin').addEventListener('click', ()=>{
  if(document.getElementById('adminPass').value==='admin123'){
    const arr = load(); const table = document.getElementById('allShipments'); table.innerHTML='';
    const head = document.createElement('tr'); head.innerHTML='<th>ID</th><th>Name</th><th>From</th><th>To</th><th>Weight</th><th>Status</th>'; table.appendChild(head);
    arr.slice().reverse().forEach(s=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${s.id}</td><td>${s.name}</td><td>${s.from}</td><td>${s.to}</td><td>${s.weight}</td><td>${s.status}</td>`; table.appendChild(tr); });
    document.getElementById('adminArea').style.display='block';
  } else alert('Wrong password');
});

renderCards();
