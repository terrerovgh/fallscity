const carousel = document.querySelector<HTMLElement>('[data-benefits-carousel]');
const viewport = carousel?.querySelector<HTMLElement>('[data-benefit-slides]');
const controls = carousel?.querySelector<HTMLElement>('[data-benefit-controls]');
const announcement = carousel?.querySelector<HTMLElement>('[data-benefit-status]');
const replay = carousel?.querySelector<HTMLButtonElement>('[data-benefit-replay]');
const slides = Array.from(carousel?.querySelectorAll<HTMLElement>('[data-benefit-slide]') ?? []);
const dots = Array.from(carousel?.querySelectorAll<HTMLButtonElement>('[data-benefit-select]') ?? []);
const previous = carousel?.querySelector<HTMLButtonElement>('[data-benefit-step="-1"]');
const next = carousel?.querySelector<HTMLButtonElement>('[data-benefit-step="1"]');

if (carousel && viewport && controls && announcement && replay && previous && next && slides.length > 1) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let pending: number | undefined;
  let inView = false;
  let scrollTimer: number | undefined;

  const stop = () => slides[current]?.removeAttribute('data-playing');

  function play() {
    if (!inView || pending !== undefined || reduceMotion.matches) return;
    slides[current]?.setAttribute('data-playing', '');
  }

  function sync() {
    const index = Math.min(slides.length - 1, Math.max(0, Math.round(viewport!.scrollLeft / viewport!.clientWidth)));
    pending = undefined;
    if (index !== current) {
      stop();
      current = index;
      dots.forEach((dot, position) => {
        if (position === current) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      previous!.setAttribute('aria-disabled', String(current === 0));
      next!.setAttribute('aria-disabled', String(current === slides.length - 1));
      announcement!.textContent = slides[current]?.dataset.benefitTitle ?? '';
    }
    play();
  }

  function go(index: number) {
    const target = Math.min(slides.length - 1, Math.max(0, index));
    if (target === (pending ?? current)) return;
    stop();
    pending = target;
    const left = target * viewport!.clientWidth;
    if (Math.abs(left - viewport!.scrollLeft) < 1) {
      viewport!.scrollTo({ left, behavior: 'instant' });
      sync();
      return;
    }
    viewport!.scrollTo({ left, behavior: reduceMotion.matches ? 'instant' : 'smooth' });
  }

  carousel.dataset.enhanced = '';
  controls.hidden = false;
  previous.addEventListener('click', () => go((pending ?? current) - 1));
  next.addEventListener('click', () => go((pending ?? current) + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => go(index)));
  viewport.addEventListener('keydown', event => {
    const targets = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: slides.length - 1 };
    if (!(event.key in targets)) return;
    event.preventDefault();
    go(targets[event.key as keyof typeof targets]);
  });
  viewport.addEventListener('scroll', () => {
    stop();
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(sync, 120);
  }, { passive: true });
  replay.addEventListener('click', () => {
    stop();
    // Commit the removal before applying the same animation to the same elements.
    void slides[current]?.offsetWidth;
    play();
  });
  new IntersectionObserver(([entry]) => {
    inView = (entry?.intersectionRatio ?? 0) >= 0.34;
    if (inView) play();
    else stop();
  }, { threshold: 0.34 }).observe(viewport);
  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches) stop();
    else play();
  });
}
