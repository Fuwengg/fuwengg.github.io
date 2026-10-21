import * as THREE from 'three';

export function initializeWorld({reduced=false,onOpen}={}){
  const canvas=document.querySelector('#world-canvas');
  const labels=document.querySelector('#world-labels');
  const preview=document.querySelector('.world-preview');
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene();
  const camera=new THREE.OrthographicCamera(-1,1,1,-1,.1,100);
  const atlas=document.createElement('canvas');
  atlas.width=512;atlas.height=192;
  const painter=atlas.getContext('2d');
  const alphabet='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .';
  painter.fillStyle='white';painter.font='40px monospace';painter.textAlign='center';painter.textBaseline='middle';
  for(let i=0;i<64;i++)painter.fillText(alphabet[i],i%16*32+16,Math.floor(i/16)*48+25);
  const atlasTexture=new THREE.CanvasTexture(atlas);
  atlasTexture.flipY=false;atlasTexture.minFilter=THREE.LinearFilter;atlasTexture.magFilter=THREE.LinearFilter;
  let width=1,height=1,mobile=false,progress=0,time=0,reduceMotion=reduced,visible=true;
  let dragging=false,lastX=0,lastY=0,rotation=.12,rotationTarget=.12,tilt=.12,tiltTarget=.12,lastFrame=0;
  const pointer=new THREE.Vector2(5,5);
  const uniforms={uAtlas:{value:atlasTexture},uTime:{value:0},uMorph:{value:0},uOpacity:{value:1},uCell:{value:new THREE.Vector2()},uAspect:{value:1},uPointer:{value:pointer},uRotation:{value:0},uTilt:{value:.12},uOrigin:{value:new THREE.Vector3()},uScale:{value:1},uHaloOpacity:{value:0},uHaloRows:{value:3}};
  const fieldMaterial=new THREE.ShaderMaterial({
    transparent:true,depthTest:false,depthWrite:false,uniforms,
    vertexShader:`
      attribute vec2 aOffset;
      attribute vec3 aSphere;
      attribute float aSeed,aGlyph;
      uniform float uTime,uMorph,uOpacity,uAspect,uRotation,uTilt,uScale;
      uniform vec2 uCell,uPointer;
      uniform vec3 uOrigin;
      varying vec2 vUv;
      varying float vGlyph,vAlpha,vBlue;
      vec3 lens(vec2 point,vec2 origin,float radius,float gain,float phase){
        vec2 delta=point-origin;
        delta.x*=uAspect;
        float angle=atan(delta.y,delta.x);
        float contour=1.0+.11*sin(angle*3.0+uTime*.62+phase)+.065*cos(angle*5.0-uTime*.43);
        float distance=length(delta)/(radius*contour);
        float weight=1.0-smoothstep(.02,1.0,distance);
        // A moving lens expands the central glyphs and bends their neighbours.
        vec2 push=delta*weight*gain;
        push.x/=uAspect;
        return vec3(push,weight);
      }
      void main(){
        vUv=uv;
        float t=uTime;
        float lane=aOffset.y*13.0;
        float velocity=.025+.042*sin(lane*1.7)+.019*cos(lane*.47);
        vec2 flow=aOffset;
        flow.x=mod(flow.x+t*velocity+1.16,2.32)-1.16;
        flow.y+=.035*sin(flow.x*4.0+t*.65+lane*.20)
               +.018*cos(flow.x*8.0-t*.43+lane*.11);
        flow.x+=.024*sin(flow.y*6.0+t*.51);
        vec2 wanderA=vec2(.64*sin(t*.31)+.13*sin(t*.73),.50*cos(t*.27)+.14*sin(t*.61));
        vec2 wanderB=vec2(.69*cos(t*.23+2.2),.58*sin(t*.29+3.2));
        vec3 glassA=lens(flow,wanderA,.60,1.55,0.0);
        vec3 glassB=lens(flow,wanderB,.46,1.15,2.3);
        vec3 mouseGlass=lens(flow,uPointer,.43,1.65,1.0);
        float magnify=max(glassA.z,max(glassB.z,mouseGlass.z));
        vec2 fieldPosition=flow+glassA.xy+glassB.xy+mouseGlass.xy;
        vec3 sphere=aSphere;
        sphere.xz=mat2(cos(uRotation),-sin(uRotation),sin(uRotation),cos(uRotation))*sphere.xz;
        sphere.yz=mat2(cos(uTilt),-sin(uTilt),sin(uTilt),cos(uTilt))*sphere.yz;
        vec4 target=projectionMatrix*modelViewMatrix*vec4(sphere*5.4*uScale+uOrigin,1.0);
        vec2 center=mix(fieldPosition,target.xy/target.w,uMorph);
        float depthScale=1.0;
        float enlargement=1.0+2.8*pow(magnify,1.65);
        vec2 size=uCell*mix(enlargement,depthScale*.58,uMorph);
        gl_Position=vec4(center+position.xy*size,0.0,1.0);
        float front=smoothstep(-.3,.8,sphere.z);
        float band=.5+.5*sin(flow.x*5.4+flow.y*3.2-t*.48+sin(flow.y*6.0+t*.33));
        float cloud=.5+.5*cos(flow.y*7.0-flow.x*3.0+t*.56);
        float shade=.07+.20*band+.09*cloud;
        float alpha=shade+pow(magnify,1.1)*.48;
        vAlpha=mix(alpha,front*.44,uMorph)*uOpacity*smoothstep(.02,.32,uMorph);
        vAlpha*=mix((1.0-smoothstep(.86,1.13,abs(flow.y))),1.0,uMorph);
        vGlyph=52.0+mod(aGlyph-52.0+floor(t*(.35+aSeed*.70)),10.0);
        vBlue=mouseGlass.z*.42*(1.0-uMorph);
      }`,
    fragmentShader:`
      uniform sampler2D uAtlas;
      varying vec2 vUv;
      varying float vGlyph,vAlpha,vBlue;
      void main(){
        vec2 tile=vec2(mod(floor(vGlyph),16.0),floor(vGlyph/16.0));
        vec2 atlasUv=(tile+vec2(vUv.x,1.0-vUv.y))/vec2(16.0,4.0);
        float ink=texture2D(uAtlas,atlasUv).a;
        if(ink<.02)discard;
        vec3 color=mix(vec3(.1),vec3(.14,.29,.96),vBlue);
        gl_FragColor=vec4(color,ink*vAlpha);
      }`
  });
  const field=new THREE.Mesh(new THREE.InstancedBufferGeometry(),fieldMaterial);
  field.frustumCulled=false;field.renderOrder=8;scene.add(field);
  // Sample the whole digital surface through inverse lenses: glyphs bend and
  // enlarge coherently, without overlapping at the lens boundary.
  const flowMaterial=new THREE.ShaderMaterial({
    uniforms,transparent:true,depthTest:false,depthWrite:false,
    vertexShader:`varying vec2 vScreen;void main(){vScreen=uv;gl_Position=vec4(position.xy,0.0,1.0);}`,
    fragmentShader:`
      uniform sampler2D uAtlas;
      uniform float uTime,uMorph,uAspect;
      uniform vec2 uCell,uPointer;
      varying vec2 vScreen;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      vec3 refractField(vec2 point,vec2 origin,float radius,float magnification,float phase){
        vec2 delta=point-origin;delta.x*=uAspect;
        float angle=atan(delta.y,delta.x);
        float contour=1.0+.12*sin(angle*3.0+uTime*.62+phase)+.07*cos(angle*5.0-uTime*.43);
        float weight=1.0-smoothstep(.06,1.0,length(delta)/(radius*contour));
        vec2 pull=delta*(1.0-1.0/magnification)*weight;
        pull.x/=uAspect;
        return vec3(pull,weight);
      }
      void main(){
        float t=uTime;
        vec2 screen=vScreen*2.0-1.0;
        vec2 wanderA=vec2(.64*sin(t*.31)+.13*sin(t*.73),.50*cos(t*.27)+.14*sin(t*.61));
        vec2 wanderB=vec2(.69*cos(t*.23+2.2),.58*sin(t*.29+3.2));
        vec3 glassA=refractField(screen,wanderA,.63,3.8,0.0);
        vec3 glassB=refractField(screen,wanderB,.49,3.0,2.3);
        vec3 mouseGlass=refractField(screen,uPointer,.46,3.7,1.0);
        vec2 flow=screen-glassA.xy-glassB.xy-mouseGlass.xy;
        flow.y+=.025*sin(flow.x*4.0+t*.65)+.012*cos(flow.x*8.0-t*.43);
        float row=floor(flow.y/uCell.y);
        float lane=hash(vec2(row,7.0));
        flow.x+=t*(.026+(lane-.5)*.115)+.025*sin(flow.y*6.0+t*.51);
        vec2 grid=flow/uCell;
        vec2 cell=floor(grid);
        vec2 glyphUv=fract(grid);
        float seed=hash(cell);
        float digit=mod(floor(seed*10.0)+floor(t*(.35+seed*.7)),10.0)+52.0;
        vec2 tile=vec2(mod(digit,16.0),floor(digit/16.0));
        float ink=texture2D(uAtlas,(tile+vec2(glyphUv.x,1.0-glyphUv.y))/vec2(16.0,4.0)).a;
        float magnify=max(glassA.z,max(glassB.z,mouseGlass.z));
        float band=.5+.5*sin(screen.x*5.4+screen.y*3.2-t*.48+sin(screen.y*6.0+t*.33));
        float cloud=.5+.5*cos(screen.y*7.0-screen.x*3.0+t*.56);
        float alpha=.06+.19*band+.055*cloud+.32*pow(magnify,1.4);
        alpha*=1.0-smoothstep(.85,1.08,abs(screen.y))*.6;
        alpha*=1.0-smoothstep(.02,.75,uMorph);
        vec3 color=mix(vec3(.11),vec3(.14,.29,.96),mouseGlass.z*.25);
        gl_FragColor=vec4(color,ink*alpha);
      }`
  });
  const flowScreen=new THREE.Mesh(new THREE.PlaneGeometry(2,2),flowMaterial);
  flowScreen.frustumCulled=false;flowScreen.renderOrder=-5;scene.add(flowScreen);
  const haloMaterial=new THREE.ShaderMaterial({
    uniforms,transparent:true,depthTest:false,depthWrite:false,
    vertexShader:`varying vec2 vScreen;void main(){vScreen=uv;gl_Position=vec4(position.xy,0.0,1.0);}`,
    fragmentShader:`
      uniform sampler2D uAtlas;
      uniform float uTime,uAspect,uScale,uHaloOpacity,uHaloRows;
      uniform vec3 uOrigin;
      varying vec2 vScreen;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      void main(){
        vec2 center=vec2(uOrigin.x/(10.0*uAspect),uOrigin.y/10.0);
        vec2 p=(vScreen*2.0-1.0-center)*vec2(uAspect,1.0);
        float radius=5.4*uScale/10.0;
        float radial=length(p)/radius;
        if(radial<1.018||radial>1.126)discard;
        float lane=(radial-1.018)/.108*uHaloRows;
        float row=floor(lane);
        float stepSize=.108/uHaloRows;
        float cells=floor(6.2831853*(1.018+(row+.5)*stepSize)/(stepSize*.64));
        float angle=atan(p.y,p.x);
        float direction=mod(row,2.0)<.5?1.0:-1.0;
        float speed=direction*(8.0+row*4.3);
        float along=(angle/6.2831853+.5)*cells+uTime*speed;
        float index=floor(along);
        float seed=hash(vec2(index,row+11.0));
        float digit=52.0+mod(floor(seed*10.0)+floor(uTime*.8+seed),10.0);
        vec2 tile=vec2(mod(digit,16.0),floor(digit/16.0));
        vec2 uv=vec2(fract(along),1.0-fract(lane));
        float ink=texture2D(uAtlas,(tile+uv)/vec2(16.0,4.0)).a;
        float signal=.60+.40*sin(angle*3.0-uTime*.55+row*1.8);
        float gaps=step(.16,hash(vec2(floor(index/7.0),row)));
        float alpha=(.56-row*.10)*signal*gaps*uHaloOpacity;
        float blue=mod(row,2.0)*.9+step(.91,seed)*.10;
        gl_FragColor=vec4(mix(vec3(.17),vec3(.13,.29,.95),blue),ink*alpha);
      }`
  });
  const halo=new THREE.Mesh(new THREE.PlaneGeometry(2,2),haloMaterial);
  halo.frustumCulled=false;halo.renderOrder=10;scene.add(halo);


  function buildField(){
    const cellX=mobile?8:8.2,cellY=mobile?13.5:17;
    const columns=Math.ceil(width/cellX*1.16),rows=Math.ceil(height/cellY*1.12),count=columns*rows;
    const offsets=new Float32Array(count*2),spheres=new Float32Array(count*3),seeds=new Float32Array(count),glyphs=new Float32Array(count);
    for(let i=0;i<count;i++){
      const x=i%columns,y=Math.floor(i/columns),hash=((Math.sin(i*127.1+7.7)*43758.5453)%1+1)%1;
      offsets[i*2]=-1.16+(x+.5)/columns*2.32;offsets[i*2+1]=1.12-(y+.5)/rows*2.24;
      const phi=Math.acos(1-2*(i+.5)/count),theta=i*Math.PI*(3-Math.sqrt(5));
      spheres[i*3]=Math.cos(theta)*Math.sin(phi);spheres[i*3+1]=Math.cos(phi);spheres[i*3+2]=Math.sin(theta)*Math.sin(phi);
      seeds[i]=hash;glyphs[i]=52+Math.floor(hash*10);
    }
    const geometry=new THREE.InstancedBufferGeometry().copy(new THREE.PlaneGeometry(1,1));
    geometry.setAttribute('aOffset',new THREE.InstancedBufferAttribute(offsets,2));geometry.setAttribute('aSphere',new THREE.InstancedBufferAttribute(spheres,3));geometry.setAttribute('aSeed',new THREE.InstancedBufferAttribute(seeds,1));geometry.setAttribute('aGlyph',new THREE.InstancedBufferAttribute(glyphs,1));geometry.instanceCount=count;
    field.geometry.dispose();field.geometry=geometry;uniforms.uCell.value.set(2.32/columns,2.24/rows);canvas.dataset.characterCount=String(count);
  }

  const globe=new THREE.Group();scene.add(globe);
  const radius=5.4;
  function surface(lat,lon,extra=0){const r=radius+extra;return new THREE.Vector3(Math.cos(lat)*Math.sin(lon)*r,Math.sin(lat)*r,Math.cos(lat)*Math.cos(lon)*r);}
  const skinGeometry=new THREE.SphereGeometry(radius-.006,120,80);
  const skinMaterial=new THREE.MeshBasicMaterial({color:0xfcfcfc,transparent:true,opacity:0,depthWrite:true});
  const skin=new THREE.Mesh(skinGeometry,skinMaterial);globe.add(skin);
  const inkMaterial=new THREE.LineBasicMaterial({color:0x393b3f,transparent:true,opacity:0});
  const thinMaterial=new THREE.LineBasicMaterial({color:0x77797d,transparent:true,opacity:0});
  const inkPositions=[];
  for(let j=1;j<95;j++){const lat=-Math.PI/2+j/95*Math.PI;for(let i=0;i<360;i++){const a=surface(lat,i/360*Math.PI*2),b=surface(lat,(i+1)/360*Math.PI*2);inkPositions.push(a.x,a.y,a.z,b.x,b.y,b.z);}}
  globe.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(inkPositions,3)),inkMaterial));
  const meridians=[];
  for(let j=0;j<34;j++){const lon=j/34*Math.PI*2;for(let i=0;i<180;i++){const a=surface(-Math.PI/2+i/180*Math.PI,lon,.003),b=surface(-Math.PI/2+(i+1)/180*Math.PI,lon,.003);meridians.push(a.x,a.y,a.z,b.x,b.y,b.z);}}
  globe.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(meridians,3)),thinMaterial));
  const orbitMaterial=new THREE.LineBasicMaterial({color:0x476af2,transparent:true,opacity:0});
  for(const [r,angle,tiltAngle]of [[5.64,.17,.85],[5.88,-.2,-.65]]){const pts=[];for(let i=0;i<320;i++){const a=i/320*Math.PI*2;pts.push(new THREE.Vector3(Math.cos(a)*r,Math.sin(a)*r,0));}const ring=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts),orbitMaterial);ring.rotation.set(tiltAngle,.2,angle);globe.add(ring);}
  const items=[
    {id:'taohuayuan',label:'AI 影像',title:'桃花源记',kind:'01 / MOTION PICTURE',image:'taohuayuan-poster.jpg',lat:.30,lon:.70},
    {id:'bailongma',label:'电商全案',title:'百龙玛 · 从店铺到商品',kind:'02 / E-COMMERCE',image:'shop/38151b8bbb915ed7.webp',lat:-.08,lon:-.56},
    {id:'heart',label:'智能体系统',title:'Codex Heart',kind:'03 / AGENT SYSTEM',image:'codex-heart.webp',lat:.65,lon:-.2},
    {id:'shotweaver',label:'Unity 产品',title:'ShotWeaver',kind:'04 / UNITY TOOLS',image:'archive/unity-shotweaver.webp',lat:-.27,lon:.58},
    {id:'headphones',label:'3D 交互',title:'耳机互动展示',kind:'05 / INTERACTIVE 3D',image:'archive/demo-headphones.webp',lat:.14,lon:-1.13},
    {id:'music-goodnight',label:'音乐创作',title:'晚安留在我这边',kind:'06 / MUSIC',image:'archive/music-goodnight.webp',lat:-.6,lon:-.15}
  ];
  const dotMaterial=new THREE.MeshBasicMaterial({color:0x3762ff,transparent:true,opacity:0});
  let selected=items[0],nodeHover=false;
  function select(item){selected=item;preview.querySelector('.world-preview-image').hidden=!item.image;if(item.image)preview.querySelector('img').src=`assets/${item.image}`;preview.querySelector('img').alt=item.title;preview.querySelector('.world-preview-kind').textContent=item.kind;preview.querySelector('.world-preview-name').textContent=item.title;preview.setAttribute('aria-label',`查看${item.title}项目`);for(const node of nodes)node.label.classList.toggle('active',node.item===item);}
  const nodes=items.map((item,i)=>{const point=surface(item.lat,item.lon,.045);const marker=new THREE.Mesh(new THREE.SphereGeometry(.044,12,8),dotMaterial);marker.position.copy(point);marker.visible=false;globe.add(marker);const label=document.createElement('button');label.className='world-label';label.innerHTML=`${item.label}<span>${String(i+1).padStart(2,'0')} ↗</span>`;label.setAttribute('aria-label',`查看${item.label}项目`);label.addEventListener('pointerenter',()=>{nodeHover=true;rotationTarget=rotation;select(item);});label.addEventListener('pointerleave',()=>nodeHover=false);label.addEventListener('focus',()=>{nodeHover=true;rotationTarget=rotation;select(item);});label.addEventListener('blur',()=>nodeHover=false);label.addEventListener('click',()=>onOpen(item.id));labels.append(label);return{item,marker,label};});
  select(selected);preview.addEventListener('click',()=>onOpen(selected.id));
  const position=new THREE.Vector3(),projected=new THREE.Vector3();
  const smooth=(a,b,v)=>{const p=THREE.MathUtils.clamp((v-a)/(b-a),0,1);return p*p*(3-2*p);};
  const framing={x:0,y:0,scale:1,rect:null};
  function fitGlobe(){
    const pad=mobile?18:Math.max(40,width*.04);
    const heading=document.querySelector('.world-heading');
    const previewStyle=getComputedStyle(preview);
    const top=mobile?heading.offsetTop+heading.offsetHeight+8:56;
    const bottom=mobile?height-parseFloat(previewStyle.bottom)-parseFloat(previewStyle.height)-8:height-34;
    const left=mobile?pad:width*.40,right=width-pad;
    const diameter=Math.max(80,Math.min(right-left,bottom-top))*.995;
    const pixelsPerUnit=height/20;
    framing.x=((left+right)/2-width/2)/pixelsPerUnit;
    framing.y=(height/2-(top+bottom)/2)/pixelsPerUnit;
    // Includes the digital halo (6.081 units) and both orbits in every rotation.
    framing.scale=diameter/(12.2*pixelsPerUnit);
    framing.rect={left:(left+right-diameter)/2,top:(top+bottom-diameter)/2,diameter};
    canvas.dataset.globeBounds=JSON.stringify(framing.rect);canvas.dataset.sphereDiameter=(diameter*5.4/6.1).toFixed(2);uniforms.uHaloRows.value=mobile?2:3;
  }
  function render(){
    const morph=smooth(.08,.55,progress),appear=smooth(.30,.57,progress),nodeReveal=smooth(.55,.68,progress);
    const scale=framing.scale*THREE.MathUtils.lerp(.90,1.0,smooth(.30,.68,progress));
    globe.position.set(framing.x,THREE.MathUtils.lerp(-14,framing.y,smooth(.18,.57,progress)),0);
    globe.scale.setScalar(scale);globe.rotation.set(tilt,rotation,-.1);globe.visible=appear>.001;globe.updateMatrixWorld(true);
    skinMaterial.opacity=appear;inkMaterial.opacity=appear*.58;thinMaterial.opacity=appear*.22;orbitMaterial.opacity=appear*.35;dotMaterial.opacity=nodeReveal;
    uniforms.uTime.value=time;uniforms.uMorph.value=morph;uniforms.uOpacity.value=1-.85*smooth(.47,.68,progress);uniforms.uAspect.value=width/height;uniforms.uRotation.value=rotation;uniforms.uTilt.value=tilt;uniforms.uOrigin.value.copy(globe.position);uniforms.uScale.value=scale;
    field.visible=morph>.01;flowScreen.visible=morph<.76;uniforms.uHaloOpacity.value=smooth(.48,.68,progress);halo.visible=uniforms.uHaloOpacity.value>.001;
    const border=mobile?18:40;
    for(const node of nodes){node.marker.getWorldPosition(position);projected.copy(position).project(camera);const x=(projected.x*.5+.5)*width,y=(-projected.y*.5+.5)*height;const front=position.z>1;const onScreen=x>border&&x<width-border&&y>(mobile?framing.rect.top:80)&&y<height-(mobile?100:55);const active=front&&onScreen&&nodeReveal>.1;const right=x>width*.7;node.label.style.visibility=active?'visible':'hidden';node.label.style.opacity=nodeReveal;node.label.style.flexDirection=right?'row-reverse':'row';node.label.style.transform=`translate(${x}px,${y}px) translate(${right?'-100%':'0'},-50%)`;node.label.tabIndex=active?0:-1;}
    preview.hidden=nodeReveal<.05;preview.style.opacity=nodeReveal;
    renderer.render(scene,camera);canvas.dataset.sceneReady='true';canvas.dataset.progress=progress.toFixed(2);canvas.dataset.phase=progress<.4?'field':'atlas';canvas.dataset.motionTime=time.toFixed(2);canvas.dataset.haloVisible=String(halo.visible);
  }
  function resize(){const r=canvas.getBoundingClientRect();width=r.width;height=r.height;mobile=width<700;renderer.setSize(width,height,false);const aspect=width/height;camera.left=-10*aspect;camera.right=10*aspect;camera.top=10;camera.bottom=-10;camera.position.set(0,0,20);camera.updateProjectionMatrix();camera.updateMatrixWorld();fitGlobe();buildField();render();}
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)render();}).observe(canvas);
  canvas.addEventListener('pointerdown',e=>{if(progress<.45)return;dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();pointer.set((e.clientX-r.left)/width*2-1,-(e.clientY-r.top)/height*2+1);if(dragging){rotationTarget+=(e.clientX-lastX)*.004;tiltTarget=THREE.MathUtils.clamp(tiltTarget+(e.clientY-lastY)*.002,-.5,.7);lastX=e.clientX;lastY=e.clientY;}canvas.style.cursor=progress>.45?(dragging?'grabbing':'grab'):'default';if(reduceMotion){rotation=rotationTarget;tilt=tiltTarget;render();}});
  canvas.addEventListener('pointerleave',()=>{if(!dragging)pointer.set(5,5);});
  canvas.addEventListener('pointerup',e=>{dragging=false;if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);});canvas.addEventListener('pointercancel',()=>dragging=false);
  canvas.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();if(e.key==='ArrowLeft')rotationTarget-=.2;if(e.key==='ArrowRight')rotationTarget+=.2;if(e.key==='ArrowUp')tiltTarget=Math.max(-.5,tiltTarget-.1);if(e.key==='ArrowDown')tiltTarget=Math.min(.7,tiltTarget+.1);rotation=rotationTarget;tilt=tiltTarget;render();}});
  window.addEventListener('portfolio-motion',e=>{reduceMotion=e.detail.reduced;render();});
  function tick(stamp){requestAnimationFrame(tick);if(!visible||document.hidden||document.body.classList.contains('modal-open')||document.body.classList.contains('menu-open')){lastFrame=stamp;return;}const dt=Math.min((stamp-lastFrame)/1000,.05);lastFrame=stamp;if(reduceMotion)return;time+=dt;if(!dragging&&!nodeHover&&progress>.5)rotationTarget+=dt*.017;rotation+=(rotationTarget-rotation)*.075;tilt+=(tiltTarget-tilt)*.075;render();}
  resize();requestAnimationFrame(tick);
  return{setProgress(p){progress=p;render();}};
}


