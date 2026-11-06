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
     7. SIMULADOR EN VIVO DE "LA TRANSFORMACIÓN EN 5 SEGUNDOS & ZOOM NARRATIVO"
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
      'Estado actual (Escenas 6 a 8 · Planos 19–27): <strong style="color: var(--cyan);">PREPARACIÓN, ESCUCHA Y REVANCHA GANADA</strong> — Celular en silencio boca abajo, apertura de lata (Plano 20) y fundido con el isotipo del búho.';
    noiseChipsContainer.innerHTML = `
      <span class="noise-chip">✅ [Plano 19] Celular en silencio y lejos del mouse</span>
      <span class="noise-chip">✅ [Plano 20] Apertura limpia de lata Focus (2:23)</span>
      <span class="noise-chip">✅ [Plano 22] “Dale. Una cosa a la vez”</span>
      <span class="noise-chip">✅ [ Planos 25–27] Victoria 1v1 (“Ahora sí”) + Transición Búho</span>
    `;

    fiveSecInterval = setInterval(() => {
      remaining = Math.max(0, remaining - 0.05);
      fiveSecTimer.textContent = `0${remaining.toFixed(2)} s · PREPARACIÓN Y REVANCHA`;
      if (remaining <= 0) {
        clearInterval(fiveSecInterval);
        fiveSecTimer.textContent = '🦉 “AHORA SÍ” · PRECISIÓN QUE SE TOMA';
      }
    }, 50);
  }

  function resetFiveSecondsExperience() {
    clearInterval(fiveSecInterval);
    if (!fiveSecBox) return;
    fiveSecBox.classList.remove('calm-active');
    fiveSecStatus.innerHTML =
      'Estado actual (Escena 1 · Plano 03): <strong>RONDA 1v1 PERDIDA POR DISTRACCIÓN</strong> — Celular encendido junto al mouse, notificación entrante y mirada fuera del monitor.';
    noiseChipsContainer.innerHTML = `
      <span class="noise-chip">📱 [0:24] Notificación del celular junto al mouse</span>
      <span class="noise-chip">👀 Mirada apartada en pleno 1v1</span>
      <span class="noise-chip">💀 “Lo tenía… miré para otro lado”</span>
      <span class="noise-chip">📄 Informe de Solange interrumpido por mensajes</span>
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
     7B. CORTOMETRAJE «TURNO DE NOCHE»: REPRODUCTOR & GUION HÍBRIDO (29 PLANOS)
     ------------------------------------------------------------------------ */
  const shortfilmVideo = document.getElementById('shortfilm-video');
  const shortfilmFileInput = document.getElementById('shortfilm-file-input');
  const tcButtons = document.querySelectorAll('.tc-btn');
  const sceneTabBtns = document.querySelectorAll('.scene-tab-btn');
  const scriptSceneContent = document.getElementById('script-scene-content');

  const HYBRID_SCRIPT_SCENES = {
    1: {
      title: 'Escena 1 · La derrota (0:00 a 0:45) — Interior habitación, noche 1 (Ropa A)',
      desc: 'Bruno queda solo en la ronda (1v1). Una notificación en el celular junto al mouse le hace apartar la mirada; reacciona tarde y pierde.',
      badge: 'Planos 01 al 04',
      seek: 0,
      shots: [
        ['Plano 01', '0:00–0:10', '<strong>PG lateral:</strong> Bruno juega concentrado; el celular está junto al mouse, <strong>sin lata en el escritorio</strong>.', 'Luz de monitor y lámpara cálida rebotada; sonido de teclado mecánico y respiración.'],
        ['Plano 02', '0:10–0:22', '<strong>Captura propia de partida:</strong> situación uno contra uno (1v1) en VALORANT, manteniendo cobertura.', 'Pasos del rival en auriculares; rótulo en pantalla: <em>“Último jugador. Una oportunidad”</em>.'],
        ['Plano 03', '0:22–0:35', '<strong>PP (Primer Plano):</strong> Bruno mira el celular al encenderse y vuelve tarde la vista al monitor.', 'Sonido de notificación (<code>0:24–0:27</code>) y sonido de derrota sincronizados con la mirada.'],
        ['Plano 04', '0:35–0:45', '<strong>PM (Plano Medio):</strong> se baja los auriculares al cuello y toma el celular con frustración.', 'Voz y subtítulo (<code>0:38–0:42</code>): <em>“Lo tenía… miré para otro lado”</em>.']
      ]
    },
    2: {
      title: 'Escena 2 · El descubrimiento (0:45 a 1:15) — Interior habitación, misma noche',
      desc: 'Bruno scrollea en su teléfono, vuelve a la publicación P3 de Suga y guarda la invitación a Modo Focus en Dot Baires Shopping.',
      badge: 'Planos 05 al 08',
      seek: 45,
      shots: [
        ['Plano 05', '0:45–0:51', '<strong>PD sobre hombro:</strong> Bruno pasa dos publicaciones ficticias en el feed de su teléfono.', 'Ángulo picado suave; sonido ambiente nocturno del cuarto.'],
        ['Plano 06', '0:51–0:59', '<strong>Inserto:</strong> detiene el scroll y vuelve hacia atrás hasta la publicación <strong>P3 con Suga y la lata</strong>.', 'Captura del mockup local; entra música suave de fondo (sin voz de Suga).'],
        ['Plano 07', '0:59–1:09', '<strong>P3 a pantalla completa:</strong> invitación a <em>Modo Focus en Dot Baires Shopping</em>.', 'Texto legible en pantalla; pie: <em>“Colaboración propuesta · Simulación académica”</em>.'],
        ['Plano 08', '1:09–1:15', '<strong>PP:</strong> Bruno asiente convencido, guarda la publicación y bloquea el teléfono.', 'Voz y subtítulo (<code>1:10–1:13</code>): <em>“Mañana paso”</em>. Corte directo a día.']
      ]
    },
    3: {
      title: 'Escena 3 · La llegada (1:15 a 1:40) — Exterior y acceso de Dot Baires Shopping, día siguiente (Ropa B)',
      desc: 'Con otra remera (Ropa B), Bruno llega a Dot Baires Shopping a la luz del día, consulta la invitación guardada y cruza el acceso.',
      badge: 'Planos 09 al 11',
      seek: 75,
      shots: [
        ['Plano 09', '1:15–1:24', '<strong>PG exterior:</strong> fachada de Dot Baires Shopping; Bruno camina hacia el acceso principal.', 'Luz natural diurna; rótulo sobreimpreso: <em>“Al día siguiente”</em>.'],
        ['Plano 10', '1:24–1:32', '<strong>PM lateral:</strong> consulta la publicación P3 guardada en su celular y vuelve a guardar el teléfono en el bolsillo.', 'Sonido de ambiente urbano diurno; sin diálogo.'],
        ['Plano 11', '1:32–1:40', '<strong>PG desde atrás:</strong> Bruno cruza las puertas de entrada del shopping.', 'Sonido de pasos; puente sonoro de transición hacia el interior.']
      ]
    },
    4: {
      title: 'Escena 4 · La entrega (1:40 a 1:55) — Interior sugerido de Dot Baires Shopping',
      desc: 'Resolución de producción austera y precisa: solo dos manos en plano detalle donde una ofrece la lata cerrada y Bruno la recibe.',
      badge: 'Planos 12 al 14',
      seek: 100,
      shots: [
        ['Plano 12', '1:40–1:45', '<strong>PD (Plano Detalle):</strong> la mano de Bruno espera a izquierda de cuadro; entra una <strong>lata cerrada de Cabrales Focus</strong> desde la derecha.', 'Cámara fija apoyada; fondo interior neutro sin necesidad de montar un stand físico.'],
        ['Plano 13', '1:45–1:51', '<strong>Mismo PD continuo:</strong> Bruno recibe la lata mano a mano.', 'Ambos integrantes del equipo (Franco y Tomas) aportan una mano en cuadro; cámara fija.'],
        ['Plano 14', '1:51–1:55', '<strong>PD:</strong> Bruno gira suavemente el envase hasta que se lee con claridad <strong>Focus · Coffee Cold Brew</strong>.', 'Iluminación cuidada sin reflejo molesto; sonido sutil del roce metálico del envase.']
      ]
    },
    5: {
      title: 'Escena 5 · La salida (1:55 a 2:10) — Exterior de Dot Baires Shopping, día',
      desc: 'Bruno sale del shopping llevando la lata cerrada en la mano, la observa y regresa para preparar su noche.',
      badge: 'Planos 15 al 17',
      seek: 115,
      shots: [
        ['Plano 15', '1:55–2:01', '<strong>PG:</strong> Bruno cruza la salida hacia el exterior llevando la lata en la misma mano.', 'Luz natural diurna y ambiente exterior.'],
        ['Plano 16', '2:01–2:06', '<strong>PM:</strong> camina, mira la lata cerrada con expectativa y continúa su paso.', 'Regla de continuidad: <strong>no la abre ni bebe en la calle</strong>; cámara fija.'],
        ['Plano 17', '2:06–2:10', '<strong>PD:</strong> la lata cerrada baja junto a su cuerpo y sale de cuadro.', 'Corte por movimiento directo al escritorio nocturno.']
      ]
    },
    6: {
      title: 'Escena 6 · La preparación (2:10 a 2:45) — Interior habitación, noche del segundo día (Ropa B)',
      desc: 'Bruno prepara su espacio antes de jugar: silencia y aparta el celular, abre la lata en el Plano 20 y se acomoda los auriculares.',
      badge: 'Planos 18 al 22',
      seek: 130,
      shots: [
        ['Plano 18', '2:10–2:17', '<strong>PG igual al Plano 01:</strong> simetría visual con el inicio, pero ahora la <strong>lata está a la izquierda del teclado</strong>.', 'Rótulo: <em>“Esa noche”</em>; misma iluminación nocturna de habitación.'],
        ['Plano 19', '2:17–2:23', '<strong>PD:</strong> Bruno activa el modo silencio y deja el <strong>celular boca abajo y lejos del mouse</strong>.', 'Sonido nítido de bloqueo del teléfono, ejecutado <em>antes</em> de abrir la lata.'],
        ['Plano 20', '2:23–2:28', '<strong>PD:</strong> abre la anilla de la lata con la etiqueta mirando hacia cámara.', 'Subtítulo (<code>2:23–2:25 [Se abre la lata]</code>); apertura limpia y realista, sin destellos mágicos.'],
        ['Plano 21', '2:28–2:35', '<strong>PM:</strong> toma un sorbo, apoya la lata, respira hondo y se coloca los auriculares.', 'La música ambiente baja y entra progresivamente el audio táctico del juego.'],
        ['Plano 22', '2:35–2:45', '<strong>PM sobre hombro:</strong> entra en partida con la lata visible a la izquierda del teclado.', 'Voz y subtítulo (<code>2:38–2:42</code>): <em>“Dale. Una cosa a la vez”</em>.']
      ]
    },
    7: {
      title: 'Escena 7 · La victoria (2:45 a 3:25) — Misma noche, revancha en VALORANT',
      desc: 'Nuevo uno contra uno en el mismo mapa y zona: Bruno escucha, espera sin distracciones, sale de cobertura y gana la ronda.',
      badge: 'Planos 23 al 26',
      seek: 165,
      shots: [
        ['Plano 23', '2:45–2:55', '<strong>Captura propia de partida:</strong> nuevo 1v1 en el mismo mapa y zona que el Plano 02.', 'Rótulo: <em>“Otra ronda. La misma oportunidad”</em>; pasos del rival claros.'],
        ['Plano 24', '2:55–3:05', '<strong>PM:</strong> Bruno escucha con atención y espera el momento exacto; lata en primer término lateral.', 'Celular en silencio; continuidad total del audio de juego.'],
        ['Plano 25', '3:05–3:17', '<strong>Captura:</strong> sale de cobertura con precisión, dispara y gana la ronda (resultado visible 3 s).', 'Captura real propia preparada; sonido y subtítulo (<code>3:15–3:18 [Victoria de ronda]</code>).'],
        ['Plano 26', '3:17–3:25', '<strong>PP:</strong> Bruno exhala aliviado, sonríe y sostiene la mirada hacia cámara los últimos 2 segundos.', 'Voz y subtítulo (<code>3:19–3:22</code>): <em>“Ahora sí”</em>. No hay otra escena de abandono del juego después.']
      ]
    },
    8: {
      title: 'Escena 8 · El cierre y créditos (3:25 a 3:50) — Transición gráfica, packshot y ficha académica',
      desc: 'Los ojos de Bruno se funden con los ojos gráficos del isotipo del búho, dando paso al producto, el llamado a Club Focus y las cartelas de créditos.',
      badge: 'Planos 27 al 29',
      seek: 205,
      shots: [
        ['Plano 27', '3:25–3:29', '<strong>Gráfica (Transición):</strong> los ojos gráficos del isotipo del búho aparecen exactamente alineados con la mirada de Bruno del Plano 26.', 'Fundido encadenado de 8 a 12 fotogramas; nota musical breve de identidad.'],
        ['Plano 28', '3:29–3:35', '<strong>Packshot de lata:</strong> <em>“Cabrales Focus. Precisión que se toma”</em>. CTA: <em>“Elegí Focus para tu próxima partida. Compralo en Club Focus”</em>.', 'Pie legal legible: <em>“Producto y compra simulados · Proyecto académico”</em>.'],
        ['Plano 29', '3:35–3:50', '<strong>Dos cartelas de créditos (8 s y 7 s):</strong> nombres por rol efectivo y ficha académica de la cátedra.', '<strong>Franco Denk y Tomas Hokama</strong>; música, recursos y herramientas efectivamente utilizados.']
      ]
    }
  };

  function renderScriptScene(sceneNum) {
    const data = HYBRID_SCRIPT_SCENES[sceneNum];
    if (!data || !scriptSceneContent) return;

    const rowsHtml = data.shots
      .map(
        ([shot, time, action, tech]) => `
        <tr>
          <td><code>${shot}</code><br />${time}</td>
          <td>${action}</td>
          <td>${tech}</td>
        </tr>
      `
      )
      .join('');

    scriptSceneContent.innerHTML = `
      <div class="scene-summary-bar">
        <div>
          <strong>${data.title}</strong>
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-top: 2px;">${data.desc}</p>
        </div>
        <span class="scene-shot-count">${data.badge}</span>
      </div>
      <div class="shots-table-wrap">
        <table class="shots-table">
          <thead>
            <tr>
              <th>Plano y Tiempo</th>
              <th>Imagen y Acción</th>
              <th>Cámara, Luz y Sonido</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }

  sceneTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      sceneTabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const sNum = btn.getAttribute('data-scene');
      renderScriptScene(sNum);
    });
  });

  tcButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const sec = parseFloat(btn.getAttribute('data-seek') || '0');
      tcButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // También sincroniza la pestaña del guion técnico correspondiente
      const matchEntry = Object.entries(HYBRID_SCRIPT_SCENES).find(([, val]) => val.seek === sec);
      if (matchEntry) {
        const [sceneKey] = matchEntry;
        sceneTabBtns.forEach((b) => b.classList.toggle('active', b.getAttribute('data-scene') === sceneKey));
        renderScriptScene(sceneKey);
      }

      if (shortfilmVideo) {
        shortfilmVideo.currentTime = sec;
        shortfilmVideo.play().catch(() => {});
      }
    });
  });

  if (shortfilmFileInput && shortfilmVideo) {
    shortfilmFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        shortfilmVideo.src = url;
        shortfilmVideo.load();
        shortfilmVideo.play().catch(() => {});
      }
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
     9. PREVISUALIZADORES INTERACTIVOS DE LOS VIDEOS P1 (25s), P4 (30s) Y P5 (40s)
     ------------------------------------------------------------------------ */
  const p1Beats = document.querySelectorAll('#p1-beats-grid [data-p1-time]');
  const p1Preview = document.getElementById('p1-beat-preview');
  p1Beats.forEach((btn) => {
    btn.addEventListener('click', () => {
      p1Beats.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      if (p1Preview) {
        p1Preview.innerHTML = `
          <span style="font-size: 0.68rem; color: var(--cyan); font-weight: 800; text-transform: uppercase;">${btn.getAttribute('data-p1-time')}</span>
          <h5 style="font-family: var(--font-heading); font-size: 0.95rem; margin: 4px 0;">${btn.getAttribute('data-p1-title')}</h5>
          <p style="font-size: 0.76rem; color: var(--text-secondary);">${btn.getAttribute('data-p1-desc')}</p>
        `;
      }
    });
  });

  const p4Beats = document.querySelectorAll('#p4-beats-grid [data-p4-time]');
  const p4Preview = document.getElementById('p4-beat-preview');
  p4Beats.forEach((btn) => {
    btn.addEventListener('click', () => {
      p4Beats.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      if (p4Preview) {
        p4Preview.innerHTML = `
          <span style="font-size: 0.68rem; color: var(--cyan); font-weight: 800;">${btn.getAttribute('data-p4-time')}</span>
          <p style="font-size: 0.8rem; color: #d6bcfa; margin-top: 4px;">🎤 ${btn.getAttribute('data-p4-q')}</p>
          <p style="font-size: 0.84rem; color: var(--white); font-weight: 700; margin-top: 4px;">☀️ ${btn.getAttribute('data-p4-a')}</p>
        `;
      }
    });
  });

  const p5Beats = document.querySelectorAll('#p5-beats-grid [data-p5-time]');
  const p5Preview = document.getElementById('p5-beat-preview');
  p5Beats.forEach((btn) => {
    btn.addEventListener('click', () => {
      p5Beats.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      if (p5Preview) {
        p5Preview.innerHTML = `
          <span style="font-size: 0.68rem; color: var(--cyan); font-weight: 800;">${btn.getAttribute('data-p5-time')}</span>
          <h5 style="font-family: var(--font-heading); font-size: 0.92rem; margin: 4px 0;">${btn.getAttribute('data-p5-title')}</h5>
          <p style="font-size: 0.75rem; color: var(--text-secondary);">${btn.getAttribute('data-p5-desc')}</p>
        `;
      }
    });
  });

  /* ------------------------------------------------------------------------
     9B. SIMULADOR INTERACTIVO DE P6 — SECUENCIA DE 4 INSTAGRAM STORIES
     ------------------------------------------------------------------------ */
  const storyBody = document.getElementById('story-dynamic-body');
  const storyStepIndicator = document.getElementById('story-step-indicator');
  const sbar1 = document.getElementById('sbar-1');
  const sbar2 = document.getElementById('sbar-2');
  const sbar3 = document.getElementById('sbar-3');
  const sbar4 = document.getElementById('sbar-4');
  const btnRestartStory = document.getElementById('btn-restart-story');

  function setStoryBars(step) {
    if (sbar1) sbar1.classList.toggle('filled', step >= 1);
    if (sbar2) sbar2.classList.toggle('filled', step >= 2);
    if (sbar3) sbar3.classList.toggle('filled', step >= 3);
    if (sbar4) sbar4.classList.toggle('filled', step >= 4);
  }

  function renderStoryStep1() {
    if (!storyBody) return;
    setStoryBars(1);
    if (storyStepIndicator) storyStepIndicator.textContent = 'Story 1/4 · Encuesta';

    storyBody.innerHTML = `
      <div style="text-align: center; margin-bottom: 12px;">
        <span style="font-size: 0.68rem; color: var(--cyan); font-weight: 800; letter-spacing: 0.08em;">P6 · TU MOMENTO FOCUS (STORY 1/4)</span>
        <h4 style="font-family: var(--font-heading); font-size: 1.08rem; margin-top: 6px;">
          ANTES DE EMPEZAR, ¿QUÉ TE DISTRAE MÁS?
        </h4>
        <p style="font-size: 0.76rem; color: var(--text-secondary); margin-top: 4px;">
          Sticker interactivo de encuesta (votación de 2 opciones):
        </p>
      </div>
      <button class="story-option-btn" data-p6-s1="Notificaciones">
        📱 A. Notificaciones (mensajes y alertas del celular)
      </button>
      <button class="story-option-btn" data-p6-s1="Varias tareas">
        🗂️ B. Varias tareas abiertas al mismo tiempo
      </button>
    `;

    storyBody.querySelectorAll('[data-p6-s1]').forEach((btn) => {
      btn.addEventListener('click', () => {
        renderStoryStep2(btn.getAttribute('data-p6-s1'));
      });
    });
  }

  function renderStoryStep2(choice1) {
    setStoryBars(2);
    if (storyStepIndicator) storyStepIndicator.textContent = 'Story 2/4 · Encuesta';

    storyBody.innerHTML = `
      <div style="text-align: center; margin-bottom: 12px;">
        <span style="display: inline-block; padding: 3px 10px; border-radius: 99px; background: rgba(4,189,251,0.16); color: var(--cyan); font-size: 0.68rem; font-weight: 800; margin-bottom: 6px;">
          Elegiste: ${choice1} ✔
        </span>
        <h4 style="font-family: var(--font-heading); font-size: 1.08rem;">
          ¿CUÁNDO HACÉS TU PAUSA?
        </h4>
        <p style="font-size: 0.76rem; color: var(--text-secondary); margin-top: 4px;">
          Segunda encuesta para identificar el contexto cotidiano:
        </p>
      </div>
      <button class="story-option-btn" data-p6-s2="Estudio">
        📚 A. Estudio (lecturas, parciales o entregas)
      </button>
      <button class="story-option-btn" data-p6-s2="Trabajo">
        💻 B. Trabajo (informes, reuniones o turnos largos)
      </button>
    `;

    storyBody.querySelectorAll('[data-p6-s2]').forEach((btn) => {
      btn.addEventListener('click', () => {
        renderStoryStep3(choice1, btn.getAttribute('data-p6-s2'));
      });
    });
  }

  function renderStoryStep3(choice1, choice2) {
    setStoryBars(3);
    if (storyStepIndicator) storyStepIndicator.textContent = 'Story 3/4 · Caja Abierta';

    storyBody.innerHTML = `
      <div style="text-align: center;">
        <span style="font-size: 0.68rem; color: #d6bcfa; font-weight: 800; letter-spacing: 0.08em;">STORY 3/4 · CAJA DE RESPUESTAS (ESCUCHA ACTIVA)</span>
        <h4 style="font-family: var(--font-heading); font-size: 1.05rem; margin: 6px 0;">
          ¿QUÉ HACÉS PARA VOLVER A UNA TAREA?
        </h4>
        <input
          type="text"
          id="p6-open-input"
          value="Pongo el celular boca abajo 10 min y tomo algo frío"
          style="width: 100%; padding: 9px 11px; border-radius: 10px; border: 1px solid var(--cyan); background: rgba(9,3,3,0.85); color: #fff; font-size: 0.78rem; margin: 8px 0 10px;"
        />
        <button class="btn-primary" id="p6-to-step4" style="width: 100%; justify-content: center; padding: 9px; font-size: 0.78rem;">
          Enviar respuesta y pasar a Story 4/4 ➔
        </button>
      </div>
    `;

    document.getElementById('p6-to-step4').addEventListener('click', () => {
      const val = document.getElementById('p6-open-input').value || 'Silenciar notificaciones';
      renderStoryStep4(choice1, choice2, val);
    });
  }

  function renderStoryStep4(choice1, choice2, ritual) {
    setStoryBars(4);
    if (storyStepIndicator) storyStepIndicator.textContent = 'Story 4/4 · Link a App';
    playCanOpenAndCalmChord();

    storyBody.innerHTML = `
      <div style="text-align: center;">
        <span style="font-size: 0.66rem; color: var(--cyan); font-weight: 800;">STORY 4/4 · REMISIÓN NARRATIVA SIN COMPRA</span>
        <h4 style="font-family: var(--font-heading); font-size: 1.02rem; margin: 6px 0;">
          “CONOCÉ LA HISTORIA DE SOLANGE Y COMPARTÍ LA TUYA”
        </h4>
        <p style="font-size: 0.74rem; color: var(--text-secondary); margin-bottom: 10px;">
          Tu aporte (<em>${choice1} · ${choice2} · “${ritual}”</em>) nutre la escucha de la comunidad. Solo se publican aportes con autorización expresa.
        </p>
        <a href="#journey" class="story-option-btn" style="display: block; text-align: center; background: var(--grad-focus); color: #090303; font-weight: 800; text-decoration: none;">
          🔗 ABRIR HISTORIAS FOCUS / ARCHIVO DE VENTANAS
        </a>
      </div>
    `;
  }

  renderStoryStep1();
  if (btnRestartStory) btnRestartStory.addEventListener('click', renderStoryStep1);

  /* ------------------------------------------------------------------------
     10. CARRUSEL INTERACTIVO P2 DE 6 PLACAS («CONOCÉ CABRALES FOCUS»)
     ------------------------------------------------------------------------ */
  const carouselSlides = [
    {
      tag: 'PLACA 1 DE 6 · QUÉ ES CABRALES FOCUS',
      html: `
        <div style="display: grid; grid-template-columns: 1fr 170px; gap: 20px; align-items: center;">
          <div>
            <span style="color: var(--cyan); font-size: 0.75rem; font-weight: 800;">1 · CONCEPTO DE PRODUCTO</span>
            <h3 style="font-family: var(--font-heading); font-size: 1.6rem; line-height: 1.15; margin: 8px 0 12px;">
              COFFEE COLD BREW LISTO PARA TOMAR EN LATA DE 240 ML
            </h3>
            <p style="color: var(--text-secondary); font-size: 0.88rem;">
              Una extensión académica de <strong>Cabrales S.A.</strong> pensada para acompañar rutinas adultas de estudio, trabajo y gaming con el sello <em>“Precisión que se toma”</em>.
            </p>
          </div>
          <div style="text-align: center;">
            <img src="assets/can_hero.png" alt="Cabrales Focus" style="height: 230px; width: auto;" />
          </div>
        </div>
      `,
    },
    {
      tag: 'PLACA 2 DE 6 · QUÉ CONTIENE (FICHA ACADÉMICA)',
      html: `
        <div>
          <span style="color: #d6bcfa; font-size: 0.75rem; font-weight: 800;">2 · COMPOSICIÓN PROPUESTA POR LATA (240 ML)</span>
          <h4 style="font-family: var(--font-heading); font-size: 1.35rem; margin: 6px 0 12px;">
            Café 100% Arábica de Brasil extraído en frío, azúcar y L-teanina
          </h4>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 12px;">
            <div style="padding: 14px; border-radius: 12px; background: rgba(4,189,251,0.08); border: 1px solid rgba(4,189,251,0.3);">
              <strong style="color: var(--cyan); font-size: 1.05rem;">80 mg Cafeína</strong>
              <p style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 4px;">Proveniente íntegramente del café arábica (sin cafeína sintética añadida).</p>
            </div>
            <div style="padding: 14px; border-radius: 12px; background: rgba(138,79,255,0.1); border: 1px solid rgba(138,79,255,0.35);">
              <strong style="color: #d6bcfa; font-size: 1.05rem;">100 mg L-Teanina</strong>
              <p style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 4px;">Objetivo académico de formulación funcional por envase de 240 ml.</p>
            </div>
            <div style="padding: 14px; border-radius: 12px; background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle);">
              <strong style="color: var(--white); font-size: 1.05rem;">6 g de Azúcar</strong>
              <p style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 4px;">Sin leche, sin crema ni saborizantes añadidos. Valores de diseño académico.</p>
            </div>
          </div>
        </div>
      `,
    },
    {
      tag: 'PLACA 3 DE 6 · CÓMO SE ELABORA EL COLD BREW',
      html: `
        <div>
          <span style="color: var(--cyan); font-size: 0.75rem; font-weight: 800;">3 · PROCESO DE EXTRACCIÓN EN FRÍO</span>
          <h4 style="font-family: var(--font-heading); font-size: 1.35rem; margin: 6px 0 10px;">
            Extracción en frío vs. Café caliente enfriado
          </h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div style="padding: 16px; border-radius: 14px; background: rgba(4,189,251,0.08); border: 1px solid rgba(4,189,251,0.3);">
              <strong style="color: var(--cyan);">❄️ Verdadero Cold Brew (Agua + Café)</strong>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 6px;">
                Infusionado directamente en frío con granos 100% arábica de Brasil (inspirado en <em>Cabrales Brasil</em>), logrando un perfil limpio, suave y de baja acidez natural.
              </p>
            </div>
            <div style="padding: 16px; border-radius: 14px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle);">
              <strong style="color: #ff8080;">☕ Diferencia con café enfriado</strong>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 6px;">
                No es un espresso preparado con agua caliente y luego enfriado con hielo; conserva sus notas tostadas originales listo en lata.
              </p>
            </div>
          </div>
        </div>
      `,
    },
    {
      tag: 'PLACA 4 DE 6 · QUÉ LO DIFERENCIA',
      html: `
        <div>
          <span style="color: #d6bcfa; font-size: 0.75rem; font-weight: 800;">4 · IDENTIDAD & DIFERENCIAL</span>
          <h4 style="font-family: var(--font-heading); font-size: 1.35rem; margin: 6px 0 10px;">
            Portabilidad, Herencia Cafetera e Identidad Focus
          </h4>
          <p style="font-size: 0.86rem; color: var(--text-secondary); margin-bottom: 12px;">
            Combina la trayectoria cafetera de <strong>Cabrales</strong> con un formato portátil para el escritorio o la mochila, el isotipo del búho y la incorporación propuesta de L-teanina, comunicando <em>“Cold brew con azúcar y L-teanina, listo para acompañar tu rutina”</em> sin promesas exageradas ni eficacia clínica validada.
          </p>
        </div>
      `,
    },
    {
      tag: 'PLACA 5 DE 6 · CÓMO SE CONSUME',
      html: `
        <div>
          <span style="color: var(--cyan); font-size: 0.75rem; font-weight: 800;">5 · MODO DE CONSUMO Y ETIQUETA</span>
          <h4 style="font-family: var(--font-heading); font-size: 1.35rem; margin: 6px 0 10px;">
            Servir frío, listo para tomar, sin preparar ni diluir
          </h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div style="padding: 14px; border-radius: 12px; background: rgba(255,255,255,0.04);">
              <strong style="color: var(--white);">🥫 Directo de la lata de 240 ml</strong>
              <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">Acompaña pausas de estudio, trabajo o preparación antes de una partida competitiva.</p>
            </div>
            <div style="padding: 14px; border-radius: 12px; background: rgba(4,189,251,0.08); border: 1px solid rgba(4,189,251,0.28);">
              <strong style="color: var(--cyan);">🔓 Código QR único bajo la anilla</strong>
              <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">Al abrir la lata accedés a un código único de un solo uso para registrar en la app <em>Club Focus</em>.</p>
            </div>
          </div>
        </div>
      `,
    },
    {
      tag: 'PLACA 6 DE 6 · APP GRATUITA CLUB FOCUS (CTA)',
      html: `
        <div style="text-align: center;">
          <img src="assets/owl_mascot.png" alt="El Búho" style="width: 62px; height: 62px; margin-bottom: 8px;" />
          <span style="display: block; color: var(--cyan); font-size: 0.74rem; font-weight: 800;">6 · ECOSISTEMA DIGITAL Y FIDELIZACIÓN</span>
          <h3 style="font-family: var(--font-heading); font-size: 1.45rem; margin: 6px 0 8px;">
            DESCARGÁ GRATIS LA APP «CLUB FOCUS»
          </h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); max-width: 540px; margin: 0 auto 14px;">
            Leé <strong>Historias Focus</strong> (sin necesidad de compra), encontrá puntos de venta en el mapa, hacé pedidos en la eShop y sumá puntos con cada lata para canjear descuentos, merchandising o bonos del <em>FiReMAJOR 2027</em>.
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
