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
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{viewer.querySelector('img').src=button.dataset.image;viewer.querySelector('img').alt=button.dataset.caption;viewer.querySelector('p').textContent=button.dataset.caption;viewer.showModal();document.body.style.overflow='hidden';}));
viewer.querySelector('button').addEventListener('click',()=>viewer.close());
viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close();}});
viewer.addEventListener('close',()=>{document.body.style.overflow='';});
