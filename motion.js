/* Movimiento ambiental recuperado de la presentación original. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const canvas = document.createElement('canvas');
  canvas.id = 'ambient-canvas'; canvas.setAttribute('aria-hidden', 'true');
  const progress = document.createElement('div');
  progress.id = 'scroll-progress'; progress.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas, progress);
  const ctx = canvas.getContext('2d');
  const hero = document.querySelector('.hero');
  const can = hero.querySelector('img');
  const stage = document.createElement('div'); stage.className = 'hero-motion-stage';
  can.before(stage); stage.append(can);
  const halo = document.createElement('div'); halo.className = 'hero-orb';
  halo.setAttribute('aria-hidden', 'true');stage.prepend(halo);
  const toggle = document.createElement('button'); toggle.id = 'motion-toggle';
  toggle.type = 'button'; toggle.textContent = 'Pausar efectos'; toggle.setAttribute('aria-pressed','false');
  document.querySelector('header').append(toggle);
  let paused = false, frame = 0, previous = 0, width = 0, height = 0;
  let pointer = {x:0,y:0}, current = {x:0,y:0};
  const particles = Array.from({length:48},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.8+.5,speed:Math.random()*.012+.004,drift:(Math.random()-.5)*.008,color:Math.random()>.5?'4,189,251':'138,79,255'}));
  const enabled = () => !paused && !reduced.matches;
  function resize(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;canvas.style.width=width+'px';canvas.style.height=height+'px';ctx?.setTransform(dpr,0,0,dpr,0,0);}
  function draw(now){frame=0;if(!enabled()||document.hidden)return;const dt=Math.min((now-previous)/1000,.04);previous=now;
    ctx?.clearRect(0,0,width,height);
    if(ctx){particles.slice(0,width<700?24:48).forEach(p=>{p.y=(p.y-p.speed*dt+1)%1;p.x=(p.x+p.drift*dt+1)%1;ctx.beginPath();ctx.arc(p.x*width,p.y*height,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(${p.color},.38)`;ctx.fill();});}
    current.x+=(pointer.x-current.x)*.06;current.y+=(pointer.y-current.y)*.06;
    stage.style.setProperty('--pointer-x',current.x+'px');stage.style.setProperty('--pointer-y',current.y+'px');
    frame=requestAnimationFrame(draw);
  }
  function sync(){document.body.classList.toggle('motion-off',!enabled());toggle.textContent=enabled()?'Pausar efectos':'Activar efectos';toggle.setAttribute('aria-pressed',String(!enabled()));toggle.disabled=reduced.matches; if(reduced.matches)toggle.textContent='Movimiento reducido';cancelAnimationFrame(frame);frame=0;if(enabled()&&!document.hidden){previous=performance.now();frame=requestAnimationFrame(draw);}else{ctx?.clearRect(0,0,width,height);stage.style.setProperty('--pointer-x','0px');stage.style.setProperty('--pointer-y','0px');}}
  toggle.addEventListener('click',()=>{paused=!paused;sync();});reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);addEventListener('resize',resize,{passive:true});
  hero.addEventListener('pointermove',e=>{if(!finePointer.matches||!enabled())return;const box=hero.getBoundingClientRect();pointer={x:((e.clientX-box.left)/box.width-.5)*24,y:((e.clientY-box.top)/box.height-.5)*18};});hero.addEventListener('pointerleave',()=>{pointer={x:0,y:0};});
  function scroll(){const available=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${available>0?scrollY/available:0})`;}
  addEventListener('scroll',scroll,{passive:true});scroll();resize();sync();
  const targets=document.querySelectorAll('section:not(.hero) > h2,section:not(.hero) > .lead,.cards > article,.arc > article,.timeline > article,.symbol,.split,.route');
  const reveal = new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');reveal.unobserve(e.target);}}),{threshold:.08});
  targets.forEach((el,i)=>{el.classList.add('motion-reveal');el.style.setProperty('--reveal-delay',(i%3)*75+'ms');reveal.observe(el);});
  document.querySelectorAll('.cards article,.media-slot').forEach(card=>{
    card.addEventListener('pointermove',e=>{if(!finePointer.matches||!enabled())return;const r=card.getBoundingClientRect();card.style.setProperty('--glow-x',(e.clientX-r.left)+'px');card.style.setProperty('--glow-y',(e.clientY-r.top)+'px');});
  });
})();
