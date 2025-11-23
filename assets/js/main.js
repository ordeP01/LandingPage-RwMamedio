const nav = document.querySelector('[data-nav]');
const navToggles = document.querySelectorAll('[data-nav-toggle]');
const navBackdrop = document.querySelector('[data-nav-backdrop]');
const navLinks = document.querySelectorAll('[data-nav-link]');
let lastToggle = null;

const setNavState = (isOpen) => {
  if (!nav) return;

  nav.classList.toggle('is-open', isOpen);
  document.body.classList.toggle('is-nav-open', isOpen);

  if (navBackdrop) {
    navBackdrop.classList.toggle('is-active', isOpen);
  }

  navToggles.forEach((toggle) => {
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  if (isOpen) {
    requestAnimationFrame(() => {
      nav.querySelector('a')?.focus({ preventScroll: true });
    });
  } else {
    lastToggle?.focus({ preventScroll: true });
  }
};

navToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const isOpen = nav?.classList.contains('is-open');
    lastToggle = toggle;
    setNavState(!isOpen);
  });
});

navBackdrop?.addEventListener('click', () => setNavState(false));
navLinks.forEach((link) => link.addEventListener('click', () => setNavState(false)));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && document.body.classList.contains('is-nav-open')) {
    setNavState(false);
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1024 && document.body.classList.contains('is-nav-open')) {
    setNavState(false);
  }
});

const heroSlider = document.querySelector('[data-hero-slider]');

if (heroSlider) {
  const heroSlides = Array.from(heroSlider.querySelectorAll('.hero-slide'));
  const heroControls = heroSlider.parentElement.querySelector('.hero-slider__controls');
  let heroDots = Array.from(document.querySelectorAll('[data-hero-dot]'));

  if (heroControls) {
    if (heroDots.length !== heroSlides.length) {
      heroControls.innerHTML = '';
      heroDots = heroSlides.map((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `hero-slider__dot${index === 0 ? ' is-active' : ''}`;
        dot.dataset.heroDot = '';
        dot.setAttribute('aria-label', `Slide ${index + 1}`);
        heroControls.appendChild(dot);
        return dot;
      });
    }
  } else {
    heroDots = [];
  }

  let heroIndex = 0;
  let heroTimer = null;

  const updateHeroHeight = () => {
    const activeSlide = heroSlides[heroIndex];
    if (activeSlide) {
      const target = Math.max(activeSlide.scrollHeight, 520);
      heroSlider.style.height = `${target}px`;
    }
  };

  const activateHeroSlide = (index) => {
    heroSlides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
    });
    heroDots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
    });
    heroIndex = index;
    updateHeroHeight();
  };

  const startHeroAuto = () => {
    clearInterval(heroTimer);
    heroTimer = setInterval(() => {
      const next = (heroIndex + 1) % heroSlides.length;
      activateHeroSlide(next);
    }, 6500);
  };

  heroDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      activateHeroSlide(index);
      startHeroAuto();
    });
  });

  activateHeroSlide(0);
  startHeroAuto();
  updateHeroHeight();

  heroSlider.addEventListener('mouseenter', () => clearInterval(heroTimer));
  heroSlider.addEventListener('mouseleave', startHeroAuto);

  window.addEventListener('resize', updateHeroHeight);
}

const carousels = document.querySelectorAll('[data-carousel]');

const initCarousel = (carousel) => {
  const track = carousel.querySelector('.carousel__track');
  const slides = track ? Array.from(track.children) : [];
  if (!track || slides.length <= 1) return;

  const prevButton = carousel.querySelector('[data-carousel-prev]');
  const nextButton = carousel.querySelector('[data-carousel-next]');
  const dots = Array.from(carousel.querySelectorAll('[data-carousel-dot]'));
  const viewport = carousel.querySelector('.carousel__viewport');

  let currentIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
  currentIndex = currentIndex >= 0 ? currentIndex : 0;
  let autoTimer = null;

  const setActive = () => {
    slides.forEach((slide, index) => {
      slide.classList.toggle('is-active', index === currentIndex);
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === currentIndex);
      dot.setAttribute('aria-selected', index === currentIndex ? 'true' : 'false');
      dot.setAttribute('tabindex', index === currentIndex ? '0' : '-1');
    });

    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  };

  const goTo = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    setActive();
  };

  const stopAuto = () => {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  };

  const startAuto = () => {
    stopAuto();
    autoTimer = setInterval(() => {
      goTo(currentIndex + 1);
    }, 6000);
  };

  setActive();
  startAuto();

  prevButton?.addEventListener('click', () => {
    goTo(currentIndex - 1);
    startAuto();
  });

  nextButton?.addEventListener('click', () => {
    goTo(currentIndex + 1);
    startAuto();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goTo(index);
      startAuto();
    });
  });

  viewport?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(currentIndex - 1);
      startAuto();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(currentIndex + 1);
      startAuto();
    }
  });

  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);
  carousel.addEventListener('focusin', stopAuto);
  carousel.addEventListener('focusout', () => startAuto());
};

carousels.forEach(initCarousel);

const currentYear = document.getElementById('ano-atual');
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}
