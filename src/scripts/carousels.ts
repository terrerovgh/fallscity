function initCarousel(track: HTMLElement) {
  const slides = [...track.querySelectorAll<HTMLElement>(':scope > [data-carousel-slide]')];
  const delay = Number(track.dataset.carousel);
  if (slides.length < 2 || !delay) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let autoTimer: number | undefined;
  let settleTimer: number | undefined;
  let inView = false;
  let hovered = false;
  let touched = false;
  let moving = false;
  let loop: HTMLElement | undefined;

  const leftFor = (index: number) => track.clientWidth * index;
  const canAdvance = () =>
    inView && !reduced.matches && !document.hidden && !hovered && !touched &&
    !moving && !track.contains(document.activeElement);

  function refreshScene() {
    for (const [index, slide] of slides.entries()) {
      slide.toggleAttribute('data-playing', inView && !reduced.matches && index === current);
    }
  }

  function schedule() {
    window.clearTimeout(autoTimer);
    if (canAdvance()) autoTimer = window.setTimeout(advance, delay);
  }

  function settle() {
    window.clearTimeout(settleTimer);
    const index = Math.round(track.scrollLeft / track.clientWidth);
    if (loop) {
      if (index >= slides.length) track.scrollTo({ left: 0, behavior: 'instant' });
      loop.remove();
      loop = undefined;
    }
    current = index >= slides.length ? 0 : Math.max(0, index);
    moving = false;
    refreshScene();
    schedule();
  }

  function move(index: number, behavior: ScrollBehavior) {
    if (Math.abs(track.scrollLeft - leftFor(index)) < 1) {
      settle();
      return;
    }
    moving = true;
    window.clearTimeout(autoTimer);
    track.scrollTo({ left: leftFor(index), behavior });
  }

  function advance() {
    if (!canAdvance()) return;
    if (current === slides.length - 1) {
      // The extra slide exists only during the wrap and cannot receive focus.
      loop = slides[0].cloneNode(true) as HTMLElement;
      loop.inert = true;
      loop.setAttribute('aria-hidden', 'true');
      loop.removeAttribute('data-playing');
      loop.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
      loop.querySelectorAll('astro-island').forEach(island => island.replaceWith(...island.childNodes));
      track.append(loop);
    }
    move(current + 1, 'smooth');
  }

  track.dataset.enhanced = '';
  track.addEventListener('scroll', () => {
    moving = true;
    window.clearTimeout(autoTimer);
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(settle, 150);
  }, { passive: true });
  track.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') {
      hovered = true;
      schedule();
    }
  });
  track.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse') {
      hovered = false;
      schedule();
    }
  });
  track.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse') {
      touched = true;
      schedule();
    }
  }, { passive: true });
  track.addEventListener('focusin', schedule);
  track.addEventListener('focusout', schedule);
  track.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const index = Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth));
    const destination = {
      ArrowLeft: Math.max(0, index - 1),
      ArrowRight: Math.min(slides.length - 1, index + 1),
      Home: 0,
      End: slides.length - 1,
    }[event.key];
    if (destination === undefined) return;
    event.preventDefault();
    move(destination, reduced.matches ? 'instant' : 'smooth');
  });

  const observer = new IntersectionObserver(([entry]) => {
    inView = (entry?.intersectionRatio ?? 0) >= 0.35;
    if (!inView) touched = false;
    refreshScene();
    schedule();
  }, { threshold: 0.35 });
  observer.observe(track);
  reduced.addEventListener('change', () => {
    if (reduced.matches && moving) {
      track.scrollTo({ left: leftFor(current), behavior: 'instant' });
      settle();
      return;
    }
    refreshScene();
    schedule();
  });
  document.addEventListener('visibilitychange', schedule);
}

document.querySelectorAll<HTMLElement>('[data-carousel]').forEach(initCarousel);
