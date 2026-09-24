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
function mountFrameGallery(gallery,{collections,initial,meta,notes,labels,name}){
 const stage=gallery.querySelector('.frame-stage'),layers=[...stage.querySelectorAll('.frame-layer')],enlarge=gallery.querySelector('[data-image]');
 let current=0,requested=0,revision=0,set=initial,start=null;
 const items=()=>collections[set];
 function render(index){
  current=index;const list=items(),item=list[index];
  layers.forEach((layer,i)=>{const frame=list[(index+2-i)%list.length],image=layer.querySelector('img');image.src=frame.src;image.alt=i===2?frame.title:'';});
  gallery.querySelector('.frame-time').textContent=item.stamp;
  gallery.querySelector('.frame-title').textContent=item.title;
  gallery.querySelector('.frame-count').textContent=String(index+1).padStart(2,'0')+' / '+String(list.length).padStart(2,'0');
  gallery.querySelectorAll('[data-prev],[data-next]').forEach(button=>button.disabled=list.length===1);
  enlarge.dataset.image=item.src;enlarge.dataset.caption=name+' · '+item.title;
  stage.setAttribute('aria-label',labels[set]+' '+(index+1)+' / '+list.length+'，'+item.title+'，左右方向键切换');
  gallery.classList.toggle('show-product-frames',set==='product');
 }
 async function move(delta){
  const list=items();if(list.length===1)return;
  requested=(requested+delta+list.length)%list.length;const target=requested,token=++revision;
  const preload=new Image();preload.src=list[target].src;
  try{await preload.decode();}catch{gallery.querySelector('.frame-title').textContent='图片暂未加载，请重试';return;}
  if(token!==revision)return;
  layers.forEach(layer=>layer.getAnimations().forEach(animation=>animation.cancel()));
  const outgoing=layers[2].animate([{transform:'translateX(0) rotate(0)',opacity:1},{transform:`translateX(${delta>0?-12:12}%) rotate(${delta>0?-4:4}deg)`,opacity:0}],{duration:160,easing:'ease-in'});
  try{await outgoing.finished;}catch{return;}
  if(token!==revision)return;
  render(target);outgoing.cancel();
  layers[2].animate([{transform:`translateX(${delta>0?8:-8}%) rotate(${delta>0?2:-2}deg)`,opacity:0},{transform:'translateX(0) rotate(0)',opacity:1}],{duration:360,easing:'cubic-bezier(.16,1,.3,1)'});
 }
 gallery.querySelector('[data-prev]').addEventListener('click',()=>move(-1));
 gallery.querySelector('[data-next]').addEventListener('click',()=>move(1));
 gallery.querySelectorAll('[data-frame-set]').forEach(button=>button.addEventListener('click',()=>{
  if(button.dataset.frameSet===set)return;
  set=button.dataset.frameSet;requested=0;revision++;
  layers.forEach(layer=>layer.getAnimations().forEach(animation=>animation.cancel()));
  gallery.querySelectorAll('[data-frame-set]').forEach(tab=>{const active=tab===button;tab.classList.toggle('is-active',active);tab.setAttribute('aria-pressed',String(active));});
  gallery.querySelector('.frame-meta').textContent=meta[set];
  gallery.querySelector('.frame-note').textContent=notes[set];
  render(0);
 }));
 stage.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}});
 stage.addEventListener('pointerdown',event=>{if(event.button!==0)return;start={x:event.clientX,y:event.clientY,id:event.pointerId};stage.setPointerCapture(event.pointerId);});
 stage.addEventListener('pointerup',event=>{if(!start||start.id!==event.pointerId)return;const dx=event.clientX-start.x,dy=event.clientY-start.y;start=null;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.3)move(dx<0?1:-1);});
 stage.addEventListener('pointercancel',()=>{start=null;});
 render(0);
}
const viatrixGallery=document.querySelector('#viatrix .frame-gallery');
if(viatrixGallery)mountFrameGallery(viatrixGallery,{
 collections:{film:frames,product:productFrames},initial:'film',name:'VIATRIX',
 labels:{film:'成片画面',product:'产品效果'},
 meta:{film:'111.27 SEC · 60 FPS',product:'PRODUCT / DETAILS'},
 notes:{film:'左右滑动或点击箭头切换 · 12 张关键帧取自最终成片。',product:'左右滑动或点击箭头切换 · 展示产品效果与结构细节。'}
});
const fangcunGallery=document.querySelector('#fangcun .frame-gallery');
if(fangcunGallery)mountFrameGallery(fangcunGallery,{
 collections:{
  product:[['fangcun-side.webp','车身侧面效果'],['fangcun-scene.webp','骑手与车辆场景'],['fangcun-storage.webp','储物结构展开效果'],['fangcun-rear.webp','配送箱后视效果'],['fangcun-clay.webp','车身模型']].map(([file,title])=>({src:'assets/'+file,title,stamp:'PRODUCT'})),
  board:[{src:'assets/fangcun-project.png',title:'方案版面',stamp:'BOARD'}]
 },initial:'product',name:'方寸',labels:{product:'产品效果',board:'方案版面'},
 meta:{product:'PRODUCT / RENDERS',board:'DESIGN / BOARD'},
 notes:{product:'左右滑动或点击箭头切换 · 点击放大当前图片。',board:'点击放大版面，可在查看器内缩放细节。'}
});
