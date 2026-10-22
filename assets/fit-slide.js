(() => {
  'use strict';
  const wrap=document.querySelector('.slide-image-wrap');
  const image=document.getElementById('slide-image');
  const reader=document.getElementById('reader');
  if(!wrap||!image||!reader)return;
  let frame=0;
  const extent=(el)=>{
    if(!el||el.hidden)return 0;
    const s=getComputedStyle(el);
    return el.getBoundingClientRect().height+parseFloat(s.marginTop||0)+parseFloat(s.marginBottom||0);
  };
  function fit(){
    frame=0;
    if(innerWidth<=800){wrap.style.removeProperty('--fit-slide-height');return;}
    if(reader.hidden)return;
    const top=wrap.getBoundingClientRect().top+window.scrollY;
    const reserve=extent(document.getElementById('public-mask-note'))+extent(reader.querySelector('.page-navigation'))+18;
    const height=Math.max(100,Math.floor(innerHeight-top-reserve));
    const value=height+'px';
    if(wrap.style.getPropertyValue('--fit-slide-height')!==value)wrap.style.setProperty('--fit-slide-height',value);
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(fit);}
  window.addEventListener('resize',schedule);
  window.addEventListener('hashchange',()=>{
    const index=document.querySelector('.video-index');if(index)index.open=false;
    schedule();
  });
  image.addEventListener('load',schedule);
  new MutationObserver(schedule).observe(reader,{subtree:true,childList:true,attributes:true,attributeFilter:['src','hidden']});
  const observer=new ResizeObserver(schedule);
  ['.topbar','.guide-download-bar','.reader-heading','.slide-toolbar','.video-index','#public-mask-note'].forEach(selector=>{
    const el=document.querySelector(selector);if(el)observer.observe(el);
  });
  if(document.fonts)document.fonts.ready.then(schedule);
  schedule();
})();
