# Design System: CodeKrafters Website

**Project:** CodeKrafters SRM RMP Official Website & KraftersLink  
**Aesthetic Style:** Neo-Brutalist / Retro-Pop Tactile Design System  

---

## 1. Visual Theme & Atmosphere

The CodeKrafters design system combines **Neo-Brutalism** with a warm, energetic **Retro-Pop** aesthetic. It is defined by tactile depth, crisp high-contrast outlines, paper-like background textures, vibrant golden amber accents, and playful floating depth effects. 

- **Mood:** Energetic, Bold, Playful, Precise, Tech-forward.
- **Density:** Spacious with high visual hierarchy and clear card encapsulation.
- **Tactile Depth:** Layered elements with offset hard drop shadows (`shadow-[6px_6px_0_#0D0D0D]`) and soft blurred shadow holes beneath floating components.

---

## 2. Color Palette & Roles

| Color Name | Hex / Value | Tailwind Reference | Functional Role |
| :--- | :--- | :--- | :--- |
| **Vintage Cream Background** | `#FFEFB4` | `bg-[#FFEFB4]` | Primary page background tone with paper-texture overlay. |
| **Card Off-White** | `#F9F7E5` | `bg-[#f9f7e5]` | Surface background for cards, containers, and elevated modules. |
| **Golden Amber Accent** | `#F2A516` / `#F2B200` | `bg-[#F2A516]`, `text-[#F2A516]` | Primary brand accent color used for tags, progress bars, active states, and highlights. |
| **Inner Circle Warm Glow** | `#FFF2C6` | `bg-[#FFF2C6]` | Inner image container fill and secondary highlights. |
| **Deep Pitch Black** | `#0D0D0D` | `bg-[#0D0D0D]`, `border-[#0D0D0D]` | Primary borders, typography, pill navigation containers, and hard drop shadows. |
| **Muted Dark Charcoal** | `#333333` | `text-[#333333]` | Body text, descriptions, and secondary metadata. |
| **Off-White Text** | `#FFEFB4` / `#F2F2F2` | `text-[#FFEFB4]` | Text inside dark buttons, pills, and navigation overlays. |

---

## 3. Typography & Text Hierarchy

- **Primary Heading Font:** Heavy, Black, uppercase typography (Russo One / Montserrat / Inter ExtraBold).
  - *Title Styling:* `font-extrabold uppercase tracking-tight text-[#0D0D0D]`.
  - *Accent Underlines:* Heavy offset underline `underline decoration-[#0D0D0D] decoration-4 underline-offset-4`.
- **Subtitles & Role Badges:** Uppercase, tracking-wide text in Golden Amber (`#F2A516`), `font-bold text-xs sm:text-sm tracking-wide`.
- **Body & Descriptions:** Medium weight text in Dark Charcoal (`#333333`), line-clamped for consistent card alignment (`text-xs sm:text-sm font-medium`).

---

## 4. Component Stylings & Patterns

### A. Neo-Brutalist Cards (`.ck-card`)
- **Structure:** `bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-6 flex flex-col items-center text-center`.
- **Hard Drop-Shadow:** `shadow-[6px_6px_0_#0D0D0D]` on idle, scaling to `shadow-[10px_10px_0_#0D0D0D]` on hover.
- **Floating Ambient Glow:** Background circular element `bg-[#F2A516]/30 rounded-full blur-xl opacity-70` placed at top edge.
- **Circle Image Avatar:** `w-32 h-32 rounded-full border-2 border-[#0D0D0D] bg-[#FFF2C6] overflow-hidden`.
- **Shadow Hole:** Oval shadow beneath the card (`w-40 h-4 bg-black/20 blur-xl rounded-full scale-90 group-hover:scale-100 transition-all`).

### B. Action Buttons (`.social-btn` / Link Buttons)
- **Shape:** Fully rounded pill (`rounded-full`).
- **Style:** Pitch black background (`#0D0D0D`), cream text (`#FFEFB4`), 3px offset Golden Amber shadow (`box-shadow: 3px 3px 0 #f2a516`).
- **Hover Micro-Interaction:** Translates upward `-3px` while expanding shadow to `5px 5px 0 #f2a516` with golden text hover state.

### C. Floating Pill Navigation Bar
- **Container:** Dark capsule (`bg-[#0D0D0D] border-3 border-[#F2A516] rounded-full shadow-[8px_8px_0_#0D0D0D] px-6 py-3`).
- **Pill Items:**
  - *Active Item:* `text-[#0D0D0D] bg-[#F2A516] shadow-[3px_3px_0_#FFEFB4] rounded-full` with an animated pulsing indicator (`bg-[#0D0D0D] animate-pulse`).
  - *Inactive Item:* `text-[#FFEFB4] hover:text-[#F2A516]`.

### D. Header Progress Bar
- **Bar Track:** Dark transparent rounded capsule (`bg-[#0D0D0D]/20 rounded-full h-2`).
- **Progress Fill:** Golden Amber dynamic width bar (`bg-[#F2A516]`).

---

## 5. Layout & Grid Principles

1. **Section Wrapper:** `min-h-screen relative bg-[#FFEFB4] overflow-hidden flex flex-col justify-between pt-24 pb-8`.
2. **Paper Fiber Texture Overlay:**
   ```css
   section::before {
     content: "";
     position: absolute;
     inset: 0;
     background-image: url("https://www.transparenttextures.com/patterns/paper-fibers.png");
     opacity: 0.12;
     pointer-events: none;
   }
   ```
3. **Card Grid Spacing:** Centered flex wrap / grid (`flex flex-wrap justify-center items-center gap-8 max-w-7xl mx-auto px-4`).

---

## 6. How to Apply in New Features

When creating new pages or components for CodeKrafters:
1. Import `motion` from `framer-motion` for initial entrance (`y: 40` to `y: 0`, duration `0.6s`).
2. Wrap card containers in `.ck-card` with `border-[#0D0D0D]` and hard shadow `shadow-[6px_6px_0_#0D0D0D]`.
3. Use `#FFEFB4` for page backgrounds, `#F2A516` for highlights/accents, and `#0D0D0D` for borders and dark capsules.
4. Ensure all external links include security attributes `target="_blank"` and `rel="noopener noreferrer"`.
