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
  const p5Video = document.getElementById('p5-reels-video');

  pubTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-pub-target');

      pubTabs.forEach(t => t.classList.remove('active'));
      pubPanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');

      // Si cambiamos de pestaña y no es P5, pausamos el video de Reels
      if (targetId !== 'pub-p5' && p5Video && !p5Video.paused) {
        p5Video.pause();
      }
    });
  });

  // Carrusel Interactivo P2 (6 Placas en Track)
  const slidesTrack = document.getElementById('p2-slides-track');
  const p2Counter = document.getElementById('p2-slide-counter');
  const p2PrevBtn = document.getElementById('p2-btn-prev');
  const p2NextBtn = document.getElementById('p2-btn-next');
  const p2Dots = document.querySelectorAll('#p2-middle-dots .ig-dot');
  let currentPlateIdx = 0;
  const totalPlates = 6;

  function setCarruselPlate(idx) {
    if (idx < 0) idx = 0;
    if (idx >= totalPlates) idx = totalPlates - 1;
    currentPlateIdx = idx;

    if (slidesTrack) {
      slidesTrack.style.transform = `translateX(-${currentPlateIdx * 100}%)`;
    }
    if (p2Counter) {
      p2Counter.textContent = `${currentPlateIdx + 1}/${totalPlates}`;
    }
    p2Dots.forEach((dot, dIdx) => {
      dot.classList.toggle('active', dIdx === currentPlateIdx);
    });

    if (p2PrevBtn) p2PrevBtn.disabled = (currentPlateIdx === 0);
    if (p2NextBtn) p2NextBtn.disabled = (currentPlateIdx === totalPlates - 1);
  }

  if (p2PrevBtn) {
    p2PrevBtn.addEventListener('click', () => {
      if (currentPlateIdx > 0) setCarruselPlate(currentPlateIdx - 1);
    });
  }

  if (p2NextBtn) {
    p2NextBtn.addEventListener('click', () => {
      if (currentPlateIdx < totalPlates - 1) setCarruselPlate(currentPlateIdx + 1);
    });
  }

  p2Dots.forEach((dot, dIdx) => {
    dot.addEventListener('click', () => setCarruselPlate(dIdx));
  });

  // Inicializar estado del carrusel P2
  setCarruselPlate(0);

  // Stories Interactivas P6 (4 Historias con Barras de Progreso)
  const storiesList = [
    "assets/instagram_suga_stories/story_1_final.png",
    "assets/instagram_suga_stories/story_2_final.png",
    "assets/instagram_suga_stories/story_3_final.png",
    "assets/instagram_suga_stories/story_4_final.png"
  ];
  let currentStoryIdx = 0;
  const p6StoryImg = document.getElementById('p6-story-img');
  const p6StoryCounter = document.getElementById('p6-story-counter');
  const p6PrevBtn = document.getElementById('p6-btn-prev');
  const p6NextBtn = document.getElementById('p6-btn-next');
  const storySegs = [
    document.getElementById('p6-seg-0'),
    document.getElementById('p6-seg-1'),
    document.getElementById('p6-seg-2'),
    document.getElementById('p6-seg-3')
  ];

  function setStory(idx) {
    if (idx < 0) idx = 0;
    if (idx >= storiesList.length) idx = storiesList.length - 1;
    currentStoryIdx = idx;

    if (p6StoryImg) {
      p6StoryImg.style.opacity = '0.7';
      p6StoryImg.src = storiesList[currentStoryIdx];
      setTimeout(() => { p6StoryImg.style.opacity = '1'; }, 100);
    }
    if (p6StoryCounter) {
      p6StoryCounter.textContent = `Story ${currentStoryIdx + 1} de 4`;
    }

    storySegs.forEach((seg, sIdx) => {
      if (seg) {
        seg.classList.toggle('active', sIdx <= currentStoryIdx);
      }
    });

    if (p6PrevBtn) p6PrevBtn.disabled = (currentStoryIdx === 0);
    if (p6NextBtn) p6NextBtn.disabled = (currentStoryIdx === storiesList.length - 1);
  }

  if (p6PrevBtn) {
    p6PrevBtn.addEventListener('click', () => {
      if (currentStoryIdx > 0) setStory(currentStoryIdx - 1);
    });
  }

  if (p6NextBtn) {
    p6NextBtn.addEventListener('click', () => {
      if (currentStoryIdx < storiesList.length - 1) setStory(currentStoryIdx + 1);
    });
  }

  // Click directo en la story para avanzar o retroceder
  if (p6StoryImg) {
    p6StoryImg.addEventListener('click', (e) => {
      const rect = p6StoryImg.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX > rect.width / 2) {
        if (currentStoryIdx < storiesList.length - 1) setStory(currentStoryIdx + 1);
        else setStory(0);
      } else {
        if (currentStoryIdx > 0) setStory(currentStoryIdx - 1);
      }
    });
  }

  // Inicializar estado de Stories P6
  setStory(0);

  // ------------------------------------------------------------------------
  // 3. SHOWCASE DE APP CLUB FOCUS & SIMULADOR (SLIDE 7)
  // ------------------------------------------------------------------------
  const appScreensList = [
    {
      src: "assets/app_club_focus/app_homepage.jpg",
      title: "Dashboard & Puntos"
    },
    {
      src: "assets/app_club_focus/app_qr_page.jpg",
      title: "Escáner QR de Lata"
    },
    {
      src: "assets/app_club_focus/app_shop_page.jpg",
      title: "Tienda D2C & Canjes"
    }
  ];

  let currentAppScreenIdx = 0;
  const appScreenImg = document.getElementById('app-screen-display');
  const appScreenNameTag = document.getElementById('app-screen-name-tag');
  const appScreenTabs = document.querySelectorAll('.app-screen-tab');
  const appInteractiveFrame = document.getElementById('app-screen-interactive-frame');

  function setAppScreen(idx) {
    if (idx < 0) idx = 0;
    if (idx >= appScreensList.length) idx = appScreensList.length - 1;
    currentAppScreenIdx = idx;

    if (appScreenImg) {
      appScreenImg.style.opacity = '0.3';
      appScreenImg.style.transform = 'scale(0.98)';
      setTimeout(() => {
        appScreenImg.src = appScreensList[currentAppScreenIdx].src;
        if (appScreenNameTag) {
          appScreenNameTag.textContent = appScreensList[currentAppScreenIdx].title;
        }
        appScreenImg.style.opacity = '1';
        appScreenImg.style.transform = 'scale(1)';
      }, 120);
    }

    appScreenTabs.forEach((tab, tIdx) => {
      tab.classList.toggle('active', tIdx === currentAppScreenIdx);
    });
  }

  appScreenTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.getAttribute('data-app-idx'), 10);
      setAppScreen(idx);
    });
  });

  if (appInteractiveFrame) {
    appInteractiveFrame.addEventListener('click', () => {
      const nextIdx = (currentAppScreenIdx + 1) % appScreensList.length;
      setAppScreen(nextIdx);
    });
  }

  // Demo interactiva: Escanear Lata
  const scanCanBtn = document.getElementById('demo-scan-can-btn');
  const pointsCounter = document.getElementById('demo-points-count');
  const levelBadge = document.getElementById('demo-level-badge');
  const scanMsg = document.getElementById('demo-scan-feedback');

  let currentPoints = 200;

  if (scanCanBtn && pointsCounter) {
    scanCanBtn.addEventListener('click', () => {
      // Automáticamente mostramos la pantalla del escáner en el teléfono
      setAppScreen(1);

      currentPoints += 100;
      pointsCounter.textContent = currentPoints;
      scanCanBtn.disabled = true;
      scanCanBtn.textContent = '¡Lata Verificada!';

      if (scanMsg) {
        scanMsg.style.display = 'block';
        scanMsg.textContent = '✓ Código verificado: +100 pts de canje (permanentes) y +100 pts de nivel (válidos 3 meses)';
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

  // Detección de protocolo file:// para fallback limpio de YouTube (evita Error 153 de Google)
  if (window.location.protocol === 'file:') {
    const ytIframe = document.getElementById('shortfilm-yt-iframe');
    const localFallback = document.getElementById('shortfilm-local-fallback');
    if (ytIframe && localFallback) {
      ytIframe.style.display = 'none';
      localFallback.style.display = 'flex';
    }
  }
