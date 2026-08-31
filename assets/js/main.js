(() => {
  const config = window.SITE_CONFIG.business;
  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => [...root.querySelectorAll(selector)];

  qa('[data-phone]').forEach(link => { link.href = `tel:${config.phoneRaw}`; if (link.dataset.phone === 'text') link.textContent = config.phoneDisplay; });
  const waUrl = `https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(config.whatsappMessage)}`;
  qa('[data-whatsapp]').forEach(link => link.href = waUrl);

  const menuButton = q('.menu-button');
  const nav = q('.site-nav');
  const closeMenu = () => { nav?.classList.remove('open'); menuButton?.setAttribute('aria-expanded', 'false'); };
  menuButton?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  qa('.site-nav a').forEach(link => link.addEventListener('click', closeMenu));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const observer = 'IntersectionObserver' in window && !reducedMotion
    ? new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('revealed')), { threshold: .12 })
    : null;
  qa('[data-reveal]').forEach(el => observer ? observer.observe(el) : el.classList.add('revealed'));

  const compareHintObserver = 'IntersectionObserver' in window && !reducedMotion
    ? new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-hinting');
      setTimeout(() => entry.target.classList.remove('is-hinting'), 2500);
      compareHintObserver.unobserve(entry.target);
    }), { threshold: .35 })
    : null;

  qa('.compare').forEach(compare => {
    const range = q('input[type="range"]', compare);
    const after = q('.compare-after', compare);
    if (!range || !after) return;
    const update = () => { after.style.clipPath = `inset(0 0 0 ${range.value}%)`; compare.style.setProperty('--split', `${range.value}%`); };
    const dismissHint = () => compare.classList.remove('is-hinting');
    range.addEventListener('pointerdown', dismissHint);
    range.addEventListener('input', () => { dismissHint(); update(); });
    update();
    if (compareHintObserver) compareHintObserver.observe(compare);
    else if (!reducedMotion) {
      compare.classList.add('is-hinting');
      setTimeout(() => compare.classList.remove('is-hinting'), 2500);
    }
  });

  const track = q('.review-track');
  const reviewDots = qa('.review-dot');
  let reviewIndex = 0;
  let reviewTimer;
  const showReview = index => {
    if (!track) return;
    reviewIndex = (index + reviewDots.length) % reviewDots.length;
    track.style.transform = `translateX(-${reviewIndex * 100}%)`;
    reviewDots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === reviewIndex)));
  };
  const startReviews = () => { clearInterval(reviewTimer); reviewTimer = setInterval(() => showReview(reviewIndex + 1), 3800); };
  reviewDots.forEach((dot, i) => dot.addEventListener('click', () => { showReview(i); startReviews(); }));
  track?.parentElement?.addEventListener('pointerenter', () => clearInterval(reviewTimer));
  track?.parentElement?.addEventListener('pointerleave', startReviews);
  if (track && !reducedMotion) startReviews();

  const filters = qa('[data-filter]');
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    qa('[data-category]').forEach(card => card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter);
  }));

  const projects = qa('[data-hero-project]');
  const projectDots = qa('[data-project-dot]');
  let projectIndex = 0;
  let projectTimer;
  const showProject = index => {
    projectIndex = (index + projects.length) % projects.length;
    projects.forEach((project, i) => project.classList.toggle('active', i === projectIndex));
    projectDots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === projectIndex)));
  };
  const startProjects = () => {
    if (reducedMotion || !projects.length) return;
    clearInterval(projectTimer);
    projectTimer = setInterval(() => showProject(projectIndex + 1), 4000);
  };
  projectDots.forEach((dot, i) => dot.addEventListener('click', () => { showProject(i); startProjects(); }));
  qa('.work-hero .compare input').forEach(range => {
    range.addEventListener('pointerdown', () => clearInterval(projectTimer));
    range.addEventListener('change', () => setTimeout(startProjects, 1600));
  });
  startProjects();
})();
