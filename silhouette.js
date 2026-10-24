/* Silhouette : 25 images (mince → très forte) choisies selon l'IMC, avec fondu et animation entre deux pesées. */
(function(){
const N=25,BASE="silhouettes/",ANCH=[[17,0],[22,8],[30,16],[40,24]];
const SETS={homme:true,femme:false}; /* passer femme à true quand le dossier silhouettes/femme/ est en ligne */
const src=(s,i)=>`${BASE}${s}/sil_${String(i).padStart(2,"0")}.webp`;
const bmi=(h,w)=>w/((h/100)**2);
function idx(b){if(b<=ANCH[0][0])return 0;for(let i=1;i<ANCH.length;i++)if(b<=ANCH[i][0]){const[a0,i0]=ANCH[i-1],[a1,i1]=ANCH[i];return i0+(b-a0)/(a1-a0)*(i1-i0)}return N-1}
const age=d=>{if(!d)return 99;const t=new Date(d),n=new Date();let a=n.getFullYear()-t.getFullYear();if(n<new Date(n.getFullYear(),t.getMonth(),t.getDate()))a--;return a};
let raf,pre={};
const preload=s=>{if(pre[s])return;pre[s]=1;for(let i=0;i<N;i++)new Image().src=src(s,i)};
const setSrc=(im,u)=>{if(im.dataset.s!==u){im.dataset.s=u;im.src=u}};
function frame(){const d=document.createElement("div");d.style.cssText="position:relative;width:100%;aspect-ratio:2/3;background:#0b1826;border-radius:10px;overflow:hidden";
 const a=document.createElement("img"),b=document.createElement("img");
 for(const im of[a,b]){im.alt="";im.style.cssText="position:absolute;inset:0;width:100%;height:100%;object-fit:cover";d.append(im)}
 d.set=(s,x)=>{x=Math.max(0,Math.min(N-1,x));const i=Math.floor(x);setSrc(a,src(s,i));setSrc(b,src(s,Math.min(N-1,i+1)));b.style.opacity=x-i};return d}
window.Silhouette={_idx:idx,_bmi:bmi,
 mount(el,o){cancelAnimationFrame(raf);el.style.cssText="";
  const msg=t=>{el.innerHTML=`<p class="mut">${t}</p>`};
  if(age(o.naissance)<18)return msg("La visualisation de la silhouette est réservée aux adultes.");
  if(o.sexe!=="femme"&&o.sexe!=="homme")return msg("Indiquez votre sexe dans « Ma fiche » pour afficher votre silhouette.");
  const sx=o.sexe;if(!SETS[sx])return msg("La silhouette féminine sera bientôt disponible.");
  preload(sx);const h=Math.max(120,Math.min(220,+o.h||175)),i0=idx(bmi(h,o.w0)),i1=idx(bmi(h,o.w)),from=window.__silIdx!=null?window.__silIdx:i0;
  el.innerHTML="";el.style.cssText="display:flex;gap:12px;justify-content:center;align-items:flex-end";
  const mk=(label,fx)=>{const c=document.createElement("div");c.style.cssText=`flex:${fx};text-align:center`;const f=frame();c.append(f);
   const p=document.createElement("div");p.className="mut";p.style.fontSize=".8rem";p.textContent=label;c.append(p);el.append(c);return f};
  const L=mk(`Départ · ${o.w0} kg`,.6),R=mk(`Aujourd'hui · ${o.w} kg`,1);
  L.set(sx,i0);R.set(sx,from);const t0=performance.now(),D=1800;
  const step=t=>{const k=Math.min(1,(t-t0)/D),e=k*k*(3-2*k),x=from+(i1-from)*e;R.set(sx,x);window.__silIdx=x;if(k<1)raf=requestAnimationFrame(step)};
  raf=requestAnimationFrame(step)}};
})();
