// Microservices v2 frontend (uses static JSON in api/)
async function loadGrid(){
  try{
    const res = await fetch('api/shipments.json');
    const arr = await res.json();
    const grid = document.getElementById('grid');
    grid.innerHTML='';
    arr.slice().reverse().forEach(s=>{
      const card = document.createElement('div'); card.className='card';
      card.innerHTML = `<h4>${s.id} — ${s.name}</h4><div class="meta">From: ${s.from} • To: ${s.to}</div><div style="margin-top:8px">Status: <strong>${s.status}</strong></div>`;
      grid.appendChild(card);
    });
  }catch(e){
    document.getElementById('grid').innerHTML = '<div style="padding:12px">Unable to load shipments. Run via an HTTP server.</div>';
  }
}

document.getElementById('openTrack').addEventListener('click', ()=> document.getElementById('trackModal').setAttribute('aria-hidden','false'));
document.getElementById('closeTrack').addEventListener('click', ()=> document.getElementById('trackModal').setAttribute('aria-hidden','true'));
document.getElementById('openCreate').addEventListener('click', ()=> document.getElementById('createModal').setAttribute('aria-hidden','false'));
document.getElementById('closeCreate').addEventListener('click', ()=> document.getElementById('createModal').setAttribute('aria-hidden','true'));

document.getElementById('goTrack').addEventListener('click', async ()=>{
  const id = document.getElementById('tid').value.trim();
  try{
    const res = await fetch('api/shipments.json');
    const arr = await res.json();
    const f = arr.find(x=>x.id===id);
    document.getElementById('tres').textContent = f ? `${f.id} — ${f.status} (From ${f.from} to ${f.to})` : 'Not found';
  }catch(e){
    document.getElementById('tres').textContent = 'Tracking service unavailable.';
  }
});

document.getElementById('createForm').addEventListener('submit', e=>{
  e.preventDefault();
  document.getElementById('cres').textContent = 'Simulated create — frontend only (use POST to real service)';
  e.target.reset();
});

loadGrid();