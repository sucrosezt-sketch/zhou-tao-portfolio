'use strict';
const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','展开导航');}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'收起导航':'展开导航');});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
if('IntersectionObserver' in window){
  document.documentElement.classList.add('motion-ready');
  const reveals = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');reveals.unobserve(entry.target);}}),{threshold:0.08});
  document.querySelectorAll('.reveal').forEach(el=>reveals.observe(el));
}
const sections=[...document.querySelectorAll('main section[id]')];
const links=[...nav.querySelectorAll('a')];
let pending=false;
function updateScroll(){
 const total=document.documentElement.scrollHeight-innerHeight;
 document.querySelector('.reading-progress').style.width=`${total>0?Math.min(100,scrollY/total*100):0}%`;
 let current=sections[0];sections.forEach(el=>{if(el.getBoundingClientRect().top<innerHeight*.38)current=el;});
 links.forEach(a=>{const active=a.getAttribute('href')==='#'+current.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
 pending=false;
}
addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(updateScroll);}},{passive:true});addEventListener('resize',()=>{if(innerWidth>760)closeMenu();updateScroll();});updateScroll();
const viewer=document.querySelector('#image-viewer');
const viewerViewport=viewer.querySelector('.viewer-viewport');
const viewerImage=viewerViewport.querySelector('img');
let viewerScale=1,viewerX=0,viewerY=0,viewerDrag=null;
function updateViewerTransform(){viewerImage.style.transform=`translate3d(${viewerX}px,${viewerY}px,0) scale(${viewerScale})`;viewerViewport.classList.toggle('is-zoomed',viewerScale>1);}
function clampViewerPosition(){const width=viewerImage.clientWidth,height=viewerImage.clientHeight;viewerX=Math.max(-width*(viewerScale-1)/2,Math.min(width*(viewerScale-1)/2,viewerX));viewerY=Math.max(-height*(viewerScale-1)/2,Math.min(height*(viewerScale-1)/2,viewerY));}
function resetViewer(){viewerScale=1;viewerX=0;viewerY=0;viewerDrag=null;updateViewerTransform();}
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{resetViewer();viewerImage.src=button.dataset.image;viewerImage.alt=button.dataset.caption;viewer.querySelector('p').textContent=button.dataset.caption;viewer.showModal();document.body.style.overflow='hidden';}));
viewerViewport.addEventListener('wheel',event=>{event.preventDefault();if(!viewerImage.complete)return;const oldScale=viewerScale;const nextScale=Math.max(1,Math.min(5,oldScale*Math.exp(-event.deltaY*.0017)));if(nextScale===oldScale)return;const rect=viewerViewport.getBoundingClientRect(),px=event.clientX-rect.left-rect.width/2,py=event.clientY-rect.top-rect.height/2,ratio=nextScale/oldScale;viewerX=px-(px-viewerX)*ratio;viewerY=py-(py-viewerY)*ratio;viewerScale=nextScale;clampViewerPosition();updateViewerTransform();},{passive:false});
viewerViewport.addEventListener('pointerdown',event=>{if(event.button!==0||viewerScale<=1)return;viewerDrag={id:event.pointerId,x:event.clientX,y:event.clientY,originX:viewerX,originY:viewerY};viewerViewport.setPointerCapture(event.pointerId);viewerViewport.classList.add('is-dragging');});
viewerViewport.addEventListener('pointermove',event=>{if(!viewerDrag||viewerDrag.id!==event.pointerId)return;viewerX=viewerDrag.originX+event.clientX-viewerDrag.x;viewerY=viewerDrag.originY+event.clientY-viewerDrag.y;clampViewerPosition();updateViewerTransform();});
function endViewerDrag(){viewerDrag=null;viewerViewport.classList.remove('is-dragging');}
viewerViewport.addEventListener('pointerup',endViewerDrag);
viewerViewport.addEventListener('pointercancel',endViewerDrag);
viewerViewport.addEventListener('dblclick',resetViewer);
window.addEventListener('resize',()=>{if(viewer.open){clampViewerPosition();updateViewerTransform();}});
viewer.querySelector('button').addEventListener('click',()=>viewer.close());
viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close();}});
viewer.addEventListener('close',()=>{document.body.style.overflow='';});
