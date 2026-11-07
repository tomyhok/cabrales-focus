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
const p5QuickJumps = document.querySelectorAll('.p5-quick-jump');
const p5Video = document.getElementById('p5-spot-video');
const p5Img = document.getElementById('p5-preview-img');
const p5Time = document.getElementById('p5-preview-time');
const p5Title = document.getElementById('p5-preview-title');
const p5Vo = document.getElementById('p5-preview-vo');
const p5Desc = document.getElementById('p5-preview-desc');

function selectP5Scene(btn, seekVideo = true) {
  if (!btn) return;
  p5Beats.forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');

  const seekSec = parseFloat(btn.getAttribute('data-p5-seek') || '0');
  const timeText = btn.getAttribute('data-p5-time') || '';
  const titleText = btn.getAttribute('data-p5-title') || '';
  const descText = btn.getAttribute('data-p5-desc') || '';
  const voText = btn.getAttribute('data-p5-vo') || '';
  const imgUrl = btn.getAttribute('data-p5-img') || '';

  if (p5Time) p5Time.textContent = timeText;
  if (p5Title) p5Title.textContent = titleText;
  if (p5Vo) p5Vo.textContent = `“${voText}”`;
  if (p5Desc) p5Desc.textContent = descText;
  if (p5Img && imgUrl) p5Img.src = imgUrl;

  p5QuickJumps.forEach((qBtn) => {
    const qJump = parseFloat(qBtn.getAttribute('data-jump') || '0');
    if (Math.abs(qJump - seekSec) < 1) {
      qBtn.classList.add('active');
    } else {
      qBtn.classList.remove('active');
    }
  });

  if (seekVideo && p5Video) {
    p5Video.currentTime = seekSec;
    p5Video.play().catch(() => {});
  }
}

p5Beats.forEach((btn) => {
  btn.addEventListener('click', () => {
    selectP5Scene(btn, true);
  });
});

p5QuickJumps.forEach((qBtn) => {
  qBtn.addEventListener('click', () => {
    const jumpSec = parseFloat(qBtn.getAttribute('data-jump') || '0');
    const matchBtn = Array.from(p5Beats).find(
      (b) => Math.abs(parseFloat(b.getAttribute('data-p5-seek') || '0') - jumpSec) < 1
    );
    if (matchBtn) {
      selectP5Scene(matchBtn, true);
    } else if (p5Video) {
      p5Video.currentTime = jumpSec;
      p5Video.play().catch(() => {});
    }
  });
});

if (p5Video) {
  p5Video.addEventListener('timeupdate', () => {
    const cur = p5Video.currentTime;
    let targetIdx = 0;
    if (cur >= 17) targetIdx = 4;
    else if (cur >= 12) targetIdx = 3;
    else if (cur >= 8) targetIdx = 2;
    else if (cur >= 4) targetIdx = 1;
    else targetIdx = 0;

    const activeBtn = p5Beats[targetIdx];
    if (activeBtn && !activeBtn.classList.contains('active')) {
      selectP5Scene(activeBtn, false);
    }
  });
}


