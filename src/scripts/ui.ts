const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));

export function initUi() {
  nav();
  steps();
  signup();
}

function nav() {
  const header = $('[data-nav]');
  const toggle = $<HTMLButtonElement>('[data-menu-toggle]');
  const menu = $('[data-menu]');
  if (!header || !toggle || !menu) return;

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const set = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  };
  toggle.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('[data-menu-link]').forEach((a) => a.addEventListener('click', () => set(false)));
  window.addEventListener('keydown', (e) => e.key === 'Escape' && set(false));
  window.matchMedia('(min-width: 1140px)').addEventListener('change', (e) => e.matches && set(false));
}

function steps() {
  const root = $('[data-steps]');
  const raw = $('#steps-data')?.textContent;
  if (!root || !raw) return;
  const data: { title: string; body: string; note: string }[] = JSON.parse(raw);
  const imgs = $$('[data-step-img]', root);
  const kicker = $('[data-step-kicker]', root)!;
  const title = $('[data-step-title]', root)!;
  const body = $('[data-step-body]', root)!;
  const note = $('[data-step-note]', root)!;
  const count = $('[data-step-count]', root)!;
  let i = 0;
  let timer: number | undefined;
  let paused = false;

  const show = (n: number) => {
    i = (n + data.length) % data.length;
    imgs.forEach((im, k) => im.classList.toggle('is-active', k === i));
    kicker.textContent = `Step ${i + 1} of ${data.length}`;
    title.textContent = data[i].title;
    body.textContent = data[i].body;
    note.textContent = data[i].note;
    note.hidden = !data[i].note;
    count.textContent = `0${i + 1} / 0${data.length}`;
  };
  const schedule = () => {
    window.clearTimeout(timer);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = window.setTimeout(() => {
      if (!paused) show(i + 1);
      schedule();
    }, 6500);
  };

  $('[data-step-prev]', root)?.addEventListener('click', () => { show(i - 1); schedule(); });
  $('[data-step-next]', root)?.addEventListener('click', () => { show(i + 1); schedule(); });
  root.addEventListener('mouseenter', () => (paused = true));
  root.addEventListener('mouseleave', () => (paused = false));
  root.addEventListener('focusin', () => (paused = true));
  root.addEventListener('focusout', () => (paused = false));
  schedule();
}

function signup() {
  const form = $<HTMLFormElement>('[data-signup]');
  if (!form) return;
  const error = $('[data-signup-error]')!;
  const ok = $('[data-signup-ok]')!;
  const fine = $('[data-signup-fine]')!;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const email = String(data.get('email') ?? '').trim();
    error.hidden = /^\S+@\S+\.\S+$/.test(email);
    if (!error.hidden) return;
    if (data.get('company')) return; // honeypot
    // TODO: POST `email` to the client's list (Klaviyo / Shopify customer / Cloudflare Pages Function).
    form.hidden = true;
    fine.hidden = true;
    ok.hidden = false;
  });
}
