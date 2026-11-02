# Stabilis Cattle Co. homepage

Ranch-direct beef storefront homepage, built with [Astro](https://astro.build) and deployed on Cloudflare Workers.

Live: https://stabilis.esharrr.workers.dev

## Commands

| Command            | What it does                                  |
| ------------------ | --------------------------------------------- |
| `npm install`      | Install dependencies                          |
| `npm run dev`      | Start the dev server at `localhost:4321`      |
| `npm run build`    | Build to `dist/`                              |
| `npm run deploy`   | Build and deploy to Cloudflare (`wrangler`)   |

## Structure

- `src/pages/index.astro` – thin page that stacks section components
- `src/components/sections/` – one component per homepage section
- `src/data/store.ts` – cuts, steps, FAQs, breeds and the `orderingState` switch (`open` / `between`)
- `src/scripts/` – cart, UI and motion (GSAP + Lenis load on idle)
- `src/styles/tokens.css` – design tokens

## To do before launch

- Set the real domain in `astro.config.mjs` and `public/robots.txt`
- Connect checkout and the email signup (marked `TODO` in `src/scripts`)
- Replace sample cuts with the Shopify feed
- Fill the highlighted `[placeholders]` with client copy
