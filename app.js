

/* Tiny helpers */
const qs = (s, el=document) => el.querySelector(s);
const qsa = (s, el=document) => [...el.querySelectorAll(s)];
const on = (el, ev, fn) => { if(el) el.addEventListener(ev, fn); };
const save = (k,v)=>localStorage.setItem(k, JSON.stringify(v));
const load = (k, d=null)=>JSON.parse(localStorage.getItem(k)||JSON.stringify(d));

/* Nav burger */
on(window,'DOMContentLoaded', () => {
  const burger = qs('#burger');
  const menu = qs('#menu');
  if(burger && menu){
    on(burger,'click', ()=> menu.classList.toggle('open'));
    qsa('#menu a').forEach(a=> on(a,'click', ()=> menu.classList.remove('open')));
  }

  /* Scroll reveal */
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target);} });
  }, {threshold:.2});
  qsa('.reveal').forEach(el=> io.observe(el));

  /* Footer newsletter */
  const newsForm = qs('#newsletter-form');
  if(newsForm){
    on(newsForm,'submit', e=>{
      e.preventDefault();
      const email = qs('[name=email]', newsForm).value.trim();
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        alert('Please enter a valid email');
        return;
      }
      const list = load('gb_news', []);
      list.push({email, at: Date.now()});
      save('gb_news', list);
      newsForm.reset();
      qs('#newsletter-msg').textContent = 'Thanks! You are subscribed.';
    });
  }
});

/* Home page features */
function initHome(){
  const slogans = [
    'Eat fresh. Live bright.',
    'Small bites, big health.',
    'Move daily. Breathe deeply.',
    'Nourish the body, calm the mind.'
  ];
  let i = 0;
  const slot = qs('#slogan');
  if(slot){
    slot.textContent = slogans[0];
    setInterval(()=>{ i=(i+1)%slogans.length; slot.textContent=slogans[i]; }, 3000);
  }

  const tips = [
    'Start your day with a glass of water.',
    'Add a green to every plate.',
    'Stand up and stretch every hour.',
    'Swap sugary drinks for infused water.',
    'Aim for 7–8 hours of sleep.'
  ];
  const tip = tips[new Date().getDate() % tips.length];
  const tipEl = qs('#tip');
  if(tipEl) tipEl.textContent = tip;
}

/* Calculator */
function initCalc(){
  const form = qs('#calc-form');
  if(!form) return;
  on(form,'submit', e=>{
    e.preventDefault();
    // Debug: log form values
    console.log('Form values:', {
      age: form.age.value,
      gender: form.gender.value,
      height: form.height.value,
      weight: form.weight.value,
      activity: form.activity.value
    });
    const age = +form.age.value, h = +form.height.value, w = +form.weight.value;
    const g = form.gender.value;
    const factor = +form.activity.value;
    if(!age||!h||!w||!g||!factor){
      alert('Please complete all fields');
      return;
    }
    // Calculation
    let bmr, tdee, carbs, protein, fat;
    if(g==='male'){
      bmr = 10*w + 6.25*h - 5*age + 5;
    }else{
      bmr = 10*w + 6.25*h - 5*age - 161;
    }
    tdee = bmr * factor;
    carbs = (tdee*0.50)/4;
    protein = (tdee*0.20)/4;
    fat = (tdee*0.30)/9;
    // Debug: log results
    console.log('Results:', {bmr, tdee, carbs, protein, fat});
    // Output
    if(qs('#bmr')) qs('#bmr').textContent = Math.round(bmr);
    if(qs('#tdee')) qs('#tdee').textContent = Math.round(tdee);
    if(qs('#carbG')) qs('#carbG').textContent = Math.round(carbs);
    if(qs('#proteinG')) qs('#proteinG').textContent = Math.round(protein);
    if(qs('#fatG')) qs('#fatG').textContent = Math.round(fat);
    const total = carbs+protein+fat;
    if(qs('#pCarb')) qs('#pCarb').style.width = (carbs/total*100).toFixed(1)+'%';
    if(qs('#pProt')) qs('#pProt').style.width = (protein/total*100).toFixed(1)+'%';
    if(qs('#pFat')) qs('#pFat').style.width = (fat/total*100).toFixed(1)+'%';
  });
}

