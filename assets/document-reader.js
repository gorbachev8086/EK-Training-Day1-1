/* Use the existing accessible transcript as the default reading surface. */
(() => {
  const reader=document.getElementById('reader'), transcript=document.getElementById('transcript');
  if(!reader||!transcript)return;
  const source=document.querySelector('.source-figure'), text=document.getElementById('slide-text');
  const docButton=document.getElementById('document-mode'), slideButton=document.getElementById('slide-mode');
  const status=document.getElementById('copy-status');
  function mode(slides){
    document.body.classList.toggle('slide-reading',slides);
    docButton.setAttribute('aria-pressed',String(!slides));slideButton.setAttribute('aria-pressed',String(slides));
    transcript.open=true;source.open=slides;
    const video=document.getElementById('video-panel');
    if(video){if(slides)reader.querySelector('.page-navigation').after(video);else source.before(video);}
    window.dispatchEvent(new Event('resize'));
  }
  function update(){
    transcript.open=true;status.textContent='';
    const empty=text.textContent.includes('이 페이지는 이미지 중심');
    source.open=document.body.classList.contains('slide-reading')||empty;
    document.getElementById('visual-only-note').hidden=!empty;
  }
  docButton.addEventListener('click',()=>mode(false));slideButton.addEventListener('click',()=>mode(true));
  source.addEventListener('toggle',()=>window.dispatchEvent(new Event('resize')));
  document.getElementById('copy-body').addEventListener('click',async()=>{
    const title=document.getElementById('slide-title').textContent;
    const paragraphs=[...text.querySelectorAll('p')].map(p=>p.textContent);
    const tables=[...document.querySelectorAll('#slide-tables table')].map(t=>[...t.rows].map(row=>[...row.cells].map(c=>c.textContent.replace(/\n/g,' ')).join('\t')).join('\n'));
    const links=[...document.querySelectorAll('#slide-links a')].map(a=>a.textContent+' '+a.href);
    try{await navigator.clipboard.writeText([title,...paragraphs,...tables,...links].join('\n\n'));status.textContent='본문과 표를 복사했습니다.';}
    catch{status.textContent='자동 복사를 사용할 수 없습니다. 본문을 드래그한 뒤 Ctrl+C로 복사해 주세요.';}
  });
  new MutationObserver(update).observe(text,{childList:true});
  new MutationObserver(()=>{if(!transcript.open)transcript.open=true;}).observe(transcript,{attributes:true,attributeFilter:['open']});
  mode(false);update();
})();
