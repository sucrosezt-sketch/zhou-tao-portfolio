'use strict';
// Disable native image/link drag navigation without blocking vertical scrolling.
document.querySelectorAll('img,.intro-card').forEach(el=>el.draggable=false);
document.addEventListener('dragstart',e=>{if(e.target.closest('img,.frame-stage,.intro-card,#image-viewer'))e.preventDefault();},true);
document.addEventListener('dragover',e=>{if(e.dataTransfer?.types.some(t=>['Files','text/uri-list'].includes(t)))e.preventDefault();});
document.addEventListener('drop',e=>{if(e.dataTransfer?.types.some(t=>['Files','text/uri-list'].includes(t)))e.preventDefault();});
const headerBrand=document.querySelector('header .brand');
if(headerBrand){headerBrand.textContent='作品集 / PORTFOLIO';headerBrand.setAttribute('aria-label','作品集首页');}
const frames=[
 [4,'外骨骼结构与穿戴细节'],[12,'整理装备，准备出发'],[20,'离开山间营地'],[28,'穿越溪流'],[36,'林间徒步'],[44,'途中休整与同伴互动'],[52,'山景中的产品呈现'],[60,'登山鞋细节'],[68,'经过山间遗迹'],[80,'进入高山谷地'],[92,'攀行雪岩坡面'],[108,'面向群山，行程收尾']
].map(([time,title])=>({time,title,src:'assets/viatrix-final/frame-'+String(time).padStart(3,'0')+'.jpg',stamp:String(Math.floor(time/60)).padStart(2,'0')+':'+String(time%60).padStart(2,'0')}));
const gallery=document.querySelector('.frame-gallery');
if(gallery){
 const stage=gallery.querySelector('.frame-stage'),layers=[...stage.querySelectorAll('.frame-layer')];
 const enlarge=gallery.querySelector('[data-image]');let current=0,requested=0,revision=0;
 function render(index){current=index;const item=frames[index];layers.forEach((layer,i)=>{const f=frames[(index+2-i)%frames.length];layer.querySelector('img').src=f.src;layer.querySelector('img').alt=i===2?f.title+'，成片 '+f.stamp:'';});gallery.querySelector('.frame-time').textContent=item.stamp;gallery.querySelector('.frame-title').textContent=item.title;gallery.querySelector('.frame-count').textContent=String(index+1).padStart(2,'0')+' / 12';enlarge.dataset.image=item.src;enlarge.dataset.caption='VIATRIX · 成片 '+item.stamp+' · '+item.title;stage.setAttribute('aria-label','成片关键帧 '+(index+1)+' / 12，'+item.title+'，左右方向键切换');}
 async function move(delta){requested=(requested+delta+frames.length)%frames.length;const target=requested,token=++revision;const preload=new Image();preload.src=frames[target].src;try{await preload.decode();}catch{gallery.querySelector('.frame-title').textContent='图片暂未加载，请重试';return;}if(token!==revision)return;
 layers.forEach(l=>l.getAnimations().forEach(a=>a.cancel()));
 const outgoing=layers[2].animate([{transform:'translateX(0) rotate(0)',opacity:1},{transform:`translateX(${delta>0?-12:12}%) rotate(${delta>0?-4:4}deg)`,opacity:0}],{duration:160,easing:'ease-in'});
 try{await outgoing.finished;}catch{return;}if(token!==revision)return;render(target);outgoing.cancel();
 layers[2].animate([{transform:`translateX(${delta>0?8:-8}%) rotate(${delta>0?2:-2}deg)`,opacity:0},{transform:'translateX(0) rotate(0)',opacity:1}],{duration:360,easing:'cubic-bezier(.16,1,.3,1)'});
 }
 gallery.querySelector('[data-prev]').addEventListener('click',()=>move(-1));gallery.querySelector('[data-next]').addEventListener('click',()=>move(1));
 stage.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});
 let start=null;
 stage.addEventListener('pointerdown',e=>{if(e.button!==0)return;start={x:e.clientX,y:e.clientY,id:e.pointerId};stage.setPointerCapture(e.pointerId);});
 stage.addEventListener('pointerup',e=>{if(!start||start.id!==e.pointerId)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.3)move(dx<0?1:-1);});stage.addEventListener('pointercancel',()=>{start=null;});
 render(0);
}
