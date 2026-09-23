export function initPointerAtmosphere(){
  if(!window.matchMedia('(pointer: fine)').matches)return;
  const ambient=document.querySelector('.site-ambient');
  const glow=ambient?.querySelector('.pointer-glow');
  const trailLayer=ambient?.querySelector('.pointer-trails');
  if(!glow||!trailLayer)return;

  let x=innerWidth/2,y=innerHeight/2,raf=0,dragging=false,lastTrail=0,lastX=x,lastY=y;
  const placeGlow=()=>{glow.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;raf=0;};
  const stopDrag=()=>{dragging=false;document.body.classList.remove('ambient-dragging');};
  const leave=()=>{glow.classList.remove('is-active');stopDrag();};
  const addTrail=(px,py)=>{
    const dot=document.createElement('span');
    dot.className='trail-dot';
    dot.style.left=`${px}px`;
    dot.style.top=`${py}px`;
    trailLayer.append(dot);
    dot.addEventListener('animationend',()=>dot.remove(),{once:true});
    if(trailLayer.childElementCount>28)trailLayer.firstElementChild?.remove();
  };

  window.addEventListener('pointermove',event=>{
    if(event.pointerType==='touch')return;
    x=event.clientX;y=event.clientY;
    glow.classList.add('is-active');
    if(!raf)raf=requestAnimationFrame(placeGlow);
    if(dragging&&performance.now()-lastTrail>25&&Math.hypot(x-lastX,y-lastY)>9){
      addTrail(x,y);lastTrail=performance.now();lastX=x;lastY=y;
    }
  },{passive:true});
  window.addEventListener('pointerdown',event=>{
    if(event.pointerType==='touch'||event.button!==0||event.target.closest('dialog,a,button,input,textarea,select,summary,[contenteditable],.intro-deck,.flip-card,.frame-stage'))return;
    dragging=true;lastX=event.clientX;lastY=event.clientY;lastTrail=0;
    document.body.classList.add('ambient-dragging');
  });
  window.addEventListener('pointerup',stopDrag);
  window.addEventListener('pointercancel',stopDrag);
  document.addEventListener('pointerleave',leave);
  window.addEventListener('blur',leave);
}
