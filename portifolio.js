// ═══ PARTICLES ═══
(function(){
  const c=document.getElementById('particles');
  for(let i=0;i<30;i++){
    const p=document.createElement('div');
    p.className='particle';
    p.style.left=Math.random()*100+'%';
    p.style.animationDuration=(8+Math.random()*12)+'s';
    p.style.animationDelay=Math.random()*10+'s';
    p.style.width=p.style.height=(1+Math.random()*2)+'px';
    c.appendChild(p);
  }
})();

// ═══ 3D HERO CARD ═══
(function(){
  const w=document.getElementById('card3dWrapper'),
        c=document.getElementById('card3d'),
        s=document.getElementById('cardShine');
  w.addEventListener('mousemove',e=>{
    const r=w.getBoundingClientRect(),
          x=e.clientX-r.left,y=e.clientY-r.top,
          cx=r.width/2,cy=r.height/2;
    c.style.transform=`rotateX(${((y-cy)/cy)*-15}deg) rotateY(${((x-cx)/cx)*15}deg)`;
    s.style.setProperty('--mx',(x/r.width*100)+'%');
    s.style.setProperty('--my',(y/r.height*100)+'%');
  });
  w.addEventListener('mouseleave',()=>{c.style.transform='rotateX(0) rotateY(0)'});
})();

// ═══ SKILL CARD GLOW ═══
document.querySelectorAll('.skill-card').forEach(c=>{
  c.addEventListener('mousemove',e=>{
    const r=c.getBoundingClientRect();
    c.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
    c.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
  });
});

// ═══ SCROLL REVEAL ═══
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      e.target.querySelectorAll('.skill-bar-fill').forEach(b=>{
        const w=b.getAttribute('data-width');
        if(w) b.style.width=w+'%';
      });
    } else {
      e.target.classList.remove('visible');
      e.target.querySelectorAll('.skill-bar-fill').forEach(b=>{b.style.width='0'});
    }
  });
},{threshold:0.15,rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('.reveal,.reveal-scale,.timeline-item').forEach(el=>obs.observe(el));

// ═══ PROGRESS BAR + NAVBAR ═══
window.addEventListener('scroll',()=>{
  const s=window.scrollY,d=document.documentElement.scrollHeight-window.innerHeight;
  document.getElementById('progressBar').style.width=(s/d*100)+'%';
  document.getElementById('navbar').classList.toggle('scrolled',s>100);
});

// ═══ CURSOR GLOW ═══
const cg=document.getElementById('cursorGlow');
document.addEventListener('mousemove',e=>{
  cg.style.opacity='1';
  cg.style.left=e.clientX+'px';
  cg.style.top=e.clientY+'px';
});
document.addEventListener('mouseleave',()=>{cg.style.opacity='0'});

// ═══ NAV LINKS ═══
document.querySelectorAll('.nav-links a').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    const t=document.querySelector(a.getAttribute('href'));
    if(t) t.scrollIntoView({behavior:'smooth',block:'start'});
    document.getElementById('navLinks').classList.remove('open');
  });
});
document.getElementById('mobileToggle').addEventListener('click',()=>{
  document.getElementById('navLinks').classList.toggle('open');
});
setTimeout(()=>{
  document.querySelectorAll('.hero .reveal').forEach(el=>el.classList.add('visible'));
},200);

// ═══ STORY & VIDEO MODALS ═══
function openStory(){
  const o=document.getElementById('storyOverlay');
  o.style.display='flex';
  requestAnimationFrame(()=>o.classList.add('active'));
  document.body.style.overflow='hidden';
}
function closeStory(){
  const o=document.getElementById('storyOverlay');
  o.classList.remove('active');
  setTimeout(()=>{o.style.display='none';document.body.style.overflow=''},400);
}
let videoLoaded=false;
function openVideo(){
  const o=document.getElementById('videoOverlay');
  o.style.display='flex';
  requestAnimationFrame(()=>o.classList.add('active'));
  document.body.style.overflow='hidden';
}
function closeVideo(){
  const o=document.getElementById('videoOverlay');
  o.classList.remove('active');
  const v=document.getElementById('mainVideo');
  if(v&&!v.paused) v.pause();
  setTimeout(()=>{o.style.display='none';document.body.style.overflow=''},400);
}
function loadVideo(input){
  if(input.files&&input.files[0]){
    const url=URL.createObjectURL(input.files[0]);
    const v=document.getElementById('mainVideo');
    v.src=url;v.style.display='block';
    document.getElementById('videoPlaceholder').style.display='none';
    videoLoaded=true;
    v.addEventListener('loadedmetadata',()=>updateTime());
    v.addEventListener('timeupdate',()=>{
      document.getElementById('vcFill').style.width=(v.currentTime/v.duration*100)+'%';
      updateTime();
    });
  }
}
function togglePlay(){
  if(!videoLoaded) return;
  const v=document.getElementById('mainVideo'),btn=document.getElementById('playBtn');
  if(v.paused){
    v.play();
    btn.innerHTML='<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
  } else {
    v.pause();
    btn.innerHTML='<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
  }
}
function skipVideo(sec){
  if(!videoLoaded) return;
  const v=document.getElementById('mainVideo');
  v.currentTime=Math.max(0,Math.min(v.duration,v.currentTime+sec));
}
function seekVideo(e){
  if(!videoLoaded) return;
  const v=document.getElementById('mainVideo'),r=e.currentTarget.getBoundingClientRect();
  v.currentTime=(e.clientX-r.left)/r.width*v.duration;
}
function updateTime(){
  const v=document.getElementById('mainVideo');
  if(!v.duration) return;
  const f=t=>{const m=Math.floor(t/60),s=Math.floor(t%60);return m+':'+(s<10?'0':'')+s};
  document.getElementById('vcTime').textContent=f(v.currentTime)+' / '+f(v.duration);
}
const speeds=[0.5,0.75,1,1.25,1.5,2];
let speedIdx=2;
function changeSpeed(){
  if(!videoLoaded) return;
  speedIdx=(speedIdx+1)%speeds.length;
  document.getElementById('mainVideo').playbackRate=speeds[speedIdx];
  document.getElementById('vcSpeed').textContent=speeds[speedIdx]+'x';
}
function goFullscreen(){
  if(!videoLoaded) return;
  const w=document.getElementById('videoWrapper');
  if(w.requestFullscreen) w.requestFullscreen();
  else if(w.webkitRequestFullscreen) w.webkitRequestFullscreen();
}

