const cache=new Map();
export async function dominant(src){
 if(cache.has(src))return cache.get(src);
 const task=(async()=>{const img=new Image();img.src=src;await img.decode();const c=document.createElement('canvas');c.width=c.height=40;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0,40,40);const data=ctx.getImageData(0,0,40,40).data,bins=new Map();
 for(let i=0;i<data.length;i+=4){const rgb=[data[i],data[i+1],data[i+2]],max=Math.max(...rgb),min=Math.min(...rgb);if(data[i+3]<100||max<30||min>230)continue;const key=rgb.map(v=>Math.floor(v/32)).join(',');const bin=bins.get(key)||{sum:[0,0,0],n:0,weight:0};bin.n++;bin.weight+=1+(max-min)/60;rgb.forEach((v,j)=>bin.sum[j]+=v);bins.set(key,bin);}
 const win=[...bins.values()].sort((a,b)=>b.weight-a.weight)[0];return win?win.sum.map(v=>Math.round(v/win.n)):[140,140,140];})();cache.set(src,task);return task;
}
export function initCarousel(){
 const deck=document.querySelector('.intro-deck'),cards=[...deck.querySelectorAll('.intro-card')],home=deck.closest('section'),n=cards.length;
 const caption=document.createElement('div');caption.className='carousel-caption';
 deck.after(caption);
 const controls=document.createElement('div');controls.className='intro-controls';controls.innerHTML='<button aria-label="上一个项目">←</button><span aria-live="polite"></span><button aria-label="下一个项目">→</button>';caption.append(controls);
 let p=0,target=0,raf=0,last=0,lastWheel=0,wheelDirection=1,snapPending=false,drag=null,skip=false;const colors=cards.map(()=>[140,140,140]);const mod=v=>(v%n+n)%n;
 function render(){const active=mod(Math.round(p)),spacing=matchMedia('(max-width:760px)').matches?92:107;cards.forEach((card,i)=>{let d=mod(i-p+n/2)-n/2,a=Math.abs(d);card.style.transform=`translate3d(${d*spacing}%,0,${-Math.min(a,3)*190}px) rotateY(${-Math.max(-1,Math.min(1,d))*28}deg) scale(${1-Math.min(a,3)*.12})`;card.style.filter=`blur(${Math.min(a,2)*1.8}px)`;card.style.opacity=String(Math.max(0,1-a*.34));card.style.zIndex=String(20-Math.round(a*3));card.inert=i!==active;card.setAttribute('aria-hidden',String(i!==active));});
 const a=mod(Math.floor(p)),b=mod(Math.floor(p)+1),f=p-Math.floor(p),color=colors[a].map((v,i)=>Math.round(v+(colors[b][i]-v)*f));home.style.setProperty('--hero-glow',color.join(','));controls.querySelector('span').textContent=String(active+1).padStart(2,'0')+' / '+String(n).padStart(2,'0');deck.dataset.position=p.toFixed(4);}
 function tick(now){const dt=Math.min(32,now-last||16);last=now;if(snapPending&&now-lastWheel>80){target=wheelDirection>0?Math.ceil(target-1e-6):Math.floor(target+1e-6);snapPending=false;}p+=(target-p)*(1-Math.exp(-dt/65));if(Math.abs(target-p)<.0005&&!snapPending){p=target;raf=0;render();return;}render();raf=requestAnimationFrame(tick);}
 function follow(){if(!raf){last=performance.now();raf=requestAnimationFrame(tick);}}
 function settle(to){snapPending=false;target=to;follow();}
 controls.children[0].onclick=()=>settle(Math.round(target)-1);controls.children[2].onclick=()=>settle(Math.round(target)+1);
 deck.addEventListener('wheel',e=>{if(e.ctrlKey||!e.target.closest('.cover-media'))return;const d=(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);if(!d)return;e.preventDefault();const step=d/240;target+=step;p+=step*.24;lastWheel=performance.now();wheelDirection=Math.sign(d);snapPending=true;render();follow();},{passive:false});
 deck.addEventListener('pointerdown',e=>{if(e.button!==0)return;cancelAnimationFrame(raf);raf=0;snapPending=false;target=p;drag={x:e.clientX,y:e.clientY,p,id:e.pointerId,active:false};skip=false;});
 deck.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!drag.active&&Math.abs(dx)>10&&Math.abs(dx)>Math.abs(dy)*1.2){drag.active=true;deck.setPointerCapture(e.pointerId);}if(drag.active){skip=true;p=drag.p-dx/(deck.clientWidth*.5);target=p;render();}});
 function release(){if(!drag)return;const active=drag.active;drag=null;if(active)settle(Math.round(p));}
 deck.addEventListener('pointerup',release);deck.addEventListener('pointercancel',release);deck.addEventListener('click',e=>{if(skip){e.preventDefault();skip=false;}},true);
 cards.forEach((c,i)=>dominant(c.dataset.cover).then(rgb=>{colors[i]=rgb;render();}).catch(()=>{}));addEventListener('resize',render,{passive:true});render();
}
export function initAmbient(){
 const hosts=[...document.querySelectorAll('.course-visual .zoom-image,.frame-stage,.hotel-visual,.knowledge-visual')];
 hosts.forEach(host=>{host.classList.add('ambient-host');let serial=0;function update(){const img=host.matches('.frame-stage')?host.querySelector('.frame-layer:last-child img'):host.querySelector('img');if(!img)return;const version=++serial;dominant(img.src).then(rgb=>{if(version===serial){host.style.setProperty('--ambient-color',`rgb(${rgb.join(',')})`);host.dataset.ambient=rgb.join(',');}}).catch(()=>{});}new MutationObserver(update).observe(host,{subtree:true,attributes:true,attributeFilter:['src']});update();});
}
