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

  for (const visual of gsap.utils.toArray<HTMLElement>('[data-visual]')) {
    gsap.from(visual.querySelectorAll('[data-visual-part]'), {
      y: 14, scale: 0.94, opacity: 0.42, stagger: 0.19, duration: 0.66, ease: 'power3.out',
      scrollTrigger: { trigger: visual, start: 'top 88%', once: true },
    });
  }

  const process = document.querySelector<HTMLElement>('[data-process-timeline]');
  const steps = gsap.utils.toArray<HTMLElement>('[data-process-step]');
  if (process) {
    gsap.fromTo(process, { '--process-progress': 0 }, {
      '--process-progress': 1, ease: 'none',
      scrollTrigger: { trigger: process, start: 'top 84%', end: 'bottom 56%', scrub: 0.45 },
    });
    for (const step of steps) {
      ScrollTrigger.create({
        trigger: step, start: 'top 84%', once: true,
        onEnter: () => step.setAttribute('data-step-lit', ''),
      });
    }
  }

  const ribbon = document.querySelector<HTMLElement>('[data-hero-ribbon]');
  if (ribbon) {
    gsap.from(ribbon, { x: 15, scale: 0.93, opacity: 0.48, duration: 1.25, ease: 'power3.out' });
    gsap.to(ribbon, {
      y: () => -Math.min(52, ribbon.offsetHeight * 0.17), ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.65, invalidateOnRefresh: true },
    });
  }

  return () => steps.forEach(step => step.removeAttribute('data-step-lit'));
});
