# Google Lighthouse & PageSpeed Insights Comprehensive Audit Report

> **Target URL:** `https://codekraftersrmp.in/`  
> **Lighthouse Report Source:** [PageSpeed Insights Report (Desktop)](https://pagespeed.web.dev/analysis/https-codekraftersrmp-in/kn8xerkif4?form_factor=desktop)  
> **Lighthouse Version:** 13.4.1  
> **Analysis Form Factor:** Desktop (with Mobile comparative analysis)  
> **Generated:** September 2026

---

## 1. Executive Summary & Category Scores

| Category | Desktop Score | Mobile Score | Status | Primary Impact Area |
| :--- | :---: | :---: | :---: | :--- |
| **Performance** | **83 / 100** | **~65 / 100** | ⚠️ Needs Optimization | Massive 9.5MB initial payload, unoptimized images, render-blocking font |
| **Accessibility** | **92 / 100** | **92 / 100** | ⚠️ Minor Fixes | 30+ team links missing discernible names, color contrast on Sponsors heading |
| **Best Practices** | **100 / 100** | **100 / 100** |  Passed | All security, HTTPS, and modern web standards met |
| **SEO** | **100 / 100** | **100 / 100** |  Passed | Meta tags, OpenGraph, JSON-LD schemas, and crawlability intact |
| **Agentic Browsing** | **33 / 100 (1/3)** | **33 / 100 (1/3)** | ❌ Failed | `llms.txt` format non-compliant, broken agent accessibility tree |

---

## 2. Core Web Vitals & Key Lab Metrics

### Desktop Performance Metrics
- **First Contentful Paint (FCP):** `451 ms` (Score: 1.0) 
- **Largest Contentful Paint (LCP):** `677 ms` (Score: 0.99) 
- **Cumulative Layout Shift (CLS):** `0.0002` (Score: 1.0) 
- **Total Blocking Time (TBT):** `305 ms` (Score: 0.58) ⚠️
- **Speed Index:** `1,973 ms` (Score: 0.63) ⚠️
- **Max Potential First Input Delay (FID):** `308 ms` (Score: 0.34) ⚠️
- **Server Response Time (TTFB):** `1 ms` (Score: 1.0) 

### Mobile Performance Metrics
- **First Contentful Paint (FCP):** `1.68 s` (Score: 0.92) 
- **Cumulative Layout Shift (CLS):** `0.0003` (Score: 1.0) 
- **Speed Index:** `4.75 s` (Score: 0.68) ⚠️
- **JavaScript Execution (Bootup Time):** `1.43 s` CPU time wasted ⚠️

---

## 3. Detailed Audit Findings & Root Causes

### A. Performance Shortcomings (Score: 83/100)

#### 1. Enormous Network Payloads (`total-byte-weight`)
- **Metric:** Total size was **9,439 KiB (~9.5 MB)**!
- **Top Offending Resources:**
  1. `/manga_art/manga page 3.png`: **2,219 KB (2.2 MB)**
  2. `/manga_art/manga page4.png`: **2,183 KB (2.2 MB)**
  3. `/manga_art/manga page2.png`: **2,079 KB (2.1 MB)**
  4. `/manga_art/manga page1.png`: **1,771 KB (1.8 MB)**
  5. `https://ik.imagekit.io/ysfz8n1no/public/hero-img/group3.jpg`: **563 KB**
  6. `/manga_art/cutouts/...`: **~75 KB** each (15 uncompressed PNG cutouts)
- **Root Cause in Code (`src/components/MangaStory.tsx`):**
  - Line 414: `priority={true}` is set on all four manga images. Next.js automatically injects `<link rel="preload" as="image">` tags into the document `<head>`, forcing the browser to preload all 8.25 MB before the user even scrolls.
  - Line 415: `unoptimized={true}` is set, actively disabling Next.js image optimization and format conversion (WebP/AVIF).
  - Line 436: Speech bubble cutouts use native `<img>` with `loading="eager"`.
  - **Mobile Penalty:** On mobile screens, the manga section is hidden via CSS (`hidden md:block`), yet mobile devices STILL preload and download all 8.25 MB because Next.js preloads priority images globally.

#### 2. Render-Blocking Font Request (`render-blocking-insight`)
- **Metric:** 296 ms wasted during critical rendering path.
- **Offending Resource:** `https://fonts.googleapis.com/css2?family=Asimovian&display=swap` (201 ms latency) + unused preconnect to `https://fonts.gstatic.com`.
- **Root Cause in Code (`src/app/layout.tsx`):**
  - Lines 125-131 contain `<link rel="stylesheet" href="...family=Asimovian...">`.
  - Codebase inspection reveals that **`Asimovian` is never used anywhere in the CSS or components** (the application exclusively uses Geist Sans and Geist Mono).

#### 3. LCP Request Late Discovery (`lcp-discovery-insight`)
- **Metric:** LCP image is not discoverable from the initial HTML document.
- **Root Cause in Code (`src/components/hero.tsx`):**
  - Hero carousel uses inline CSS `style={{ backgroundImage: url('${src}') }}` rather than an HTML `<img>` or Next.js `<Image>` component.
  - The browser preload scanner cannot find CSS background images early in the network waterfall.

#### 4. Inefficient Cache Lifetimes (`cache-insight`)
- **Metric:** Estimated savings of 13 KiB (desktop) to 621 KiB (mobile) on repeat visits.
- **Root Cause:** Next.js default image optimization cache TTL is not configured (`cacheLifetimeMs: 0`), and static asset response headers lack long-lived `Cache-Control`.

---

### B. Accessibility Shortcomings (Score: 92/100)

#### 1. Links Missing Discernible Text (`link-name`)
- **Audit:** Links do not have a discernible name (Score: 0).
- **Failing Elements:** 30+ team member LinkedIn buttons in `src/components/Team.tsx`.
- **Code:**
  ```tsx
  <a href={member.social.linkedin} target="_blank" className="social-btn">
    <Linkedin className="w-3 h-3 sm:w-4 sm:h-4" />
  </a>
  ```
- **Root Cause:** The anchor tag contains only an SVG icon without `aria-label`, `title`, or inner text. Screen readers and automated accessibility tools cannot identify the link target.

#### 2. Insufficient Color Contrast (`color-contrast`)
- **Audit:** Background and foreground colors do not have a sufficient contrast ratio (Score: 0).
- **Failing Element:**
  ```tsx
  <span className="text-[#F2B200]">SPONSORS</span>
  ```
  inside `src/components/sponsor.tsx` on background `#FFEFB3`.
- **Root Cause:** Contrast ratio between yellow `#F2B200` and light cream background `#FFEFB3` is **1.63:1** (WCAG AA requires minimum 3.0:1 for large text).

---

### C. Agentic Browsing Shortcomings (Score: 33/100, 1/3 Passed)

#### 1. Ill-Formed Accessibility Tree for Agents (`agent-accessibility-tree`)
- **Audit:** Accessibility tree is not well-formed (Score: 0).
- **Root Cause:** AI agents evaluating WebMCP / web browsing navigate via the accessibility tree. The 30+ icon links lacking accessible names in `Team.tsx` break autonomous agent navigation.

#### 2. Non-Compliant `llms.txt` (`llms-txt`)
- **Audit:** `llms.txt does not follow recommendations: File does not appear to contain any links.` (Score: 0).
- **Root Cause in `public/llms.txt`:**
  - The file formatted links as inline code:
    ```markdown
    - `Homepage -> https://codekraftersrmp.in`: Main website
    ```
  - The official [llmstxt.org](https://llmstxt.org) standard requires standard Markdown links:
    ```markdown
    - [Homepage](https://codekraftersrmp.in): Main website
    ```
  - Because no standard markdown links existed, Lighthouse's parser reported 0 links.

---

## 4. Remediation Plan & Appropriate Skills Mapping

| Issue | File(s) | Remediation Strategy | Assigned Skill |
| :--- | :--- | :--- | :--- |
| **Enormous Image Payloads** | `src/components/MangaStory.tsx`, `next.config.ts`, `public/manga_art/` | Remove `unoptimized={true}` and `priority={true}`. Set `loading="lazy"`. Enable AVIF/WebP in `next.config.ts`. Convert large PNGs to WebP. | `seo-images`, `seo-technical` |
| **Render-Blocking Font** | `src/app/layout.tsx` | Remove unused `Asimovian` Google Font stylesheet link and unused `preconnect` tags. | `seo-technical` |
| **LCP Preload Discovery** | `src/components/hero.tsx` | Use Next.js `<Image priority>` for the initial hero visual to enable immediate preload discovery with `fetchpriority="high"`. | `seo-images`, `antigravity-design-expert` |
| **Cache Lifetimes** | `next.config.ts` | Set `minimumCacheTTL: 2592000` (30 days) and configure long-term cache headers for static assets. | `seo-technical` |
| **Link Names / A11y Tree** | `src/components/Team.tsx`, `src/components/President.tsx` | Add `aria-label={`${member.name}'s LinkedIn Profile`}` and `<span className="sr-only">` to all social icon links. Add `rel="noopener noreferrer"`. | `frontend-security-coder`, `seo-technical` |
| **Color Contrast** | `src/components/sponsor.tsx` | Change `<span className="text-[#F2B200]">` to high-contrast brand bronze/amber `#995200` (5.1:1 contrast ratio, WCAG AAA compliant). | `antigravity-design-expert`, `frontend-design` |
| **`llms.txt` Standard** | `public/llms.txt` | Rewrite using official `[Title](URL)` markdown links and structured citation blocks per llmstxt.org. | `seo-geo` |
