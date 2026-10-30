/* ==========================================================================
   CABRALES FOCUS — LÓGICA INTERACTIVA, SIMULADORES TRANSMEDIA & ANIMACIONES
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------------
     1. BARRA DE PROGRESO DE SCROLL, REVEAL & NAVEGACIÓN ACTIVA
     ------------------------------------------------------------------------ */
  const progressBar = document.getElementById('scroll-progress');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = `${pct}%`;

    // Active section highlight
    let currentId = 'inicio';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 160;
      if (scrollTop >= top) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  });

  /* ------------------------------------------------------------------------
     2. PARALLAX DE LA LATA HERO 3D AL MOVER EL MOUSE
     ------------------------------------------------------------------------ */
  const heroCan = document.getElementById('hero-can-parallax');
  if (heroCan) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 16;
      const y = (e.clientY / window.innerHeight - 0.5) * 16;
      heroCan.style.transform = `translate3d(${x}px, ${y}px, 0) rotateY(${x * 0.6}deg)`;
    });
  }

  /* ------------------------------------------------------------------------
     3. PARTÍCULAS AMBIENTALES (CONDENSACIÓN FRÍA & SINAPSIS CIAN/VIOLETA)
     ------------------------------------------------------------------------ */
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 48 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.2 + 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -Math.random() * 0.45 - 0.1,
      color: Math.random() > 0.5 ? 'rgba(4, 189, 251, 0.45)' : 'rgba(138, 79, 255, 0.45)',
    }));

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  /* ------------------------------------------------------------------------
     4. EFECTO SONORO SINTETIZADO (WEB AUDIO API) "*Pssshhh* + Onda Alfa"
     ------------------------------------------------------------------------ */
  function playCanOpenAndCalmChord() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const actx = new AudioCtx();
      const now = actx.currentTime;

      // 1) Ruido blanco corto del gas al abrir la lata (*Pssshhh*)
      const bufferSize = actx.sampleRate * 0.38;
      const noiseBuffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (actx.sampleRate * 0.12));
      }
      const whiteNoise = actx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const bandpass = actx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(3200, now);

      const noiseGain = actx.createGain();
      noiseGain.gain.setValueAtTime(0.35, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.36);

      whiteNoise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(actx.destination);
      whiteNoise.start(now);

      // 2) Acorde sereno de "Calm Focus" (Ondas Alfa)
      [220, 277.18, 329.63, 440].forEach((freq, idx) => {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + 0.15);

        gain.gain.setValueAtTime(0.001, now + 0.15);
        gain.gain.linearRampToValueAtTime(0.06 / (idx + 1), now + 0.45);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + 2.4);

        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start(now + 0.15);
        osc.stop(now + 2.45);
      });
    } catch (e) {
      // Si el navegador bloquea audio sin gesto previo, continúa visualmente
    }
  }

  /* ------------------------------------------------------------------------
     5. TABS DE INVESTIGACIÓN (ENCUESTA VS GOOGLE TRENDS)
     ------------------------------------------------------------------------ */
  const researchBtns = document.querySelectorAll('[data-research-tab]');
  researchBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      researchBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-research-tab');
      document.getElementById('panel-encuesta').classList.toggle('active', target === 'encuesta');
      document.getElementById('panel-trends').classList.toggle('active', target === 'trends');
    });
  });

  /* ------------------------------------------------------------------------
     6. HOTSPOTS INTERACTIVOS DE LA LATA CABRALES FOCUS
     ------------------------------------------------------------------------ */
  const hotspotBtns = document.querySelectorAll('.hotspot-btn');
  const hotspotCards = document.querySelectorAll('.hotspot-card');

  function activateHotspot(id) {
    hotspotBtns.forEach((b) => b.classList.toggle('active', b.getAttribute('data-hotspot') === id));
    hotspotCards.forEach((c) => c.classList.toggle('active', c.getAttribute('data-hotspot') === id));
  }

  hotspotBtns.forEach((b) => b.addEventListener('click', () => activateHotspot(b.getAttribute('data-hotspot'))));
  hotspotCards.forEach((c) => c.addEventListener('click', () => activateHotspot(c.getAttribute('data-hotspot'))));

  /* ------------------------------------------------------------------------
     7. SIMULADOR EN VIVO DE "LOS 5 SEGUNDOS & ZOOM IN DEL BÚHO"
     ------------------------------------------------------------------------ */
  const fiveSecBox = document.getElementById('five-sec-box');
  const fiveSecStatus = document.getElementById('five-sec-status-text');
  const noiseChipsContainer = document.getElementById('noise-chips-container');
  const fiveSecTimer = document.getElementById('five-sec-timer');
  const btnRun5Sec = document.getElementById('btn-run-5sec');
  const btnReset5Sec = document.getElementById('btn-reset-5sec');
  const btnTop5Sec = document.getElementById('trigger-5sec-top');
  let fiveSecInterval = null;

  function triggerFiveSecondsExperience() {
    playCanOpenAndCalmChord();
    if (!fiveSecBox) return;

    clearInterval(fiveSecInterval);
    let remaining = 5.0;
    fiveSecBox.classList.add('calm-active');

    fiveSecStatus.innerHTML =
      'Estado actual: <strong style="color: var(--cyan);">*Pssshhh* · CALM FOCUS ACTIVADO</strong> — La L-Teanina + Cold Brew silencian el ruido mental.';
    noiseChipsContainer.innerHTML = `
      <span class="noise-chip">✅ Pulso Firme (0% Taquicardia)</span>
      <span class="noise-chip">✅ Sinapsis Cian/Violeta Activa</span>
      <span class="noise-chip">✅ Ondas Alfa (100mg L-Teanina)</span>
      <span class="noise-chip">✅ Visión del Búho: Precisión Total</span>
    `;

    fiveSecInterval = setInterval(() => {
      remaining = Math.max(0, remaining - 0.05);
      fiveSecTimer.textContent = `0${remaining.toFixed(2)} s · FOCO EN EJE`;
      if (remaining <= 0) {
        clearInterval(fiveSecInterval);
        fiveSecTimer.textContent = '🦉 PRECISIÓN QUE SE TOMA';
      }
    }, 50);
  }

  function resetFiveSecondsExperience() {
    clearInterval(fiveSecInterval);
    if (!fiveSecBox) return;
    fiveSecBox.classList.remove('calm-active');
    fiveSecStatus.innerHTML =
      'Estado actual: <strong>RUIDO MENTAL ACTIVO</strong> — Exceso de pestañas abiertas, fatiga visual y dispersión cognitiva.';
    noiseChipsContainer.innerHTML = `
      <span class="noise-chip">⚠️ 42 Pestañas Abiertas</span>
      <span class="noise-chip">⚠️ Error de Compilación (02:14 AM)</span>
      <span class="noise-chip">⚠️ Ronda 12-12 en Overtime</span>
      <span class="noise-chip">⚠️ Niebla Mental Post-Almuerzo</span>
    `;
    fiveSecTimer.textContent = '05.00 s';
  }

  if (btnRun5Sec) btnRun5Sec.addEventListener('click', triggerFiveSecondsExperience);
  if (btnReset5Sec) btnReset5Sec.addEventListener('click', resetFiveSecondsExperience);
  if (btnTop5Sec) {
    btnTop5Sec.addEventListener('click', () => {
      document.getElementById('universo').scrollIntoView({ behavior: 'smooth' });
      setTimeout(triggerFiveSecondsExperience, 450);
    });
  }

  /* ------------------------------------------------------------------------
     8. LABORATORIO TRANSMEDIA (TABS DE LOS 6 MÓDULOS)
     ------------------------------------------------------------------------ */
  const labTabs = document.querySelectorAll('.lab-tab');
  const labPanes = document.querySelectorAll('.lab-pane');

  labTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      labTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-lab');
      labPanes.forEach((pane) => {
        pane.classList.toggle('active', pane.id === `lab-${target}`);
      });
    });
  });

  /* Inspector del Perfil de Instagram @cabralesfocus */
  const igTiles = document.querySelectorAll('.ig-post-tile');
  const igHighlights = document.querySelectorAll('.ig-hl-item');
  const igPreviewTitle = document.getElementById('ig-preview-title');
  const igPreviewCopy = document.getElementById('ig-preview-copy');

  igTiles.forEach((tile) => {
    tile.addEventListener('click', () => {
      igPreviewTitle.textContent = tile.getAttribute('data-post-title');
      igPreviewCopy.textContent = tile.getAttribute('data-post-copy');
    });
  });

  igHighlights.forEach((hl) => {
    hl.addEventListener('click', () => {
      igPreviewTitle.textContent = `Historia Destacada: ${hl.innerText.trim()}`;
      igPreviewCopy.textContent = hl.getAttribute('data-hl');
    });
  });

  /* ------------------------------------------------------------------------
     9. SIMULADOR INTERACTIVO DE INSTAGRAM STORIES (DIAGNÓSTICO DE RUIDO)
     ------------------------------------------------------------------------ */
  const storyBody = document.getElementById('story-dynamic-body');
  const storyStepIndicator = document.getElementById('story-step-indicator');
  const sbar1 = document.getElementById('sbar-1');
  const sbar2 = document.getElementById('sbar-2');
  const sbar3 = document.getElementById('sbar-3');
  const btnRestartStory = document.getElementById('btn-restart-story');

  function renderStoryStep1() {
    if (!storyBody) return;
    sbar1.classList.add('filled');
    sbar2.classList.remove('filled');
    sbar3.classList.remove('filled');
    storyStepIndicator.textContent = 'Story 1/3 · Encuesta';

    storyBody.innerHTML = `
      <div style="text-align: center; margin-bottom: 12px;">
        <span style="font-size: 0.7rem; color: var(--cyan); font-weight: 800; letter-spacing: 0.08em;">TEST INTERACTIVO DEL BÚHO</span>
        <h4 style="font-family: var(--font-heading); font-size: 1.12rem; margin-top: 4px;">
          ¿QUÉ RUIDO TE ESTÁ QUEMANDO LA CABEZA HOY?
        </h4>
      </div>
      <button class="story-option-btn" data-branch="bruno">
        💻 1. Código que no compila / Estudio a las 02:00 AM
      </button>
      <button class="story-option-btn" data-branch="solange">
        📊 2. 40 pestañas abiertas y entrega a las 15:30 hs
      </button>
      <button class="story-option-btn" data-branch="bruno">
        🎮 3. Rondas perdidas en Overtime por falta de reflejos
      </button>
    `;

    storyBody.querySelectorAll('.story-option-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        renderStoryStep2(btn.getAttribute('data-branch'));
      });
    });
  }

  function renderStoryStep2(branch) {
    sbar2.classList.add('filled');
    storyStepIndicator.textContent = 'Story 2/3 · Diagnóstico';

    const isBruno = branch === 'bruno';
    storyBody.innerHTML = `
      <div style="text-align: center;">
        <span style="display: inline-block; padding: 4px 10px; border-radius: 99px; background: rgba(138,79,255,0.22); color: #d6bcfa; font-size: 0.7rem; font-weight: 800; margin-bottom: 8px;">
          ${isBruno ? '🦉 RESULTADO: PERFIL NOCTURNO (MODO BRUNO)' : '☀️ RESULTADO: PERFIL ANALÍTICO (MODO SOLANGE)'}
        </span>
        <h4 style="font-family: var(--font-heading); font-size: 1.08rem; margin-bottom: 8px;">
          ${isBruno ? 'Tu enemigo no es el sueño: es el temblor del azúcar.' : 'Tu cerebro no pide más café caliente: pide claridad fría.'}
        </h4>
        <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 14px;">
          ${
            isBruno
              ? 'Receta del Búho: Cabrales Focus frío a 6°C. 100mg de L-Teanina para sostener el aim y la lógica sin taquicardia.'
              : 'Receta del Búho: Cold Brew con leche de coco y 0% azúcar. Liviano, plant-based y 4 horas de foco limpio.'
          }
        </p>
        <button class="btn-primary" id="story-to-step3" style="width: 100%; justify-content: center; padding: 10px; font-size: 0.8rem;">
          🥫 Ver mi Lata + Playlist Recomendada ➔
        </button>
      </div>
    `;

    document.getElementById('story-to-step3').addEventListener('click', () => renderStoryStep3(isBruno));
  }

  function renderStoryStep3(isBruno) {
    sbar3.classList.add('filled');
    storyStepIndicator.textContent = 'Story 3/3 · Conversión';
    playCanOpenAndCalmChord();

    storyBody.innerHTML = `
      <div style="text-align: center;">
        <img src="assets/can_hero.png" alt="Cabrales Focus" style="height: 155px; width: auto; margin: 0 auto 10px; filter: drop-shadow(0 0 16px rgba(4,189,251,0.4));" />
        <h4 style="font-family: var(--font-heading); font-size: 1.05rem;">PRECISIÓN QUE SE TOMA</h4>
        <p style="font-size: 0.76rem; color: var(--text-secondary); margin: 4px 0 12px;">
          Tu sesión de 25 minutos sin ruido está lista en el Hub.
        </p>
        <button class="story-option-btn" id="story-open-hub" style="text-align: center; background: var(--grad-focus); color: #090303; font-weight: 800;">
          🔗 ${isBruno ? '🎧 ABRIR PLAYLIST MODO CLUTCH + POMODORO' : '🎧 ABRIR PLAYLIST MODO DEEP WORK + POMODORO'}
        </button>
      </div>
    `;

    document.getElementById('story-open-hub').addEventListener('click', () => {
      document.querySelector('[data-lab="hub"]').click();
    });
  }

  renderStoryStep1();
  if (btnRestartStory) btnRestartStory.addEventListener('click', renderStoryStep1);

  /* ------------------------------------------------------------------------
     10. CARRUSEL INTERACTIVO DE 5 SLIDES (L-TEANINA VS ENERGIZANTES)
     ------------------------------------------------------------------------ */
  const carouselSlides = [
    {
      tag: 'SLIDE 1 DE 5 · PORTADA DE IMPACTO',
      html: `
        <div style="display: grid; grid-template-columns: 1fr 180px; gap: 20px; align-items: center;">
          <div>
            <span style="color: #ff8080; font-size: 0.76rem; font-weight: 800;">MITO VS. NEUROCIENCIA</span>
            <h3 style="font-family: var(--font-heading); font-size: 1.65rem; line-height: 1.15; margin: 8px 0 12px;">
              POR QUÉ EL EXCESO DE AZÚCAR TE HACE PERDER LA PARTIDA (Y EL PARCIAL)
            </h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">
              Confundimos estar acelerados con estar enfocados. Deslizá para entender cómo funciona la fórmula <strong>Calm Focus</strong> de Cabrales Focus 👉
            </p>
          </div>
          <div style="text-align: center;">
            <img src="assets/can_hero.png" alt="Cabrales Focus" style="height: 240px; width: auto;" />
          </div>
        </div>
      `,
    },
    {
      tag: 'SLIDE 2 DE 5 · LA TRAMPA DEL PICO Y CRASH',
      html: `
        <div>
          <h4 style="font-family: var(--font-heading); font-size: 1.35rem; margin-bottom: 8px;">
            Curva de Estimulación: Energizante Tradicional vs. Cabrales Focus
          </h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 14px;">
            Los energizantes azucarados disparan la insulina y el cortisol (línea roja) provocando un desplome a los 45 minutos. <strong>Cabrales Focus</strong> sostiene ondas Alfa estables durante 4 horas (curva cian-violeta).
          </p>
          <svg viewBox="0 0 600 190" style="width: 100%; height: auto; background: rgba(255,255,255,0.02); border-radius: 14px; padding: 10px; border: 1px solid rgba(255,255,255,0.08);">
            <defs>
              <linearGradient id="focusGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#04bdfb" />
                <stop offset="100%" stop-color="#8a4fff" />
              </linearGradient>
            </defs>
            <!-- Línea Base -->
            <line x1="40" y1="150" x2="570" y2="150" stroke="rgba(255,255,255,0.18)" stroke-dasharray="4" />
            <!-- Curva Roja: Pico y Crash -->
            <path d="M 40 150 Q 110 15, 160 35 T 260 175 L 560 178" fill="none" stroke="#ff5252" stroke-width="3.5" />
            <text x="125" y="26" fill="#ff8080" font-size="11" font-weight="bold">Pico + Taquicardia (30m)</text>
            <text x="265" y="168" fill="#ff8080" font-size="11" font-weight="bold">Crash & Fatiga (60m)</text>
            <!-- Curva Cian-Violeta: Calm Focus -->
            <path d="M 40 150 C 110 65, 220 58, 380 62 C 470 65, 530 85, 565 110" fill="none" stroke="url(#focusGrad)" stroke-width="4.5" />
            <text x="270" y="48" fill="#04bdfb" font-size="12" font-weight="bold">Cabrales Focus: 4 Horas de Calm Focus Sostenido</text>
          </svg>
        </div>
      `,
    },
    {
      tag: 'SLIDE 3 DE 5 · LA SINERGIA: CAFEÍNA + 100 MG L-TEANINA',
      html: `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 18px;">
          <div style="padding: 18px; border-radius: 16px; background: rgba(4,189,251,0.08); border: 1px solid rgba(4,189,251,0.3);">
            <strong style="color: var(--cyan); font-size: 0.95rem;">☕ Extracto Cold Brew Cabrales</strong>
            <p style="font-size: 0.84rem; color: var(--text-secondary); margin-top: 6px;">
              Macerado en frío durante 16 horas. Menos acidez estomacal y liberación progresiva de cafeína natural que activa la atención ejecutiva.
            </p>
          </div>
          <div style="padding: 18px; border-radius: 16px; background: rgba(138,79,255,0.1); border: 1px solid rgba(138,79,255,0.35);">
            <strong style="color: #d6bcfa; font-size: 0.95rem;">🧠 100 mg de L-Teanina Pura</strong>
            <p style="font-size: 0.84rem; color: var(--text-secondary); margin-top: 6px;">
              Aminoácido natural que estimula las ondas cerebrales Alfa: actúa como un “amortiguador” neuronal que bloquea la ansiedad y el temblor de manos.
            </p>
          </div>
        </div>
      `,
    },
    {
      tag: 'SLIDE 4 DE 5 · BASE PLANT-BASED & 0% AZÚCAR',
      html: `
        <div>
          <h4 style="font-family: var(--font-heading); font-size: 1.35rem; margin-bottom: 10px;">
            Diseñado para no pesarte a las 2:00 AM ni a las 15:00 hs
          </h4>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 14px;">
            <div style="padding: 16px; border-radius: 14px; background: rgba(255,255,255,0.04);">
              <strong style="color: var(--cyan);">🥥 Leche de Coco</strong>
              <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">Textura sedosa, 100% libre de lactosa y de digestión ligera.</p>
            </div>
            <div style="padding: 16px; border-radius: 14px; background: rgba(255,255,255,0.04);">
              <strong style="color: #b794f4;">⚡ 0% Azúcar Agregada</strong>
              <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">Sin calorías vacías ni picos de insulina que den sueño después.</p>
            </div>
            <div style="padding: 16px; border-radius: 14px; background: rgba(255,255,255,0.04);">
              <strong style="color: var(--white);">🥫 Lata Slim 240 ml</strong>
              <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">Aluminio 100% reciclable que enfría en minutos y cabe en tu setup.</p>
            </div>
          </div>
        </div>
      `,
    },
    {
      tag: 'SLIDE 5 DE 5 · CALL TO ACTION TRANSMEDIA',
      html: `
        <div style="text-align: center;">
          <img src="assets/owl_mascot.png" alt="El Búho" style="width: 68px; height: 68px; margin-bottom: 10px;" />
          <h3 style="font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 8px;">
            GUARDÁ ESTE POST PARA TU PRÓXIMA NOCHE DE ENTREGA
          </h3>
          <p style="font-size: 0.88rem; color: var(--text-secondary); max-width: 520px; margin: 0 auto 14px;">
            Entrá al link de nuestra bio (<code>cabrales.com.ar/focus</code>) y activá el temporizador Pomodoro de 25 minutos junto a las playlists oficiales.
          </p>
          <span class="stage-pill">🦉 Cabrales Focus · Precisión que se toma</span>
        </div>
      `,
    },
  ];

  let currentSlideIdx = 0;
  const slideTagEl = document.getElementById('carousel-slide-tag');
  const slideContentEl = document.getElementById('carousel-slide-content');
  const slideDotsEl = document.getElementById('carousel-dots');
  const btnPrevSlide = document.getElementById('carousel-prev');
  const btnNextSlide = document.getElementById('carousel-next');

  function renderCarouselSlide(idx) {
    currentSlideIdx = (idx + carouselSlides.length) % carouselSlides.length;
    if (slideTagEl) slideTagEl.textContent = carouselSlides[currentSlideIdx].tag;
    if (slideContentEl) slideContentEl.innerHTML = carouselSlides[currentSlideIdx].html;
    if (slideDotsEl) {
      slideDotsEl.innerHTML = carouselSlides
        .map(
          (_, i) =>
            `<span style="width: ${i === currentSlideIdx ? '24px' : '8px'}; height: 8px; border-radius: 99px; background: ${
              i === currentSlideIdx ? 'var(--cyan)' : 'rgba(255,255,255,0.2)'
            }; transition: all 0.25s ease; cursor: pointer;" data-dot="${i}"></span>`
        )
        .join('');
      slideDotsEl.querySelectorAll('[data-dot]').forEach((dot) => {
        dot.addEventListener('click', () => renderCarouselSlide(Number(dot.getAttribute('data-dot'))));
      });
    }
  }

  renderCarouselSlide(0);
  if (btnPrevSlide) btnPrevSlide.addEventListener('click', () => renderCarouselSlide(currentSlideIdx - 1));
  if (btnNextSlide) btnNextSlide.addEventListener('click', () => renderCarouselSlide(currentSlideIdx + 1));

  /* ------------------------------------------------------------------------
     11. HUB WEB CABRALES.COM.AR/FOCUS: RELOJ POMODORO REAL + SPOTIFY + MAPA
     ------------------------------------------------------------------------ */
  let pomoSeconds = 25 * 60;
  let pomoTimer = null;
  const pomoDisplay = document.getElementById('pomo-display');
  const btnPomoStart = document.getElementById('pomo-start');
  const btnPomoPause = document.getElementById('pomo-pause');
  const btnPomoReset = document.getElementById('pomo-reset');

  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  if (btnPomoStart) {
    btnPomoStart.addEventListener('click', () => {
      playCanOpenAndCalmChord();
      if (pomoTimer) return;
      btnPomoStart.textContent = '🔥 En Modo Focus...';
      pomoTimer = setInterval(() => {
        if (pomoSeconds > 0) {
          pomoSeconds--;
          pomoDisplay.textContent = formatTime(pomoSeconds);
        } else {
          clearInterval(pomoTimer);
          pomoTimer = null;
          btnPomoStart.textContent = '▶ Iniciar Sesión Focus';
        }
      }, 1000);
    });
  }

  if (btnPomoPause) {
    btnPomoPause.addEventListener('click', () => {
      clearInterval(pomoTimer);
      pomoTimer = null;
      if (btnPomoStart) btnPomoStart.textContent = '▶ Reanudar Focus';
    });
  }

  if (btnPomoReset) {
    btnPomoReset.addEventListener('click', () => {
      clearInterval(pomoTimer);
      pomoTimer = null;
      pomoSeconds = 25 * 60;
      if (pomoDisplay) pomoDisplay.textContent = '25:00';
      if (btnPomoStart) btnPomoStart.textContent = '▶ Iniciar Sesión Focus';
    });
  }

  // Selector de Guaridas en el Mapa del Hub
  const guaridaBtns = document.querySelectorAll('[data-guarida]');
  const guaridaInfo = document.getElementById('guarida-info');
  guaridaBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      guaridaBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      if (guaridaInfo) guaridaInfo.textContent = `📌 ${btn.getAttribute('data-guarida')}`;
    });
  });

  // Selector de Playlists de Spotify
  const playlistData = {
    clutch: {
      title: 'Modo Clutch — Pista 01: “Owl Vision (02:00 AM Mix)”',
      desc: 'Ideal para mantener el pulso firme en rondas de Overtime o sesiones de debugging nocturno.',
    },
    deepwork: {
      title: 'Modo Deep Work — Pista 01: “Alpha Waves & Cold Brew (15:00 PM)”',
      desc: 'Frecuencias minimalistas diseñadas para análisis de datos, lectura técnica y presentaciones.',
    },
    estudio: {
      title: 'Modo Estudio — Pista 01: “Guarida Silenciosa (Binaural Focus)”',
      desc: 'Acompañamiento acústico de 60 minutos sin letra para memorización y preparación de finales.',
    },
  };

  const playlistCards = document.querySelectorAll('.playlist-card');
  const nowPlayingTitle = document.getElementById('now-playing-title');
  const nowPlayingDesc = document.getElementById('now-playing-desc');

  playlistCards.forEach((card) => {
    card.addEventListener('click', () => {
      playlistCards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
      const key = card.getAttribute('data-playlist');
      if (playlistData[key]) {
        nowPlayingTitle.textContent = playlistData[key].title;
        nowPlayingDesc.textContent = playlistData[key].desc;
      }
    });
  });

  /* ------------------------------------------------------------------------
     12. GENERADOR DE CREDENCIAL DE PROSUMIDOR (#MIMODOFOCUS)
     ------------------------------------------------------------------------ */
  const ugcNameInput = document.getElementById('ugc-name-input');
  const ugcModeInput = document.getElementById('ugc-mode-input');
  const ugcGoalInput = document.getElementById('ugc-goal-input');
  const ugcPreviewName = document.getElementById('ugc-preview-name');
  const ugcPreviewMode = document.getElementById('ugc-preview-mode');
  const ugcPreviewGoal = document.getElementById('ugc-preview-goal');

  function updateUgcPreview() {
    if (ugcPreviewName && ugcNameInput) ugcPreviewName.textContent = ugcNameInput.value || 'Prosumidor_Focus';
    if (ugcPreviewMode && ugcModeInput) ugcPreviewMode.textContent = ugcModeInput.value;
    if (ugcPreviewGoal && ugcGoalInput) ugcPreviewGoal.textContent = `“${ugcGoalInput.value}”`;
  }

  if (ugcNameInput) ugcNameInput.addEventListener('input', updateUgcPreview);
  if (ugcModeInput) ugcModeInput.addEventListener('change', updateUgcPreview);
  if (ugcGoalInput) ugcGoalInput.addEventListener('input', updateUgcPreview);

  /* ------------------------------------------------------------------------
     13. FILTRO DEL CALENDARIO DE 4 SEMANAS
     ------------------------------------------------------------------------ */
  const calendarFilterBtns = document.querySelectorAll('#calendar-filters [data-week]');
  const calendarRows = document.querySelectorAll('#calendar-table tbody tr');

  calendarFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      calendarFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const week = btn.getAttribute('data-week');
      calendarRows.forEach((row) => {
        row.style.display = week === 'all' || row.getAttribute('data-week') === week ? '' : 'none';
      });
    });
  });
});
