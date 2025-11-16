let targets = [];

function showTab(id) {
  document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function addTarget() {
  const lat = document.getElementById('t_lat').value;
  const lng = document.getElementById('t_lng').value;
  if(lat && lng){
    targets.push({lat, lng});
    renderTargets();
  }
}

function renderTargets(){
  const ul = document.getElementById('target_list');
  ul.innerHTML = '';
  targets.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t.lat + ', ' + t.lng;
    ul.appendChild(li);
  });
}

function importJSON() {
  const file = document.getElementById('jsonFile').files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const data = JSON.parse(e.target.result);
    targets = data.targets || [];
    renderTargets();
  };
  reader.readAsText(file);
}

function exportJSON() {
  const data = { targets };
  const blob = new Blob([JSON.stringify(data)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'fpv_data.json';
  a.click();
  URL.revokeObjectURL(url);
}

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js');
}
