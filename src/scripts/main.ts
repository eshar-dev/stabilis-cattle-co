import { initCart } from './cart';
import { initUi } from './ui';

initUi();
initCart();

// Motion libraries (GSAP + Lenis) are not needed to read or use the page,
// so they load after the browser is idle.
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce) {
  const start = () => import('./motion').then((m) => m.initMotion());
  if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 1500 });
  else setTimeout(start, 300);
}
