/* ==========================================================================
   CABRALES FOCUS · MOTOR DE PRESENTACIÓN & INTERACTIVIDAD PARA EL PITCH
   Agencia Transmedia Focus -> Directorio de Cabrales S.A.
   Taller de Narrativas Digitales - UADE (Franco Denk & Tomas Hokama)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. CONFIGURACIÓN DEL SISTEMA DE SLIDES
  const slides = Array.from(document.querySelectorAll('.slide-section'));
  const navPills = Array.from(document.querySelectorAll('.nav-pill'));
  const hudSlideIndex = document.querySelector('.hud-slide-index');
  const hudSlideTitle = document.querySelector('.hud-slide-title');
  const progressBar = document.getElementById('scroll-progress');
  const prevBtn = document.getElementById('hud-prev-btn');
  const nextBtn = document.getElementById('hud-next-btn');
  const fullScreenBtn = document.getElementById('hud-fullscreen-btn');

  const slideTitles = [
    "01 · Apertura del Pitch & Agencia",
    "02 · Storytelling Central & Mundo",
    "03 · Cortometraje Canon: Turno de Noche",
    "04 · Ecosistema & Modo Focus en Dot",
    "05 · Influencer: Suga & Stream Twitch",
    "06 · Las 6 Publicaciones (P1-P6)",
    "07 · App Club Focus & Fidelización",
    "08 · Red de Remisiones & Calendario",
    "09 · Fundamentos Teóricos & Fuentes",
    "10 · Cierre de Propuesta & Q&A"
  ];

  let currentSlideIndex = 0;

  function updateSlideUI(index) {
    if (index < 0 || index >= slides.length) return;
    currentSlideIndex = index;

    // Actualizar HUD
    const formattedNum = String(index + 1).padStart(2, '0');
    if (hudSlideIndex) hudSlideIndex.textContent = `SLIDE ${formattedNum} / ${slides.length}`;
    if (hudSlideTitle) hudSlideTitle.textContent = slideTitles[index] || "";

    // Actualizar barra de progreso
    if (progressBar) {
      const progress = ((index + 1) / slides.length) * 100;
      progressBar.style.width = `${progress}%`;
    }

    // Actualizar pills de la barra superior
    navPills.forEach((pill, i) => {
      if (i === index) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  function goToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    const targetSlide = slides[index];
    if (targetSlide) {
      targetSlide.scrollIntoView({ behavior: 'smooth', block: 'start' });
      updateSlideUI(index);
    }
  }

  function nextSlide() {
    if (currentSlideIndex < slides.length - 1) {
      goToSlide(currentSlideIndex + 1);
    }
  }

  function prevSlide() {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1);
    }
  }

  // Toggle Pantalla Completa
  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn("Fullscreen request error:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // Event Listeners HUD
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (fullScreenBtn) fullScreenBtn.addEventListener('click', toggleFullScreen);

  // Event Listeners Nav Pills
  navPills.forEach((pill, idx) => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(idx);
    });
  });

  // Atajos de teclado para proyector de aula
  window.addEventListener('keydown', (e) => {
    // Si el foco está en un input o textarea, no capturar
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      prevSlide();
    } else if (e.key.toLowerCase() === 'f') {
      e.preventDefault();
      toggleFullScreen();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goToSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goToSlide(slides.length - 1);
    } else if (e.key >= '1' && e.key <= '9') {
      const targetIdx = parseInt(e.key, 10) - 1;
      if (targetIdx < slides.length) {
        e.preventDefault();
        goToSlide(targetIdx);
      }
    } else if (e.key === '0') {
      e.preventDefault();
      goToSlide(9); // Slide 10
    }
  });

  // IntersectionObserver para detectar scroll manual y sincronizar HUD
  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = slides.indexOf(entry.target);
        if (idx !== -1) {
          updateSlideUI(idx);
        }
      }
    });
  }, {
    threshold: 0.5
  });

  slides.forEach(slide => slideObserver.observe(slide));

  // ------------------------------------------------------------------------
  // 2. VISUALIZADOR DE PUBLICACIONES (SLIDE 6)
  // ------------------------------------------------------------------------
  const pubTabs = document.querySelectorAll('.pub-tab-btn');
  const pubPanes = document.querySelectorAll('.pub-detail-pane');

  pubTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-pub-target');

      pubTabs.forEach(t => t.classList.remove('active'));
      pubPanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // Carrusel Interactivo P2 (6 Placas)
  const carruselPlates = [
    "assets/carrusel_p2/Carrusel Cabrales Focus (Definitivo)/1.png",
    "assets/carrusel_p2/Carrusel Cabrales Focus (Definitivo)/2.png",
    "assets/carrusel_p2/Carrusel Cabrales Focus (Definitivo)/3.png",
    "assets/carrusel_p2/Carrusel Cabrales Focus (Definitivo)/4.png",
    "assets/carrusel_p2/Carrusel Cabrales Focus (Definitivo)/5.png",
    "assets/carrusel_p2/Carrusel Cabrales Focus (Definitivo)/6.png"
  ];

  let currentPlateIdx = 0;
  const plateImg = document.getElementById('p2-active-plate-img');
  const plateCounter = document.getElementById('p2-plate-counter');
  const plateDots = document.querySelectorAll('.carrusel-dot');
  const prevPlateBtn = document.getElementById('p2-prev-plate');
  const nextPlateBtn = document.getElementById('p2-next-plate');

  function setCarruselPlate(idx) {
    if (idx < 0 || idx >= carruselPlates.length) return;
    currentPlateIdx = idx;
    if (plateImg) plateImg.src = carruselPlates[idx];
    if (plateCounter) plateCounter.textContent = `Placa ${idx + 1} de 6`;
    plateDots.forEach((dot, dIdx) => {
      dot.classList.toggle('active', dIdx === idx);
    });
  }

  if (prevPlateBtn) {
    prevPlateBtn.addEventListener('click', () => {
      const newIdx = (currentPlateIdx - 1 + carruselPlates.length) % carruselPlates.length;
      setCarruselPlate(newIdx);
    });
  }

  if (nextPlateBtn) {
    nextPlateBtn.addEventListener('click', () => {
      const newIdx = (currentPlateIdx + 1) % carruselPlates.length;
      setCarruselPlate(newIdx);
    });
  }

  plateDots.forEach((dot, dIdx) => {
    dot.addEventListener('click', () => setCarruselPlate(dIdx));
  });

  // Stories Interactivas P6 (4 Historias)
  const storiesList = [
    "assets/instagram_suga_stories/story_1_final.png",
    "assets/instagram_suga_stories/story_2_final.png",
    "assets/instagram_suga_stories/story_3_final.png",
    "assets/instagram_suga_stories/story_4_final.png"
  ];
  let currentStoryIdx = 0;
  const storyImg = document.getElementById('p6-active-story-img');
  const storyCounter = document.getElementById('p6-story-counter');
  const prevStoryBtn = document.getElementById('p6-prev-story');
  const nextStoryBtn = document.getElementById('p6-next-story');

  function setStory(idx) {
    if (idx < 0 || idx >= storiesList.length) return;
    currentStoryIdx = idx;
    if (storyImg) storyImg.src = storiesList[idx];
    if (storyCounter) storyCounter.textContent = `Story ${idx + 1} de 4`;
  }

  if (prevStoryBtn) {
    prevStoryBtn.addEventListener('click', () => {
      const newIdx = (currentStoryIdx - 1 + storiesList.length) % storiesList.length;
      setStory(newIdx);
    });
  }

  if (nextStoryBtn) {
    nextStoryBtn.addEventListener('click', () => {
      const newIdx = (currentStoryIdx + 1) % storiesList.length;
      setStory(newIdx);
    });
  }

  // ------------------------------------------------------------------------
  // 3. SIMULADOR DE APP CLUB FOCUS (SLIDE 7)
  // ------------------------------------------------------------------------
  const appTabs = document.querySelectorAll('.app-sim-tab-btn');
  const appPanes = document.querySelectorAll('.app-screen-tab-pane');

  appTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetScreen = tab.getAttribute('data-app-screen');

      appTabs.forEach(t => t.classList.remove('active'));
      appPanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(targetScreen);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // Demo interactiva: Escanear Lata
  const scanCanBtn = document.getElementById('demo-scan-can-btn');
  const pointsCounter = document.getElementById('demo-points-count');
  const levelBadge = document.getElementById('demo-level-badge');
  const scanMsg = document.getElementById('demo-scan-feedback');

  let currentPoints = 200;

  if (scanCanBtn && pointsCounter) {
    scanCanBtn.addEventListener('click', () => {
      currentPoints += 100;
      pointsCounter.textContent = currentPoints;
      scanCanBtn.disabled = true;
      scanCanBtn.textContent = '¡Lata Registrada!';

      if (scanMsg) {
        scanMsg.style.display = 'block';
        scanMsg.textContent = '+100 pts de canje (permanentes) y +100 pts de nivel (válidos 3 meses)';
      }

      if (levelBadge && currentPoints >= 500) {
        levelBadge.textContent = 'Nivel 2 (Enfocado)';
        levelBadge.style.color = '#04bdfb';
      }

      setTimeout(() => {
        scanCanBtn.disabled = false;
        scanCanBtn.textContent = '⚡ Simular Registro de Otra Lata';
      }, 3000);
    });
  }

  // ------------------------------------------------------------------------
  // 4. CANVAS AMBIENTAL DE CONDENSACIÓN & PARTÍCULAS
  // ------------------------------------------------------------------------
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = 35; // Muy ligero para proyector

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -Math.random() * 0.45 - 0.1, // Flotación hacia arriba (condensación / efervescencia)
        alpha: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.4 ? 'rgba(4, 189, 251,' : 'rgba(138, 79, 255,'
      });
    }

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#04bdfb';
        ctx.fill();
      }

      requestAnimationFrame(renderCanvas);
    }

    renderCanvas();
  }

  // Inicializar estado del HUD
  updateSlideUI(0);
});
