/* Silhouette 3D filaire paramétrique : s'adapte à la taille (cm) et au poids (kg). Nécessite three.js (r128). */
(function(){
const M=28,lerp=(a,b,t)=>a+(b-a)*t,sm=t=>t*t*(3-2*t),K=a=>a.sort((x,y)=>x[0]-y[0]);
const prof=(k,y)=>{if(y<=k[0][0])return k[0][1];for(let i=1;i<k.length;i++)if(y<=k[i][0]){const t=(y-k[i-1][0])/(k[i][0]-k[i-1][0]);return lerp(k[i-1][1],k[i][1],sm(t))}return k[k.length-1][1]};
const R=(k,y,a)=>prof(k.map(q=>[q[0],q[1]]),y)*(1+prof(k.map(q=>[q[0],q[2]]),y)*a);
const A=(h,w)=>Math.max(-.2,Math.min(1.4,(w/((h/100)**2)-21)/18)); /* "adiposité" selon l'IMC */
const parts=[
 {y:[.47,.85],n:40,rx:K([[.47,13,.4],[.53,17,.4],[.62,14.5,.55],[.72,17,.3],[.80,19,.1],[.82,16,.1],[.85,5.8,.2]]),rz:K([[.47,9.5,.5],[.53,11,.5],[.62,10,.7],[.72,11.5,.35],[.80,8.5,.15],[.85,5.5,.2]])},
 {y:[.04,.48],n:34,sym:1,cx:K([[.04,6.8],[.48,8.5]]),rx:K([[.48,10,.45],[.40,8.8,.45],[.36,8,.4],[.285,5.4,.25],[.17,5.6,.25],[.08,3.8,.15],[.04,3.2,.1]]),rz:K([[.48,10,.5],[.40,9,.5],[.36,8.3,.45],[.285,5.6,.25],[.17,6.2,.3],[.08,4,.15],[.04,3.6,.1]])},
 {y:[0,.045],n:4,sym:1,cx:K([[0,6.8],[.045,6.8]]),cz:K([[0,5],[.045,0]]),rx:K([[0,3.8,0],[.045,3.2,0]]),rz:K([[0,9,0],[.02,10,0],[.045,4,0]])},
 {y:[.40,.81],n:24,sym:1,ao:7,cx:K([[.40,27.8],[.81,21.5]]),rx:K([[.81,5.2,.4],[.74,4.8,.4],[.66,3.9,.3],[.60,4.1,.25],[.50,2.7,.15],[.46,2.6,.1],[.435,3.3,.1],[.40,1.6,0]])},
 {y:[.84,.885],n:4,rx:K([[.84,5.4,.2],[.885,5.2,.2]])},
 {y:[.875,1],n:18,rx:K([[.875,3,.1],[.885,6.5,.1],[.91,8.2,.12],[.94,8.8,.12],[.97,7.8,.1],[.99,4.5,.05],[1,.5,0]]),rz:K([[.875,4,.1],[.885,7.5,.1],[.91,9.3,.12],[.94,9.8,.12],[.97,8.6,.1],[.99,5,.05],[1,.5,0]])}];
function mesh(h,a){const P=[],I=[],L=[],S=h/175;let o=0;
 for(const p of parts)for(const sx of p.sym?[1,-1]:[1]){const n=p.n;
  for(let i=0;i<=n;i++){const y=lerp(p.y[0],p.y[1],i/n),rx=R(p.rx,y,a)*S,rz=R(p.rz||p.rx,y,a)*S,cx=(p.cx?prof(p.cx,y)*sx*S:0)+(p.ao?sx*a*p.ao*S:0),cz=p.cz?prof(p.cz,y)*S:0;
   for(let j=0;j<M;j++){const t=j/M*6.2832;P.push(cx+rx*Math.cos(t),y*h,cz+rz*Math.sin(t))}}
  for(let i=0;i<=n;i++)for(let j=0;j<M;j++){const a0=o+i*M+j,a1=o+i*M+(j+1)%M;L.push(a0,a1);
   if(i<n){const b0=a0+M,b1=a1+M;L.push(a0,b0);I.push(a0,b0,a1,a1,b0,b1)}}
  o+=(n+1)*M}
 return{P,I,L}}
let raf,rd;
window.Silhouette={_mesh:(h,w)=>mesh(h,A(h,w)),
 mount(el,o){if(!window.THREE){el.textContent="Silhouette indisponible";return}
  const h=Math.max(120,Math.min(220,+o.h||175)),w0=+o.w0||70,w=+o.w||w0;
  cancelAnimationFrame(raf);if(rd){rd.dispose();rd=null}
  const W=Math.min(340,el.clientWidth||300),Ht=Math.round(W*1.45);
  const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(28,W/Ht,1,2000);cam.position.set(0,h*.5,h*2.25);cam.lookAt(0,h*.5,0);
  rd=new THREE.WebGLRenderer({antialias:true,alpha:true});rd.setSize(W,Ht);rd.setPixelRatio(Math.min(devicePixelRatio||1,2));
  el.innerHTML="";el.appendChild(rd.domElement);const g=new THREE.Group();sc.add(g);
  const add=(wt,col,op,solid)=>{const m=mesh(h,A(h,wt)),pos=new THREE.Float32BufferAttribute(m.P,3),gl=new THREE.BufferGeometry();gl.setAttribute("position",pos);gl.setIndex(m.L);
   if(solid){const gs=new THREE.BufferGeometry();gs.setAttribute("position",pos);gs.setIndex(m.I);
    g.add(new THREE.Mesh(gs,new THREE.MeshBasicMaterial({color:0x0e1a23,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1,side:THREE.DoubleSide})))}
   g.add(new THREE.LineSegments(gl,new THREE.LineBasicMaterial({color:col,transparent:true,opacity:op,depthWrite:false})))};
  if(Math.abs(w0-w)>.05)add(w0,0x7fa8ff,.4,false);add(w,0x2ee6d6,.95,true);
  g.rotation.y=.6;let drag=0,lx=0;const c=rd.domElement;c.style.touchAction="pan-y";
  c.onpointerdown=e=>{drag=1;lx=e.clientX};window.onpointerup=()=>drag=0;c.onpointermove=e=>{if(drag){g.rotation.y+=(e.clientX-lx)*.01;lx=e.clientX}};
  const loop=()=>{if(!drag)g.rotation.y+=.004;rd.render(sc,cam);raf=requestAnimationFrame(loop)};loop()}};
})();
