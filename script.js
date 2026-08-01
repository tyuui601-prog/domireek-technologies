const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-links');
const progressBar = document.querySelector('.scroll-progress');
const hero = document.querySelector('.hero');

const setHeaderState = () => header.classList.toggle('scrolled', window.scrollY > 20);
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

let motionFrame;
const updatePageMotion = () => {
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollRange > 0 ? Math.min((window.scrollY / scrollRange) * 100, 100) : 0;
  progressBar.style.width = `${progress}%`;

  const allowParallax = window.innerWidth > 980
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (allowParallax && hero && window.scrollY < hero.offsetHeight) {
    hero.style.setProperty('--parallax-y', `${window.scrollY * 0.12}px`);
    hero.style.setProperty('--parallax-y-reverse', `${window.scrollY * -0.07}px`);
  }
  motionFrame = undefined;
};

const requestPageMotion = () => {
  if (motionFrame) return;
  motionFrame = requestAnimationFrame(updatePageMotion);
};

updatePageMotion();
window.addEventListener('scroll', requestPageMotion, { passive: true });
window.addEventListener('resize', requestPageMotion, { passive: true });

menuButton.addEventListener('click', () => {
  const open = menu.classList.toggle('active');
  menuButton.classList.toggle('active', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});

menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menu.classList.remove('active');
  menuButton.classList.remove('active');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}));

document.addEventListener('click', (event) => {
  if (!menu.classList.contains('active')) return;
  if (menu.contains(event.target) || menuButton.contains(event.target)) return;
  menu.classList.remove('active');
  menuButton.classList.remove('active');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !menu.classList.contains('active')) return;
  menu.classList.remove('active');
  menuButton.classList.remove('active');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  menuButton.focus();
});

document.querySelectorAll('.accordion details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.accordion details').forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

// Reveal content as it enters the viewport. Delays are kept short so the
// animation supports scanning instead of slowing the visitor down.
const revealGroups = [
  '.about-content',
  '.about-values article',
  '.section-head',
  '.service-card',
  '.technology-head',
  '.stack-card',
  '.industry-grid article',
  '.why-heading',
  '.why-cards article',
  '.process-heading',
  '.process-grid li',
  '.faq-grid > div',
  '.contact-copy',
  '.contact-form'
];

const revealItems = document.querySelectorAll(revealGroups.join(','));
revealItems.forEach((item) => item.classList.add('reveal-ready'));

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const siblings = [...entry.target.parentElement.children];
      const position = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${Math.min(Math.max(position, 0) * 65, 260)}ms`;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px' });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

// Keep the navigation oriented to the section currently being viewed.
const trackedSections = document.querySelectorAll('main section[id]');
const navBySection = new Map(
  [...menu.querySelectorAll('a[href^="#"]')].map((link) => [link.hash.slice(1), link])
);

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;

    menu.querySelectorAll('a').forEach((link) => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    });
    const activeLink = navBySection.get(visible.target.id);
    if (activeLink) {
      activeLink.classList.add('active');
      activeLink.setAttribute('aria-current', 'page');
    }
  }, { rootMargin: '-25% 0px -60%', threshold: [0, 0.2, 0.5] });

  trackedSections.forEach((section) => sectionObserver.observe(section));
}

// Compact mobile module slider used in place of the desktop floating cards.
const moduleSlider = document.querySelector('.mobile-module-slider');
if (moduleSlider) {
  const track = moduleSlider.querySelector('.module-track');
  const dots = [...moduleSlider.querySelectorAll('.module-dots button')];
  let currentSlide = 0;
  let touchStartX = 0;
  let sliderTimer;

  const showModule = (index) => {
    currentSlide = (index + dots.length) % dots.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === currentSlide);
      dot.setAttribute('aria-current', dotIndex === currentSlide ? 'true' : 'false');
    });
  };

  const startModuleSlider = () => {
    clearInterval(sliderTimer);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    sliderTimer = setInterval(() => showModule(currentSlide + 1), 3200);
  };

  dots.forEach((dot, index) => dot.addEventListener('click', () => {
    showModule(index);
    startModuleSlider();
  }));

  track.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
    clearInterval(sliderTimer);
  }, { passive: true });

  track.addEventListener('touchend', (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 35) showModule(currentSlide + (distance < 0 ? 1 : -1));
    startModuleSlider();
  }, { passive: true });

  showModule(0);
  startModuleSlider();
}

document.querySelector('#contact-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`Project enquiry from ${form.get('name')}`);
  const body = encodeURIComponent(`Name: ${form.get('name')}\nEmail: ${form.get('email')}\n\nProject details:\n${form.get('message')}`);
  window.location.href = `mailto:sharmamishan38@gmail.com?subject=${subject}&body=${body}`;
  document.querySelector('.form-note').textContent = 'Your email app is opening with your message ready to send.';
});
