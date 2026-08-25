# CodeKrafters Website 🚀

The official website for **CodeKrafters SRM RMP** — a premier student-led tech community and developer club at the SRM Institute of Science and Technology (Ramapuram). It serves as the digital hub for our 7 technical and non-technical domains, driving innovation, creativity, and student leadership.

🌐 **Live Website:** [codekrafters.tech](https://codekrafters.tech)

## ✨ Features
- **Dynamic Application Portal (`/join`):** Integrated with Supabase, allowing students to apply, check their application status, and administrators to review applications via a secure dashboard.
- **Events & Projects Showcase:** Dedicated hubs to highlight upcoming hackathons, workshops, and student-built open-source projects.
- **Smooth Animations:** High-performance scroll and layout animations powered by GSAP and Framer Motion.
- **Fully SEO Optimized:** Comprehensive technical and on-page SEO including dynamic `sitemap.xml`, `robots.txt`, canonical tags, and JSON-LD schema markup tailored for AI search readiness and Google indexing.

## 🛠️ Tech Stack
- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend & Database:** [Supabase](https://supabase.com/)
- **Animations:** [GSAP](https://gsap.com/), [Framer Motion](https://www.framer.com/motion/), & [Lenis](https://lenis.studiofreight.com/) (Smooth Scrolling)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Validation:** [Zod](https://zod.dev/)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v20+) and `npm` installed.

### 1. Clone the repository
```bash
git clone https://github.com/CODEKRAFTERS-SRMIST/codekrafters-website.git
cd codekrafters-website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root of the project and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure
- `src/app/` — Next.js App Router pages, layouts, and API routes.
- `src/components/` — Reusable React UI components (Hero, Navbar, Events, Application Forms, etc.).
- `src/lib/` — Utility functions, API helpers, and Supabase client configuration.
- `src/types/` — TypeScript interfaces and type definitions (e.g., Application data).
- `public/` — Static assets like images, fonts, and icons.

## 🌍 Deployment
This project is optimized for deployment on **Vercel**. 

*Note on SEO:* The site is deployed to Vercel but hosted on the custom domain `codekrafters.tech`. We use canonical tags and `metadataBase` in Next.js to prevent duplicate content penalties from the `.vercel.app` subdomain. Ensure any traffic hitting the Vercel domain is 308-redirected to the primary `.tech` domain via the Vercel dashboard.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues).

---
*Built with ❤️ by the CodeKrafters Core Team.*
