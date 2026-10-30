# Thelma Agnes Peter · Portfolio

Live at **https://mithuncreates99.github.io/thelma/**

React + TypeScript + Vite, animated with GSAP (ScrollTrigger).

## Change the text

Everything the site says lives in **`src/content.ts`**: name, roles, stats,
projects, timeline, recognition, certifications and contact details. Edit it
on GitHub and commit; the site rebuilds and goes live in about two minutes.

The phone number is left off on purpose (`contact.phone`).

## Change the photo

Replace `src/assets/img/thelma-cutout-900.webp` and `thelma-cutout-560.webp`
with a cut-out photo (transparent background). Its position inside the arch
is set by `.arch img` in `src/index.css`.

## Run it locally

    npm install
    npm run dev

`npm run build` type-checks, then builds to `dist/`.

## Motion

- Opening curtain, then the hero builds in: arch opens, portrait sharpens, name rises line by line.
- Scrolling the hero pushes the portrait forward while the text lifts away; the frame tilts toward the cursor.
- Each project illustration plays on a loop while it is on screen.
- The timeline pins on desktop and a playhead scrubs from 2020 to today as you scroll; on phones it pans across the years.
- Everything respects "reduce motion" in the system settings.
