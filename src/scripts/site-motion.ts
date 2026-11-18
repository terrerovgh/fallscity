import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const motion = gsap.matchMedia();
motion.add('(prefers-reduced-motion: no-preference)', () => {
  for (const project of gsap.utils.toArray<HTMLElement>('[data-scroll-project]')) {
    const tracks = project.querySelectorAll<HTMLElement>('[data-screen-track]');
    gsap.fromTo(tracks, { y: 0 }, {
      y: (_, track: HTMLElement) => -Math.max(0, track.offsetHeight - (track.parentElement?.clientHeight ?? 0)),
      ease: 'none',
      scrollTrigger: {
        trigger: project,
        start: 'top 78%',
        end: 'bottom 25%',
        scrub: 0.45,
        invalidateOnRefresh: true,
      },
    });
  }

  for (const heading of gsap.utils.toArray<HTMLElement>('[data-scroll-heading], #contact-title')) {
    gsap.from(heading, {
      y: 22, opacity: 0.65, duration: 0.72, ease: 'power3.out',
      scrollTrigger: { trigger: heading, start: 'top 91%', once: true },
    });
  }

  const ribbon = document.querySelector<HTMLElement>('[data-hero-ribbon]');
  if (ribbon) {
    gsap.to(ribbon, {
      y: -58, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.65 },
    });
  }
});