/* Workouts */
function initWorkouts(){
  if(!qs('#workout-form')) return;
  const db = window.workoutsDB || [];
  const out = qs('#plan');
  const timerEl = qs('#wk-timer');
  const startBtn = qs('#start-timer');

  on(qs('#workout-form'),'submit', e=>{
    e.preventDefault();
    const body = qs('#body').value;
    const eq = qs('#equip').value;
    const candidates = db.filter(w => (body==='any'||w.body===body) && (eq==='any'||w.equip===eq));
    if(!candidates.length) return out.textContent = 'No workouts found.';
    const pick = () => candidates[Math.floor(Math.random()*candidates.length)];
    const plan = [pick(), pick(), pick(), pick(), pick()];
    out.innerHTML = plan.map((w,i)=>`<li><b>${w.name}</b> – ${w.time}s (${w.body}, ${w.equip})</li>`).join('');
    save('gb_last_plan', plan);
  });

  /* Simple countdown with a soft beep using WebAudio */
  let countdown, timeLeft = 0, ctx;
  function beep(){
    try{
      ctx = ctx || new (window.AudioContext||window.webkitAudioContext)();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type='sine'; o.frequency.value = 880;
      g.gain.setValueAtTime(0.001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.21);
    }catch(e){}
  }
  on(startBtn,'click', ()=>{
    const times = qsa('#plan li').map(li=>{
      const m = li.textContent.match(/(\d+)s/); return m?+m[1]:30;
    });
    if(!times.length){ alert('Generate a plan first.'); return; }
    let i=0;
    const next = ()=>{
      timeLeft = times[i];
      timerEl.textContent = `Exercise ${i+1}/${times.length}: ${timeLeft}s`;
      beep();
      countdown = setInterval(()=>{
        timeLeft--; timerEl.textContent = `Exercise ${i+1}/${times.length}: ${timeLeft}s`;
        if(timeLeft<=0){ clearInterval(countdown); i++; if(i<times.length) next(); else { timerEl.textContent='Done!'; beep(); }}
      }, 1000);
    };
    clearInterval(countdown); next();
  });
}

// Ambient sound player for mindfulness page
const ambientSounds = {
  rain: 'Rain.mp3' 
};

let currentAudio = null;
function playAmbient(key) {
  if(currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; currentAudio = null; }
  const src = ambientSounds[key];
  if(src) {
    currentAudio = new Audio(src);
    currentAudio.loop = true;
    currentAudio.volume = 0.5;
    currentAudio.play();
    // Mark button active
    qsa('.sound-btn').forEach(btn => btn.classList.remove('active'));
    const btn = qs(`#sound-${key}`);
    if(btn) btn.classList.add('active');
  }
}
function stopAmbient() {
  if(currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; currentAudio = null; }
  qsa('.sound-btn').forEach(btn => btn.classList.remove('active'));
}

on(window, 'DOMContentLoaded', () => {
  if(qs('#mind-page')) {
    on(qs('#sound-rain'), 'click', () => playAmbient('rain'));
    // Stop sound if user leaves page
    window.addEventListener('beforeunload', stopAmbient);
  }
});
  /* Mindfulness page logic */
  function initMind(){
    if(!qs('#mind-page')) return;
    const timerEl = qs('#mind-timer');
    const startBtn = qs('#startMind');
    const stopBtn = qs('#stopMind');
    const resetBtn = qs('#resetMind');
    let timer = null, time = 300, running = false;
    function update(){
      const m = Math.floor(time/60).toString().padStart(2,'0');
      const s = (time%60).toString().padStart(2,'0');
      if(timerEl) timerEl.textContent = `${m}:${s}`;
    }
    function tick(){
      if(time>0){ time--; update(); }
      else{ clearInterval(timer); running=false; timer=null; }
    }
    on(startBtn,'click',()=>{
      if(running) return;
      running=true;
      timer = setInterval(tick,1000);
    });
    on(stopBtn,'click',()=>{
      running=false;
      clearInterval(timer); timer=null;
    });
    on(resetBtn,'click',()=>{
      running=false;
      clearInterval(timer); timer=null; time=300; update();
    });
    update();
    // Session counter
    let sessions = load('gb_sessions',0) || 0;
    function completeSession(){
      sessions++;
      save('gb_sessions',sessions);
      const sessionsEl = qs('#sessions');
      if(sessionsEl) sessionsEl.textContent = sessions;
    }
    // Mark session complete when timer hits 0
    setInterval(()=>{ if(time===0 && running){ completeSession(); running=false; } },1000);
  }

/* Contact */
function initContact(){
  const form = qs('#contact-form');
  if(!form) return;
  on(form,'submit', e=>{
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const msg = form.message.value.trim();
    if(name.length<2) return alert('Please enter your full name.');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert('Please enter a valid email.');
    if(msg.length<10) return alert('Message should be at least 10 characters.');
    const store = load('gb_feedback', []);
    store.push({name,email,msg,at:Date.now()});
    save('gb_feedback', store);
    qs('#confirm').textContent = 'Thanks! Your message has been saved locally.';
    form.reset();
  });
}

/* PWA service worker register */
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('/sw.js').catch(()=>{});
  });
}

/* Page initializers */
window.addEventListener('DOMContentLoaded', ()=>{
  if(qs('#home-page')) initHome();
  initCalc(); initWorkouts(); initMind(); initContact(); initRecipes();
});
