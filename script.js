document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Age gate ---------- */
function enterSite(){
  document.getElementById('agegate').style.display = 'none';
  document.getElementById('site').style.display = 'block';
  document.body.classList.remove('locked');
  initSite();
}

/* ---------- Everything below only runs once the visitor is inside ---------- */
function initSite(){

  /* Mobile menu toggle */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if(hamburger && mobileMenu){
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      document.body.classList.toggle('menu-open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Active nav link tracking */
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if('IntersectionObserver' in window && sections.length){
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const id = '#' + entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(section => navObserver.observe(section));
  }

  /* Scroll-reveal animations */
  const revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && revealEls.length){
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* Menu category tabs */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.menu-panel');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabButtons.forEach(b => b.classList.toggle('active', b === btn));
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === target));
    });
  });

  /* Testimonial carousel */
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dots button');
  let current = 0;
  let carouselTimer;

  function showSlide(i){
    current = i;
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
  }
  function nextSlide(){
    showSlide((current + 1) % slides.length);
  }
  function startCarousel(){
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(slides.length > 1 && !reduceMotion){
      carouselTimer = setInterval(nextSlide, 5000);
    }
  }
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      clearInterval(carouselTimer);
      showSlide(idx);
      startCarousel();
    });
  });
  if(slides.length){
    showSlide(0);
    startCarousel();
  }

  /* Sticky mobile order bar: show after hero, hide near the very bottom */
  const stickyBar = document.getElementById('stickyOrder');
  const hero = document.querySelector('.hero');
  if(stickyBar && hero){
    const heroHeight = hero.offsetHeight;
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const nearBottom = (window.innerHeight + scrolled) >= document.body.scrollHeight - 80;
      stickyBar.classList.toggle('show', scrolled > heroHeight * 0.6 && !nearBottom);
    }, { passive: true });
  }
}

/* If the age gate was already dismissed earlier in this session, initSite()
   still runs only after enterSite() is clicked — by design, every visit asks again. */