// ═══ LIKE SYSTEM ═══
let likes=0,userLiked=false;
try{likes=parseInt(localStorage.getItem('jvr_likes')||'0');userLiked=localStorage.getItem('jvr_user_liked')==='true';}catch(e){}
document.getElementById('likeCount').textContent=likes;
if(userLiked) document.getElementById('vcLike').classList.add('liked');
function toggleLike(){
  const btn=document.getElementById('vcLike'),cnt=document.getElementById('likeCount');
  if(!userLiked){
    likes++;userLiked=true;btn.classList.add('liked');
    btn.style.transform='scale(1.3)';
    setTimeout(()=>btn.style.transform='',300);
  } else {
    likes=Math.max(0,likes-1);userLiked=false;btn.classList.remove('liked');
  }
  cnt.textContent=likes;
  try{localStorage.setItem('jvr_likes',likes);localStorage.setItem('jvr_user_liked',userLiked);}catch(e){}
}

// ═══ TABLET CODE SWITCHER ═══
const tabletFileNames={
  python:'joao_vitor.py',
  cpp:'arduino_sketch.ino',
  html:'index.html',
  css:'style.css',
  js:'app.js',
  git:'.git/COMMIT_EDITMSG'
};
function switchTabletCode(id,btn){
  document.querySelectorAll('.tablet-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.tablet-tab').forEach(t=>t.classList.remove('active'));
  const panel=document.getElementById('tpanel-'+id);
  if(panel) panel.classList.add('active');
  btn.classList.add('active');
  document.getElementById('tabletFileName').textContent=tabletFileNames[id]||'';
}

// ═══ TABLET SCROLL ANIMATION ═══
const tabletScrollContainer=document.getElementById('tabletScrollContainer');
const tabletAnimHeader=document.getElementById('tabletAnimHeader');
const tabletAnimCard=document.getElementById('tabletAnimCard');

let isTabletMobile=window.innerWidth<=768;
window.addEventListener('resize',()=>{
  isTabletMobile=window.innerWidth<=768;
  updateTabletAnimation();
});

function lerpTablet(start,end,factor){
  return start+(end-start)*factor;
}

function updateTabletAnimation(){
  if(!tabletScrollContainer) return;
  const rect=tabletScrollContainer.getBoundingClientRect();
  const containerHeight=tabletScrollContainer.offsetHeight;
  const windowHeight=window.innerHeight;
  const endOffset=containerHeight-windowHeight;

  // progresso de 0 (topo chegou à viewport) → 1 (scroll completo)
  let progress=(0-rect.top)/endOffset;
  progress=Math.min(Math.max(progress,0),1);

  // Rotação: 22deg → 0deg
  const currentRotate=lerpTablet(22,0,progress);

  // Escala: mobile 0.72→0.92, desktop 1.06→1
  const scaleStart=isTabletMobile?0.72:1.06;
  const scaleEnd=isTabletMobile?0.92:1;
  const currentScale=lerpTablet(scaleStart,scaleEnd,progress);

  // Translação vertical do header: 0px → -110px
  const currentHeaderTranslate=lerpTablet(0,-110,progress);

  // Opacidade do header: sobe de 0.4 até 1 no primeiro terço, depois desce
  let headerOpacity;
  if(progress<0.3){
    headerOpacity=lerpTablet(0.4,1,progress/0.3);
  } else {
    headerOpacity=lerpTablet(1,0.15,(progress-0.3)/0.7);
  }

  // Aplica transformações
  tabletAnimCard.style.transform=`
    perspective(1200px)
    rotateX(${currentRotate}deg)
    scale(${currentScale})
  `;
  tabletAnimHeader.style.transform=`translateY(${currentHeaderTranslate}px)`;
  tabletAnimHeader.style.opacity=headerOpacity;
}

// Loop de animação com rAF
let tabletTicking=false;
window.addEventListener('scroll',()=>{
  if(!tabletTicking){
    window.requestAnimationFrame(()=>{
      updateTabletAnimation();
      tabletTicking=false;
    });
    tabletTicking=true;
  }
});
// Chamada inicial
updateTabletAnimation();
