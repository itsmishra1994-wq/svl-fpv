
let svlTargets = [];

function showTab(tab){
  document.getElementById('svl').classList.remove('active');
  document.getElementById('fpv').classList.remove('active');
  document.getElementById(tab).classList.add('active');
  document.getElementById('svlBtn').classList.remove('active');
  document.getElementById('fpvBtn').classList.remove('active');
  document.getElementById(tab+'Btn').classList.add('active');
}

function addTarget(){
  let lat = document.getElementById('svl_lat').value;
  let lng = document.getElementById('svl_lng').value;
  let file = document.getElementById('svl_img').files[0];
  if(!lat || !lng || !file) return;

  let reader = new FileReader();
  reader.onload = function(e){
    svlTargets.push({lat, lng, img:e.target.result});
    renderSVL();
  }
  reader.readAsDataURL(file);
}

function renderSVL(){
  let ul = document.getElementById('svl_list');
  ul.innerHTML='';
  svlTargets.forEach(t=>{
    let li=document.createElement('li');
    li.innerHTML = t.lat+', '+t.lng;
    ul.appendChild(li);
  });
}

function exportSVL(){
  let data = { targets: svlTargets };
  let blob = new Blob([JSON.stringify(data)], {type:'application/json'});
  let url = URL.createObjectURL(blob);
  let a = document.createElement('a');
  a.href = url; a.download = 'mission.json'; a.click();
}

function getGPS(){
  navigator.geolocation.getCurrentPosition(pos=>{
    document.getElementById('fpv_lat').value = pos.coords.latitude;
    document.getElementById('fpv_lng').value = pos.coords.longitude;
  });
}

function importFPV(){
  let file = document.getElementById('fpv_json').files[0];
  if(!file) return;
  let reader = new FileReader();
  reader.onload = e=>{
    let data = JSON.parse(e.target.result);
    renderFPV(data.targets);
  }
  reader.readAsText(file);
}

function renderFPV(targets){
  let lat0 = parseFloat(document.getElementById('fpv_lat').value);
  let lng0 = parseFloat(document.getElementById('fpv_lng').value);
  let table=document.getElementById('fpv_table');
  table.innerHTML='<tr><th>Image</th><th>Lat</th><th>Lng</th><th>Dist (m)</th><th>Bearing</th></tr>';

  targets.forEach(t=>{
    let d = computeDistance(lat0,lng0, t.lat,t.lng);
    let b = bearing(lat0,lng0, t.lat,t.lng);
    let row = `<tr>
      <td><img src="${t.img}"></td>
      <td>${t.lat}</td>
      <td>${t.lng}</td>
      <td>${d.toFixed(1)}</td>
      <td>${b.toFixed(1)}°</td>
    </tr>`;
    table.innerHTML += row;
  });
}

function computeDistance(lat1,lon1,lat2,lon2){
  let R=6371000;
  let dLat=(lat2-lat1)*Math.PI/180;
  let dLon=(lon2-lon1)*Math.PI/180;
  let a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return 2*R*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function bearing(lat1,lon1,lat2,lon2){
  let y=Math.sin((lon2-lon1)*Math.PI/180)*Math.cos(lat2*Math.PI/180);
  let x=Math.cos(lat1*Math.PI/180)*Math.sin(lat2*Math.PI/180)-Math.sin(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.cos((lon2-lon1)*Math.PI/180);
  return (Math.atan2(y,x)*180/Math.PI+360)%360;
}
