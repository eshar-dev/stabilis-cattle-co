type Cart = Record<string, number>;
type Cut = { id: string; name: string; price: number; left: number; card: HTMLElement; img: string };

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const money = (n: number) => '$' + n.toFixed(0);
const icon = (name: string) => {
  const s = document.createElement('span');
  s.className = 'icon';
  s.setAttribute('aria-hidden', 'true');
  s.style.cssText = `--i:url(/icons/${name}.svg);--s:14px`;
  return s;
};
const KEY = 'stabilis-cart';

export function initCart() {
  const drawer = $('[data-drawer]');
  const scrim = $('[data-scrim]');
  const toast = $('[data-toast]');
  if (!drawer || !scrim || !toast) return;
  const freeAt = Number(drawer.dataset.freeAt || 200);

  const cuts = new Map<string, Cut>();
  $$('[data-cut-card]').forEach((card) => {
    const img = $<HTMLImageElement>('[data-cut-img]', card);
    cuts.set(card.dataset.id!, {
      id: card.dataset.id!,
      name: card.dataset.name!,
      price: Number(card.dataset.price),
      left: Number(card.dataset.left),
      card,
      img: img?.currentSrc || img?.src || '',
    });
  });

  let cart: Cart = {};
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    for (const [id, n] of Object.entries(saved)) if (cuts.has(id) && Number(n) > 0) cart[id] = Math.min(Number(n), cuts.get(id)!.left);
  } catch {}

  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {} };
  const subtotal = () => [...cuts.values()].reduce((a, c) => a + (cart[c.id] || 0) * c.price, 0);
  const count = () => Object.values(cart).reduce((a, b) => a + b, 0);

  const badge = $('[data-cart-badge]');
  const itemsEl = $('[data-cart-items]')!;
  const emptyEl = $('[data-cart-empty]') as HTMLElement;

  function render() {
    const sub = subtotal();
    if (badge) badge.textContent = String(count());

    cuts.forEach((c) => {
      const inCart = cart[c.id] || 0;
      const remaining = c.left - inCart;
      const low = remaining <= 3;
      const card = c.card;
      const badgeEl = $('[data-cut-badge]', card)!;
      badgeEl.textContent = remaining <= 0 ? 'All in your cart' : low ? `Only ${remaining} left` : `${remaining} left`;
      card.toggleAttribute('data-low', low);
      $<HTMLElement>('[data-add]', card)!.hidden = inCart > 0;
      $<HTMLElement>('[data-qty]', card)!.hidden = inCart === 0;
      if (inCart > 0) {
        $('[data-qty-label]', card)!.textContent = remaining <= 0 ? `${inCart} · max reached` : `${inCart} in cart`;
        $('[data-line-total]', card)!.textContent = money(inCart * c.price);
        $<HTMLButtonElement>('[data-inc]', card)!.disabled = remaining <= 0;
        const dec = $<HTMLElement>('[data-dec] .icon', card);
        dec?.style.setProperty('--i', `url(/icons/${inCart === 1 ? 'trash' : 'minus'}.svg)`);
      }
    });

    itemsEl.replaceChildren();
    for (const c of cuts.values()) {
      const n = cart[c.id];
      if (!n) continue;
      const li = document.createElement('li');
      const img = document.createElement('img');
      img.src = c.img; img.alt = ''; img.width = 64; img.height = 64;
      const info = document.createElement('div');
      info.className = 'ci__info';
      info.innerHTML = '<span class="ci__name"></span><span class="ci__price"></span>';
      info.children[0].textContent = c.name;
      info.children[1].textContent = `${money(c.price)} each`;
      const qty = document.createElement('div');
      qty.className = 'ci__qty';
      const dec = document.createElement('button');
      dec.type = 'button'; dec.setAttribute('aria-label', `Remove one ${c.name}`); dec.append(icon('minus'));
      dec.addEventListener('click', () => change(c.id, -1));
      const num = document.createElement('span');
      num.textContent = String(n);
      const inc = document.createElement('button');
      inc.type = 'button'; inc.setAttribute('aria-label', `Add one ${c.name}`); inc.append(icon('plus'));
      inc.disabled = n >= c.left;
      inc.addEventListener('click', () => change(c.id, 1));
      qty.append(dec, num, inc);
      li.append(img, info, qty);
      itemsEl.append(li);
    }
    emptyEl.hidden = count() > 0;

    $('[data-subtotal]')!.textContent = money(sub);
    const freeLabel = sub >= freeAt ? 'Your delivery is free.' : `${money(freeAt - sub)} away from free delivery in DFW`;
    $('[data-free-label]')!.textContent = freeLabel;
    $<HTMLElement>('[data-free-bar]')!.style.width = Math.min(100, (sub / freeAt) * 100) + '%';
    $('[data-toast-free]')!.textContent = freeLabel;
  }

  function change(id: string, d: number) {
    const c = cuts.get(id)!;
    const n = Math.max(0, Math.min(c.left, (cart[id] || 0) + d));
    if (n) cart[id] = n; else delete cart[id];
    save();
    render();
  }

  let toastT: number | undefined;
  function showToast(c: Cut) {
    const img = $<HTMLImageElement>('[data-toast-img]')!;
    img.src = c.img;
    $('[data-toast-title]')!.textContent = `${c.name} added · ${money(subtotal())} subtotal`;
    toast!.classList.add('is-on');
    window.clearTimeout(toastT);
    toastT = window.setTimeout(() => toast!.classList.remove('is-on'), 3200);
  }

  function flyToCart(c: Cut) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const src = $<HTMLImageElement>('[data-cut-img]', c.card);
    if (!src || !badge) return;
    const a = src.getBoundingClientRect();
    const b = badge.getBoundingClientRect();
    const size = Math.min(a.width, 120);
    const fly = document.createElement('img');
    fly.src = src.currentSrc || src.src;
    fly.alt = '';
    Object.assign(fly.style, {
      position: 'fixed', left: `${a.left + a.width / 2 - size / 2}px`, top: `${a.top + a.height / 2 - size / 2}px`,
      width: `${size}px`, height: `${size}px`, objectFit: 'cover', borderRadius: '50%', zIndex: '200', pointerEvents: 'none',
      boxShadow: '0 12px 32px rgba(19,46,32,.35)', transformOrigin: 'center',
    });
    document.body.append(fly);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    const anim = fly.animate(
      [
        { transform: 'translate(0,0) scale(.9)', opacity: 0 },
        { transform: 'translate(0,0) scale(1)', opacity: 1, offset: 0.2 },
        { transform: `translate(${dx}px,${dy}px) scale(.18)`, opacity: 1, offset: 0.88 },
        { transform: `translate(${dx}px,${dy}px) scale(.18)`, opacity: 0 },
      ],
      { duration: 900, easing: 'cubic-bezier(.65,0,.35,1)' },
    );
    anim.onfinish = () => {
      fly.remove();
      badge.animate([{ transform: 'scale(1.35)' }, { transform: 'scale(1)' }], { duration: 500, easing: 'cubic-bezier(.34,1.56,.64,1)' });
    };
  }

  // Drawer open / close with focus management
  let opener: HTMLElement | null = null;
  const closeBtn = $<HTMLButtonElement>('[data-cart-close]')!;
  function open(from?: HTMLElement) {
    opener = from ?? (document.activeElement as HTMLElement);
    toast!.classList.remove('is-on');
    drawer!.classList.add('is-on');
    scrim!.classList.add('is-on');
    drawer!.removeAttribute('inert');
    drawer!.setAttribute('aria-hidden', 'false');
    closeBtn.focus();
  }
  function close() {
    drawer!.classList.remove('is-on');
    scrim!.classList.remove('is-on');
    drawer!.setAttribute('inert', '');
    drawer!.setAttribute('aria-hidden', 'true');
    opener?.focus?.();
  }
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const o = t.closest<HTMLElement>('[data-cart-open]');
    if (o) { open(o); return; }
    if (t.closest('[data-cart-close]') || t === scrim) close();
  });
  window.addEventListener('keydown', (e) => e.key === 'Escape' && drawer.classList.contains('is-on') && close());

  // Cut card buttons
  cuts.forEach((c) => {
    $('[data-add]', c.card)!.addEventListener('click', () => {
      if ((cart[c.id] || 0) >= c.left) return;
      change(c.id, 1);
      showToast(c);
      flyToCart(c);
    });
    $('[data-inc]', c.card)!.addEventListener('click', () => { change(c.id, 1); showToast(c); flyToCart(c); });
    $('[data-dec]', c.card)!.addEventListener('click', () => change(c.id, -1));
  });

  // TODO: hand the cart to Shopify (cart permalink /cart/{variantId}:{qty},...) once variants are mapped.
  $('[data-checkout]')?.addEventListener('click', () => {});

  render();
}
