# Mithun Kumar V — Portfolio

A cinematic, editorial portfolio built with React, TypeScript and Vite, animated with GSAP (+ ScrollTrigger) and Framer Motion.

## Also in this repo

`thelma/` holds a second, separate portfolio (Thelma Agnes Peter) with its own design and content (`thelma/src/content.ts`). The deploy workflow builds it and publishes it at `/thelma/`. Work on it from inside that folder (`cd thelma && npm install && npm run dev`).

## Run it

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
npm run lint       # oxlint
npm run typecheck  # tsc only
```

Requires Node 20 or newer.

## Where things live

| What | File |
| --- | --- |
| All facts (profile, education, projects, awards, skills) | `src/content/profile.ts` |
| Contact links and optional fields | `src/content/contact.ts` |
| Torch reveal (reusable) | `src/components/Flashlight.tsx` |
| Hand illustration | `src/components/HandIllustration.tsx` |
| Contact overlay | `src/components/ContactOverlay.tsx` |
| Chapters | `src/sections/*.tsx` |
| Design tokens, grain, shared type | `src/index.css` |
| Images (WebP) | `src/assets/img/` |

Every sentence about Mithun comes from the CV or from the Tell Me repository (README, `docs/CASE_STUDY.md`, `web/package.json`). Edit `src/content/profile.ts` when something changes — nothing else repeats those facts.

## Configuration values

`src/content/contact.ts`:

- `email`, `linkedin`, `github` — filled in from the CV and the GitHub account.
- `phone` — **optional, empty on purpose.** Add a number to show it in the contact overlay.
- `cvUrl` — **optional, empty.** Put a PDF in `public/` (e.g. `public/Mithun_Kumar_V_CV.pdf`) and set `cvUrl: './Mithun_Kumar_V_CV.pdf'` to add a download row.

An empty field is never rendered, so no placeholder link can go live.

## How the motion is split

- **GSAP + ScrollTrigger**: hero opening timeline, scroll parallax, image masks, the pinned horizontal case files, diagram drawing, section entrances, the threads (draw-on, sway, pointer lean) and the hand's tug.
- **Framer Motion**: buttons, hover/tap feedback, navigation states (active underline, hide on scroll, mobile menu), the pill's 3D tilt and light sweep, and the pill-to-overlay morph.
- The two never animate the same property on the same element: GSAP moves wrappers, Framer moves the interactive element inside.
- `prefers-reduced-motion`: GSAP animations are registered inside `gsap.matchMedia()` and skipped; case files stack instead of pinning; threads render static; Framer uses `MotionConfig reducedMotion="user"`.
- Low-power devices (≤2 cores, ≤2 GB, or Data Saver): no torch glow or smoothing, no thread sway, static grain.

## The torch (`<Flashlight>`)

```tsx
<Flashlight
  label="What the region shows"     // accessible name
  base={<Scene lit={false} />}      // dark layer, aria-hidden
  reveal={<Scene lit />}            // lit layer, the accessible content
  radius={230}                      // px at desktop, scales with the box
  core={0.3}                        // fully lit share of the radius
  glow                              // warm glow (auto-off on low power)
  smoothing={0.16}                  // pointer lag, 1 = none
  rest={{ x: 62, y: 46 }}           // resting spot in %
/>
```

A CSS mask on the lit layer follows `--x/--y/--r` custom properties. Pointer events only store a target; a `requestAnimationFrame` loop eases towards it and stops once settled, so React never re-renders on pointer moves. Touch: tap moves the beam, horizontal drags follow, vertical swipes scroll. A **Lights on** toggle reveals everything (keyboard and screen-reader friendly).

## Deploying to GitHub Pages

The build uses a relative base (`base: './'`), so `dist/` works from any path.

1. Create a repository (e.g. `portfolio`) and push this folder.
2. In the repository: **Settings → Pages → Source: GitHub Actions**, then add the standard "Static HTML" workflow pointing at `dist/` after `npm ci && npm run build` — or build locally and publish `dist/` to a `gh-pages` branch.

## Before publishing

- [ ] Contact links open the right profiles; add `phone` / `cvUrl` if wanted.
- [ ] Facts match the latest CV (`src/content/profile.ts`).
- [ ] The campus captions say "NEOMA, Rouen campus" — change them in `src/sections/Frame.tsx` and `src/sections/Hero.tsx` if the photo was taken elsewhere.
- [ ] Torch and threads tested on a phone (tap, drag) and with a mouse.
- [ ] Contact overlay: opens with Enter, Tab stays inside, Escape and the close button both work.
- [ ] `npm run build`, then `npm run preview` and check the browser console.
- [ ] Mobile layout and reduced motion (macOS: Accessibility → Display → Reduce motion).
