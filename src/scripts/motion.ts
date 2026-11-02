import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const q = <T extends Element = HTMLElement>(s: string) => Array.from(document.querySelectorAll<T>(s));

export function initMotion() {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({ lerp: 0.085, anchors: { offset: -80 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  const easeOut = 'expo.out';
  const mm = gsap.matchMedia();

  mm.add({ desk: '(min-width: 1100px)', fine: '(pointer: fine)' }, (ctx) => {
    const { desk, fine } = ctx.conditions as { desk: boolean; fine: boolean };

    // Hero
    gsap.from('[data-hero-bg] img, [data-hero-fg] img', { scale: 1.06, duration: 2.2, ease: 'expo.out', transformOrigin: '56% 80%' });
    gsap.from('[data-hero-line]', { yPercent: 95, opacity: 0, duration: 1.5, ease: 'expo.out', stagger: 0.14, delay: 0.25 });
    gsap.from('[data-hero-fade]', { y: 18, opacity: 0, duration: 1, ease: easeOut, stagger: 0.1, delay: 0.55 });
    gsap.from('[data-hero-cta] > *', { y: 24, opacity: 0, duration: 1, ease: easeOut, stagger: 0.1, delay: 0.8, clearProps: 'transform,opacity' });
    const heroTrigger = { trigger: '[data-hero-stage]', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('[data-hero-text]', { yPercent: 28, ease: 'none', scrollTrigger: heroTrigger });
    gsap.to('[data-hero-bg], [data-hero-fg]', { yPercent: -4, ease: 'none', scrollTrigger: heroTrigger });

    const stage = document.querySelector<HTMLElement>('[data-hero-stage]');
    if (stage && fine) {
      const mk = (sel: string, d: number) => {
        const el = document.querySelector(sel);
        return el ? { x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }), y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' }), d } : null;
      };
      const layers = [mk('[data-hero-bg]', 8), mk('[data-hero-fg]', 8), mk('[data-hero-text]', 22)].filter((l): l is NonNullable<typeof l> => !!l);
      const move = (e: PointerEvent) => {
        const r = stage.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
        layers.forEach((l) => { l.x(-nx * l.d); l.y(-ny * l.d * 0.5); });
      };
      const leave = () => layers.forEach((l) => { l.x(0); l.y(0); });
      stage.addEventListener('pointermove', move);
      stage.addEventListener('pointerleave', leave);
      return () => { stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerleave', leave); };
    }
  });

  mm.add({ desk: '(min-width: 1100px)' }, (ctx) => {
    const { desk } = ctx.conditions as { desk: boolean };

    gsap.to('[data-pulse]', { opacity: 0.25, duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    q('[data-reveal]').forEach((el) => {
      gsap.from(el, { y: 32, opacity: 0, duration: 1, ease: easeOut, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    // Pinned horizontal scroller for the open animal's cuts
    const sec = document.querySelector<HTMLElement>('[data-hsection]');
    const vp = document.querySelector<HTMLElement>('[data-hviewport]');
    const track = document.querySelector<HTMLElement>('[data-htrack]');
    const intro = document.querySelector<HTMLElement>('[data-hintro]');
    const stage = document.querySelector<HTMLElement>('[data-hstage]');
    if (sec && vp && track && intro && stage) {
      if (desk) {
        vp.style.overflowX = 'hidden';
        const dist = () => Math.max(0, track.scrollWidth - vp.clientWidth);
        const shift = () => Math.max(0, stage.offsetTop - Math.max(112, 84 + (window.innerHeight - 84 - stage.offsetHeight) / 2));
        const r = shift() > 0 ? dist() / shift() : 1;
        const tl = gsap.timeline({ scrollTrigger: { trigger: sec, pin: true, scrub: 0.8, start: 'top top', end: () => '+=' + (shift() + dist()), invalidateOnRefresh: true, anticipatePin: 1 } });
        tl.fromTo(intro, { y: 0, opacity: 1 }, { y: () => -shift() * 0.7, opacity: 0, ease: 'power2.in', duration: 1 }, 0)
          .to(stage, { y: () => -shift(), ease: 'power2.inOut', duration: 1 }, 0)
          .fromTo('[data-cut-card]', { y: 120, opacity: 0 }, { y: 0, opacity: 1, ease: 'power3.out', duration: 0.6, stagger: 0.07 }, 0.15)
          .to(track, { x: () => -dist(), ease: 'none', duration: r }, 1)
          .fromTo('[data-hprogress]', { scaleX: 0.08 }, { scaleX: 1, ease: 'none', duration: r }, 1);
        return () => { vp.style.overflowX = ''; };
      }
    }
  });

  mm.add({ mob: '(max-width: 1099px)' }, () => {
    gsap.to('[data-pulse]', { opacity: 0.25, duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    q('[data-reveal]').forEach((el) => {
      gsap.from(el, { y: 32, opacity: 0, duration: 1, ease: easeOut, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    const sec = document.querySelector('[data-hsection]');
    if (sec) gsap.from('[data-cut-card]', { x: 48, opacity: 0, stagger: 0.06, duration: 0.8, ease: easeOut, scrollTrigger: { trigger: sec, start: 'top 70%', once: true } });
  });

  // Shared scroll effects, all viewports
  gsap.fromTo('[data-marquee]', { xPercent: 0 }, { xPercent: -35, ease: 'none', scrollTrigger: { trigger: '[data-marquee]', start: 'top bottom', end: 'bottom top', scrub: 0.5 } });
  gsap.fromTo('[data-breed-ill]', { yPercent: 105 }, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '[data-breed-row]', start: 'top 75%', once: true } });
  q('[data-parallax-img]').forEach((im) => gsap.fromTo(im, { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: im.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
  q('[data-pattern]').forEach((p) => gsap.fromTo(p, { yPercent: -6, xPercent: -2 }, { yPercent: 6, xPercent: 2, ease: 'none', scrollTrigger: { trigger: p.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
  gsap.from('[data-strip]', { y: 24, opacity: 0, stagger: 0.1, duration: 0.9, ease: easeOut, scrollTrigger: { trigger: '[data-strip]', start: 'top 85%', once: true } });
  gsap.from('[data-way]', { y: 48, opacity: 0, stagger: 0.08, duration: 1, ease: easeOut, scrollTrigger: { trigger: '[data-way]', start: 'top 85%', once: true } });

  window.addEventListener('load', () => ScrollTrigger.refresh());
  setTimeout(() => ScrollTrigger.refresh(), 800);
}
