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

// Fine-pointer enhancements stay desktop-only and never affect touch screens.
const finePointer = window.matchMedia('(pointer: fine) and (min-width: 981px)');
const cursorOrbit = document.querySelector('.cursor-orbit');

if (finePointer.matches && cursorOrbit) {
  let cursorX = -50;
  let cursorY = -50;
  let cursorFrame;

  const paintCursor = () => {
    cursorOrbit.style.transform = `translate3d(${cursorX - cursorOrbit.offsetWidth / 2}px, ${cursorY - cursorOrbit.offsetHeight / 2}px, 0)`;
    cursorFrame = undefined;
  };

  document.addEventListener('pointermove', (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;
    if (!cursorFrame) cursorFrame = requestAnimationFrame(paintCursor);
  }, { passive: true });

  document.addEventListener('pointerover', (event) => {
    cursorOrbit.classList.toggle('is-active', Boolean(event.target.closest('a, button, summary')));
  });
  document.documentElement.addEventListener('mouseleave', () => {
    cursorOrbit.style.opacity = '0';
  });
  document.documentElement.addEventListener('mouseenter', () => {
    cursorOrbit.style.opacity = '1';
  });

  const pointerSurfaces = document.querySelectorAll(
    '.service-card:not(.odoo-service):not(.ai-service), .industry-grid article, .why-cards article, .stack-card:not(.stack-odoo), .process-grid li:not(:last-child)'
  );
  pointerSurfaces.forEach((surface) => {
    surface.classList.add('pointer-surface');
    surface.addEventListener('pointermove', (event) => {
      const bounds = surface.getBoundingClientRect();
      surface.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
      surface.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
    }, { passive: true });
  });

  document.querySelectorAll('.button, .nav-cta, .footer-button').forEach((button) => {
    button.classList.add('magnetic');
    button.addEventListener('pointermove', (event) => {
      const bounds = button.getBoundingClientRect();
      const x = (event.clientX - bounds.left - bounds.width / 2) * 0.12;
      const y = (event.clientY - bounds.top - bounds.height / 2) * 0.16;
      button.style.setProperty('--magnetic-x', `${x}px`);
      button.style.setProperty('--magnetic-y', `${y}px`);
    }, { passive: true });
    button.addEventListener('pointerleave', () => {
      button.style.setProperty('--magnetic-x', '0px');
      button.style.setProperty('--magnetic-y', '0px');
    });
  });
}

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

// Decorative floating materials occupy unused space without adding content.
const ambientSets = [
  ['.hero', [
    ['tile', '5%', '31%', '34px', '.45', '10s', '-2s', '14deg'],
    ['ring', '92%', '24%', '46px', '.38', '12s', '-5s'],
    ['dot', '54%', '19%', '10px', '.58', '7s', '-3s'],
    ['spark', '47%', '72%', '32px', '.42', '9s', '-1s'],
    ['hex', '57%', '83%', '28px', '.34', '11s', '-4s'],
    ['signal', '76%', '10%', '34px', '.28', '13s', '-7s']
  ]],
  ['#about', [
    ['capsule', '4%', '77%', '40px', '.35', '13s', '-6s', '-16deg'],
    ['ring', '91%', '14%', '34px', '.3', '10s', '-2s'],
    ['dot', '84%', '84%', '9px', '.48', '8s', '-4s']
  ]],
  ['#services', [
    ['arc', '94%', '7%', '58px', '.34', '13s', '-4s'],
    ['diamond', '3%', '52%', '24px', '.3', '10s', '-2s'],
    ['beads', '86%', '91%', '30px', '.32', '12s', '-6s'],
    ['cube', '7%', '11%', '28px', '.3', '12s', '-5s', '11deg']
  ]],
  ['#technologies', [
    ['tile', '92%', '18%', '38px', '.4', '11s', '-4s', '-12deg'],
    ['spark', '5%', '64%', '36px', '.35', '8s', '-2s'],
    ['dot', '48%', '8%', '8px', '.45', '7s', '-5s'],
    ['hex', '84%', '76%', '32px', '.3', '13s', '-6s'],
    ['signal', '11%', '13%', '28px', '.25', '12s', '-3s']
  ]],
  ['#why-us', [
    ['ring', '3%', '18%', '42px', '.28', '12s', '-5s'],
    ['capsule', '88%', '82%', '34px', '.3', '14s', '-7s', '18deg'],
    ['spark', '94%', '28%', '30px', '.36', '9s', '-3s']
  ]],
  ['#industries', [
    ['diamond', '94%', '12%', '28px', '.32', '11s', '-5s'],
    ['arc', '2%', '74%', '46px', '.28', '14s', '-7s'],
    ['beads', '83%', '92%', '28px', '.3', '10s', '-3s']
  ]],
  ['#process', [
    ['tile', '3%', '75%', '30px', '.3', '12s', '-2s', '9deg'],
    ['dot', '94%', '15%', '10px', '.42', '8s', '-4s']
  ]],
  ['#faq', [
    ['arc', '92%', '16%', '52px', '.28', '15s', '-5s'],
    ['diamond', '4%', '80%', '22px', '.26', '11s', '-3s'],
    ['spark', '84%', '84%', '34px', '.3', '9s', '-4s']
  ]],
  ['#contact', [
    ['beads', '90%', '8%', '28px', '.28', '12s', '-6s'],
    ['diamond', '3%', '76%', '24px', '.24', '10s', '-2s']
  ]]
];

ambientSets.forEach(([selector, materials]) => {
  const section = document.querySelector(selector);
  if (!section) return;
  const layer = document.createElement('div');
  layer.className = 'ambient-materials';
  layer.setAttribute('aria-hidden', 'true');
  materials.forEach(([type, x, y, size, opacity, speed, delay, rotate = '0deg'], index) => {
    const material = document.createElement('i');
    material.className = `ambient-material ${type}`;
    material.style.cssText = `--x:${x};--y:${y};--size:${size};--opacity:${opacity};--speed:${speed};--delay:${delay};--rotate:${rotate};--drift:${10 + index * 4}px`;
    layer.append(material);
  });
  section.prepend(layer);

  if (window.matchMedia('(pointer: fine) and (min-width: 981px)').matches) {
    section.addEventListener('pointermove', (event) => {
      const bounds = section.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - .5) * -10;
      const y = ((event.clientY - bounds.top) / bounds.height - .5) * -8;
      layer.style.transform = `translate3d(${x}px,${y}px,0)`;
    }, { passive: true });
    section.addEventListener('pointerleave', () => {
      layer.style.transform = 'translate3d(0,0,0)';
    });
  }
});

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
