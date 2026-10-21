import * as THREE from 'three';
import { OrbitControls } from '../../vendor/OrbitControls.js';
const $ = id => document.getElementById(id);
const host = $('view');
const labels = {'sofa':'沙发','dining-table':'餐桌','coffee-table':'茶几'};
let current = 'adjusted';
function footprint(item, scale = item.scale) {
  const [w,,d] = item.asset.dimensions;
  return {x:item.position[0],z:item.position[2],w:w*scale[0],d:d*scale[2]};
}
function separation(a,b) {
  const x = Math.max(0, Math.abs(a.x-b.x)-(a.w+b.w)/2);
  const z = Math.max(0, Math.abs(a.z-b.z)-(a.d+b.d)/2);
  return Math.hypot(x,z);
}
try {
  const response = await fetch('scene-data.json');
  if (!response.ok) throw new Error('场景数据未能载入。');
  const data = await response.json();
  const items = data.nodes.filter(n=>n.type==='item');
  const coffee = items.find(n=>n.asset.id==='coffee-table');
  if(items.some(n=>n.rotation.some(v=>v!==0))) throw new Error('当前展示只支持原场景中未旋转的家具。');
  const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;
  host.append(renderer.domElement);
  const scene = new THREE.Scene();scene.background=new THREE.Color('#eeeae1');
  const camera=new THREE.PerspectiveCamera(39,1,.1,100);
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=5;controls.maxDistance=16;controls.maxPolarAngle=Math.PI/2-.04;controls.target.set(0,.5,0);
  scene.add(new THREE.HemisphereLight(0xfffaf0,0xb1ada0,2.6));
  const sun=new THREE.DirectionalLight(0xfff6e5,3.3);sun.position.set(3,8,5);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-5;sun.shadow.camera.right=5;sun.shadow.camera.top=5;sun.shadow.camera.bottom=-5;scene.add(sun);
  const room=new THREE.Group();scene.add(room);
  function box(w,h,d,x,y,z,color,parent=room){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,roughness:.82}));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
  box(4,.12,5,0,-.06,0,0xd7c9ac);
  // Cutaway: retain two original walls and the original window opening.
  const back=data.nodes.find(n=>n.type==='wall'&&n.start[1]===-2.5&&n.end[1]===-2.5);
  const win=data.nodes.find(n=>n.type==='window');const sill=win.position[1]-win.height/2;
  box(4,sill,back.thickness,0,sill/2,-2.5,0xe1e0d5);
  box(4,back.height-(sill+win.height),back.thickness,0,(back.height+sill+win.height)/2,-2.5,0xe1e0d5);
  box(1,win.height,back.thickness,-1.5,win.position[1],-2.5,0xe1e0d5);box(1,win.height,back.thickness,1.5,win.position[1],-2.5,0xe1e0d5);
  box(.15,2.8,5,-2,1.4,0,0xd6d9ca);
  box(2.08,.07,.23,0,sill,-2.45,0xf3eee3);box(.045,1.4,.1,0,1.6,-2.5,0xb1b4a5);
  const glass=box(2,1.4,.025,0,1.6,-2.51,0xc1d6d4);glass.material.transparent=true;glass.material.opacity=.32;glass.castShadow=false;
  const groups=new Map();
  for(const item of items){
    const group=new THREE.Group();room.add(group);group.position.fromArray(item.position);groups.set(item.asset.id,group);
    const [w,h,d]=item.asset.dimensions;
    if(item.asset.id==='sofa'){
      box(w,.32,d,0,.27,0,0x7d8c72,group);box(w,.48,.24,0,.56,-d/2+.12,0x6e7c64,group);
      box(.18,.5,d,-w/2+.09,.5,0,0x6e7c64,group);box(.18,.5,d,w/2-.09,.5,0,0x6e7c64,group);
      for(const x of [-.57,.57])box(1.05,.1,1.16,x,.48,.06,0x929d83,group);
    }else{
      box(w,.09,d,0,h-.045,0,item.asset.id==='coffee-table'?0xb78259:0xe4cfaa,group);
      for(const x of [-w/2+.13,w/2-.13])for(const z of [-d/2+.13,d/2-.13])box(.085,h-.09,.085,x,(h-.09)/2,z,0x8b7860,group);
    }
    group.scale.fromArray(item.scale);
  }
  // The door is on the removed front wall; show its original opening width as a threshold.
  box(.9,.025,.18,1.2,.015,2.5,0x9a9878);
  function line(points,color=0x8c9584){const g=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));const l=new THREE.Line(g,new THREE.LineBasicMaterial({color}));room.add(l);}
  line([[-2,.03,2.95],[2,.03,2.95]]);for(const x of [-2,2])line([[x,.03,2.83],[x,.03,3.07]]);
  line([[-2.45,.03,-2.5],[-2.45,.03,2.5]]);for(const z of [-2.5,2.5])line([[-2.57,.03,z],[-2.33,.03,z]]);
  function label(text,x,y,z){const c=document.createElement('canvas');c.width=512;c.height=96;const ctx=c.getContext('2d');ctx.font='36px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#53634f';ctx.fillText(text,256,48);const texture=new THREE.CanvasTexture(c);const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthTest:false}));sprite.position.set(x,y,z);sprite.scale.set(2,.375,1);room.add(sprite);}
  label('4.00 m',0,.06,3.13);label('5.00 m',-2.7,.06,0);label('沙发 2.5 × 1.5 m',-.4,1.03,-1.5);label('餐桌 2.5 × 1.0 m',-.4,1.03,1.3);
  function plan(scale){
    const parts=['<rect x="54" y="40" width="192" height="240" fill="#e1d7bf" stroke="#8b9582" stroke-width="4"/><path d="M102 40h96" stroke="#a9c9ca" stroke-width="5"/><path d="M186 280h43.2" stroke="#f3f0dd" stroke-width="5"/>'];
    for(const item of items){const f=footprint(item,item===coffee?scale:item.scale);const x=150+(f.x-f.w/2)*48,y=160+(f.z-f.d/2)*48;parts.push(`<rect x="${x}" y="${y}" width="${f.w*48}" height="${f.d*48}" rx="3" fill="${item===coffee?'#bc8c64':item.asset.id==='sofa'?'#859277':'#c4b391'}"/><text x="${150+f.x*48}" y="${160+f.z*48+4}" text-anchor="middle" fill="#fffef2" font-size="11">${labels[item.asset.id]}</text>`);}
    parts.push('<text x="150" y="22" text-anchor="middle" font-size="12" fill="#64725a">4.00 m</text><text x="150" y="307" text-anchor="middle" font-size="11" fill="#64725a">平面尺寸 · 房间进深 5.00 m</text>');$('plan').innerHTML=parts.join('');
  }
  function setVariant(name){
    current=name;const scale=data.coffeeTableVariants[name].scale;groups.get('coffee-table').scale.fromArray(scale);const f=footprint(coffee,scale);
    const clearances=items.filter(i=>i!==coffee).map(i=>({name:labels[i.asset.id],meters:separation(f,footprint(i))}));const issues=clearances.filter(c=>c.meters<.3-1e-9).length;
    $('size').innerHTML=`${f.w.toFixed(1)} × ${f.d.toFixed(1)} <small>m</small>`;$('issues').innerHTML=`${issues} <small>处</small>`;$('issues').className=issues?'bad':'good';
    $('clearance').replaceChildren(...clearances.map(c=>{const row=document.createElement('div');row.className='row';const name=document.createElement('span');name.textContent='距'+c.name;const value=document.createElement('b');value.textContent=(c.meters*100).toFixed(1)+' cm';row.append(name,value);return row;}));
    for(const id of ['initial','adjusted'])$(id).setAttribute('aria-pressed',String(id===name));plan(scale);
    window.roomEvidence={ready:true,variant:name,tableDimensions:[f.w,f.d],clearances,issueCount:issues,measurement:'Axis-aligned 2D rectangle separation for coffee table vs sofa and dining table only.'};
  }
  function setView(top=false){camera.position.set(top?.01:7,top?10:6.6,top?.01:8);controls.target.set(0,top?0:.45,0);controls.update();}
  $('initial').onclick=()=>setVariant('initial');$('adjusted').onclick=()=>setVariant('adjusted');$('top').onclick=()=>setView(true);$('orbit').onclick=()=>setView();$('reset').onclick=()=>setView();
  function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}
  new ResizeObserver(resize).observe(host);resize();setView();setVariant(current);
  renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera);});
}catch(error){$('error').hidden=false;$('error').textContent='展示载入失败：'+error.message;console.error(error);}
