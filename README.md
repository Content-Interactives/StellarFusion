# Stellar Fusion Interactive

> **Status:** Older **prototype**; superseded for curriculum by maintained projects such as **[Content-Interactives/nuclear_fusion](https://github.com/Content-Interactives/nuclear_fusion)** and **[Content-Interactives/Nuclear-Fusion](https://github.com/Content-Interactives/Nuclear-Fusion)**.

**Legacy live site (GitHub Pages):** https://content-interactives.github.io/StellarFusion/

A React single-page visualization of **stellar fusion**: an automated intro, a **hydrogen** phase where learners click pairs of **nearby** hydrogen “atoms” to fuse, then a **helium** phase driven largely by **timed CSS animations** and a scripted fusion sequence (pairs converging, flashes, heavier product dots), ending with a **Supernova** control. The scene is a fixed **600×600** space backdrop with a large gold **star** and a shrinking / expanding **core** region.

## Tech stack

| Layer | Choice |
|--------|--------|
| UI | React 18 |
| Build | Vite 5 with `@vitejs/plugin-react` |
| Styling | **styled-components** 6 (`keyframes`, themed layout); almost all visuals live in component-scoped styled elements |
| CSS baseline | `index.css` pulls in Tailwind directives, but **`tailwind.config.js` sets `content: []`**, so no Tailwind utilities are generated from `src/` |
| Deploy | `gh-pages` publishing `dist/`; Vite **`base: '/StellarFusion/'`** matches the live URL above |

There is no `homepage` field in `package.json`; deployment path follows the repo/GitHub Pages convention implied by `base`.

## Repository layout

```
src/
  main.jsx
  App.jsx                 # Centers StellarFusion in a full-viewport styled wrapper
  App.css
  index.css               # Tailwind layers + global reset / body font
  components/
    StellarFusion.jsx     # Entire experience (state machine, layout, animations)
```

## State machine (`phase`)

| `phase` value | Behavior |
|---------------|----------|
| `intro` | Initial state until the intro timeline finishes |
| `hydrogen` | Core visible; user fuses hydrogen by clicking two eligible atoms |
| `helium` | Core grows toward helium size; scripted helium pair fusions + optional manual code paths (see dead code) |
| `supernova` | Set when **Supernova** is clicked; **no separate UI branch** in JSX — label/text fall through to non-intro helium labeling |

Supporting flags include `currentStep` (intro substeps), `showCore`, `fusionCount`, `heliumAtoms` / `hydrogenAtoms`, `fusionParticles`, `fusionFlashes`, `coreExpandFactor`, `showEnergyPulse`, `showCarbonCore`, `showSupernova`, etc.

## Intro timeline

On mount, **`useEffect`** schedules `setTimeout` at **1s, 3s, 5s, 7s** to increment `currentStep` to **1–4**. At the **last** tick:

- `showCore` → `true`, `phase` → `'hydrogen'`
- **Hydrogen layout:** `n = 25` atoms placed with polar coordinates inside a circle (`coreRadius` 155px, `minDist` 32px, up to 100 tries per atom). Unplaced atoms are skipped.

The **Star** uses `zoomIn` when `currentStep === 1`; overlay **Text** shows while `currentStep` is 1–3.

## Hydrogen phase (user-driven)

- **Atoms:** Cyan circles (`HydrogenAtom`), positioned from stored `(dx, dy)` scaled as the core **shrinks** with `fusionCount`:
  - Effective core radius: `320 * (1 - fusionCount * 0.33) / 2`, compared to original layout radius **155** for scaling.
- **Selection:** Click toggles a two-atom selection. Same atom again clears selection.
- **`canFuse`:** Euclidean distance in **pixel space** (after scale) is under **50px** between the two centers.
- **On fuse:** Both get `fusing: true` briefly, then `isActive: false`; a **`HeliumAtom`** appears at the segment midpoint and animates **outward** (`moveOutAndFade` via `fusingHelium`). After timeouts, `fusionCount` increments.
- **Transition to helium:** When `fusionCount === 3`, after a **2s** delay, `phase` → `'helium'`.

## Helium phase (scripted sequence)

When `phase === 'helium'`:

1. **`useEffect`** sets `coreExpandFactor` from 0 → 1 after **100ms** so **`CoreRegion`** transitions width/height from hydrogen core size (**320px**) toward **`HELIUM_CORE_SIZE`** (**0.75 × 540 = 405px**) over **2s** (`cubic-bezier`).

2. Another **`useEffect`** runs an **`async` sequence**:
   - Wait **2100ms**, then `showEnergyPulse` → `true`
   - Build **3 fusion pairs** of helium particles (fixed **40px** separation) plus **8** non-fusing helium dots, with collision avoidance (`isTooClose`, ~**35px** min separation)
   - For each pair: random wait **1.5–3s**, mark `isFusing`, wait **800ms**, **`FusionFlash`** at fusion point, replace pair with **`type: 'heavier'`** (`appearAndFade`)
   - Then **2s** pause → `showCarbonCore` → **1s** → `showSupernova` and `showEnergyPulse` → false

**HeliumCore** (orange) and **CarbonCore** (brown) are layered inside the core; particles use **`FusionParticle`** / **`HeliumAtom`** with type-specific keyframes (`heliumFusion`, `carbonFusion`, `fusionGlow`, etc.).

## Supernova control

**SupernovaButton** sets `phase` to `'supernova'`. There is **no** conditional rendering for that phase (no explosion scene, no reset). **PhaseLabel** still renders for `phase !== 'intro'` and shows **Helium Fusion** for any non-hydrogen value, including `supernova`.

## Visual constants (top of `StellarFusion.jsx`)

| Symbol | Role |
|--------|------|
| `STAR_SIZE` | 540px — star diameter |
| `HYDROGEN_CORE_SIZE` | 320px — hydrogen core diameter |
| `HELIUM_CORE_SIZE` | `0.75 * STAR_SIZE` — helium core target |
| `backgroundStars` | 50 twinkling dots; positions/delays fixed at module load (`Math.random`) |

## Accessibility and input

- Hydrogen atoms are clickable **`HydrogenAtom`** elements with hover scale.
- Helium **`HeliumAtom`** instances in the scripted map have **`pointer-events: none`** — users cannot click them in the shipped UI.
- No keyboard paths or ARIA live regions for fusion feedback.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server |
| `npm run build` | Output to `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run deploy` | `predeploy` build then `gh-pages -d dist` |
| `npm run lint` | ESLint |

## Dead code and dependencies

- **`handleHeliumClick`** — full helium pair-click fusion logic exists but **no `onClick`** wires it to **`HeliumAtom` / `FusionParticle`** in JSX.
- **`handleReset`** — resets all state; **not** hooked to any control in the UI.
- **`lucide-react`** is listed in **`package.json`** but **not imported** in `src/`.
- **`heliumAtoms`** / **`fusingParticles`** state setters appear unused for meaningful UI paths (inventory may be leftover from an earlier design).

## Comparison with replacement repos

For maintained nuclear-fusion interactives, use the **[nuclear_fusion](https://github.com/Content-Interactives/nuclear_fusion)** or **[Nuclear-Fusion](https://github.com/Content-Interactives/Nuclear-Fusion)** repositories. This repo remains useful as a **historical reference** for the `/StellarFusion/` GitHub Pages path and Vite `base` setting.
