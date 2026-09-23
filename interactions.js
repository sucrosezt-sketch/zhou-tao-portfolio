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
const productFrames=[
 ['viatrix-detail-board.webp','产品结构与部件细节'],
 ['viatrix-wear-detail.webp','穿戴状态与腿部结构'],
 ['viatrix-knee-detail.webp','膝部关节与外壳'],
 ['viatrix-fastener-detail.webp','绑带与固定结构'],
 ['viatrix-belt-detail.webp','腰部连接与束带'],
 ['viatrix-cushion-detail.webp','支撑垫与贴合细节']
].map(([file,title])=>({src:'assets/'+file,title,stamp:'PRODUCT'}));
const gallery=document.querySelector('.frame-gallery');
if(gallery){
 const stage=gallery.querySelector('.frame-stage'),layers=[...stage.querySelectorAll('.frame-layer')];
 const enlarge=gallery.querySelector('[data-image]');let current=0,requested=0,revision=0,set='film';
 const items=()=>set==='film'?frames:productFrames;
 function render(index){current=index;const list=items(),item=list[index];layers.forEach((layer,i)=>{const f=list[(index+2-i)%list.length];layer.querySelector('img').src=f.src;layer.querySelector('img').alt=i===2?f.title:'';});gallery.querySelector('.frame-time').textContent=item.stamp;gallery.querySelector('.frame-title').textContent=item.title;gallery.querySelector('.frame-count').textContent=String(index+1).padStart(2,'0')+' / '+String(list.length).padStart(2,'0');enlarge.dataset.image=item.src;enlarge.dataset.caption='VIATRIX · '+item.title;enlarge.textContent='放大当前图片 ↗';stage.setAttribute('aria-label',(set==='film'?'成片画面 ':'产品效果 ')+(index+1)+' / '+list.length+'，'+item.title+'，左右方向键切换');}
 async function move(delta){const list=items();requested=(requested+delta+list.length)%list.length;const target=requested,token=++revision;const preload=new Image();preload.src=list[target].src;try{await preload.decode();}catch{gallery.querySelector('.frame-title').textContent='图片暂未加载，请重试';return;}if(token!==revision)return;
 layers.forEach(l=>l.getAnimations().forEach(a=>a.cancel()));
 const outgoing=layers[2].animate([{transform:'translateX(0) rotate(0)',opacity:1},{transform:`translateX(${delta>0?-12:12}%) rotate(${delta>0?-4:4}deg)`,opacity:0}],{duration:160,easing:'ease-in'});
 try{await outgoing.finished;}catch{return;}if(token!==revision)return;render(target);outgoing.cancel();
 layers[2].animate([{transform:`translateX(${delta>0?8:-8}%) rotate(${delta>0?2:-2}deg)`,opacity:0},{transform:'translateX(0) rotate(0)',opacity:1}],{duration:360,easing:'cubic-bezier(.16,1,.3,1)'});
 }
 gallery.querySelector('[data-prev]').addEventListener('click',()=>move(-1));gallery.querySelector('[data-next]').addEventListener('click',()=>move(1));
 gallery.querySelectorAll('[data-frame-set]').forEach(button=>button.addEventListener('click',()=>{if(button.dataset.frameSet===set)return;set=button.dataset.frameSet;requested=0;revision++;layers.forEach(layer=>layer.getAnimations().forEach(animation=>animation.cancel()));gallery.querySelectorAll('[data-frame-set]').forEach(tab=>{const active=tab===button;tab.classList.toggle('is-active',active);tab.setAttribute('aria-pressed',String(active));});gallery.querySelector('.frame-meta').textContent=set==='film'?'111.27 SEC · 60 FPS':'PRODUCT / DETAILS';gallery.querySelector('.frame-note').textContent=set==='film'?'左右滑动或点击箭头切换 · 12 张关键帧取自最终成片。':'左右滑动或点击箭头切换 · 展示产品效果与结构细节。';render(0);gallery.classList.toggle('show-product-frames',set==='product');}));
 stage.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});
 let start=null;
 stage.addEventListener('pointerdown',e=>{if(e.button!==0)return;start={x:e.clientX,y:e.clientY,id:e.pointerId};stage.setPointerCapture(e.pointerId);});
 stage.addEventListener('pointerup',e=>{if(!start||start.id!==e.pointerId)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.3)move(dx<0?1:-1);});stage.addEventListener('pointercancel',()=>{start=null;});
 render(0);
}
const fangcunGallery=document.querySelector('#fangcun .product-gallery');
if(fangcunGallery){
 const pictures=[
  ['fangcun-project.png','方案版面'],['fangcun-clay.webp','车身模型'],['fangcun-scene.webp','骑手与车辆场景'],['fangcun-side.webp','车身侧面效果'],['fangcun-rear.webp','配送箱后视效果'],['fangcun-storage.webp','储物结构展开效果']
 ];
 const button=fangcunGallery.querySelector('.zoom-image'),image=button.querySelector('img');let index=0,revision=0;
 async function show(next){const target=(next+pictures.length)%pictures.length,token=++revision;const [file,title]=pictures[target];const preload=new Image();preload.src='assets/'+file;try{await preload.decode();}catch{return;}if(token!==revision)return;index=target;image.classList.add('is-changing');image.src=preload.src;image.alt='方寸 · '+title;button.dataset.image='assets/'+file;button.dataset.caption='方寸 · '+title;button.setAttribute('aria-label','放大方寸 · '+title);fangcunGallery.querySelector('.product-gallery-kind').textContent=title;fangcunGallery.querySelector('.product-gallery-count').textContent=String(index+1).padStart(2,'0')+' / '+String(pictures.length).padStart(2,'0');requestAnimationFrame(()=>image.classList.remove('is-changing'));}
 fangcunGallery.querySelector('[data-product-prev]').addEventListener('click',()=>show(index-1));
 fangcunGallery.querySelector('[data-product-next]').addEventListener('click',()=>show(index+1));
}
