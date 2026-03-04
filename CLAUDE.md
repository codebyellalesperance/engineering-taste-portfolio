# Engineering Taste Portfolio -- Claude Code Project Instructions

## Project Overview

Personal portfolio site at ctrlcreatelabs.com. Features a Raycast-style command palette for project browsing, interactive terminal, GSAP and Framer Motion animations, dark/light mode, and Substack RSS integration. Built with React 19 and deployed on Vercel.

## Conventions

This project follows `~/.claude/docs/conventions.md` (v1).
Project-specific extensions below.

### Scopes

`ui`, `content`, `seo`, `deploy`, `animation`

### Code Style Extensions

- TypeScript with type annotations on all function signatures
- Functional components with hooks
- Import alias: `@/*` resolves to project root

## Stack

- React 19
- TypeScript 5.8
- Vite 6
- Tailwind CSS (via CDN in index.html)
- Framer Motion (page transitions, interactions)
- GSAP (timeline animations, parallax)
- Lucide React (icons)

## Project Structure

```
engineering-taste-portfolio/
  CLAUDE.md                    -- this file
  index.html                   -- entry point with Tailwind CDN, Google Fonts, SEO
  index.tsx                    -- React DOM render
  App.tsx                      -- root component (theme state, menu, Konami handler)
  types.ts                     -- TypeScript interfaces
  metadata.json                -- project metadata
  components/
    Header.tsx                 -- nav, theme toggle, live time display
    Hero.tsx                   -- hero section with GSAP parallax animations
    Terminal.tsx               -- interactive terminal with command system
    CommandPalette.tsx         -- Raycast-style project browser with RSS feed
    BentoGrid.tsx              -- wrapper for CommandPalette
    Footer.tsx                 -- contact CTA with split-text animation
    MenuOverlay.tsx            -- full-screen menu overlay
    MagneticButton.tsx         -- mouse-following magnetic button
    os/
      Desktop.tsx              -- desktop OS emulation interface
      Window.tsx               -- window component
      RichIcons.tsx            -- SVG icon system
  hooks/
    useKonamiCode.ts           -- Konami Code easter egg detector
  public/                      -- static assets (images, favicon, SEO files)
```

## Git and GitHub

### Repository

- Remote: `origin https://github.com/codebyellalesperance/engineering-taste-portfolio.git`
- Push to main triggers Vercel auto-deploy.

## Key Commands

```bash
npm run dev          # start dev server on port 3000
npm run build        # production build
npm run preview      # preview production build
```

## Environment

- `GEMINI_API_KEY` -- defined in vite.config.ts (optional, for future AI features)
- No other environment variables required for standard development.

## Deployment

Push to `main` triggers automatic Vercel deployment. No manual deploy steps needed.

## Data

- CommandPalette fetches Substack RSS feed at runtime with a static JSON fallback
- Projects are defined inline in CommandPalette.tsx
- Update static fallback data when adding new Substack posts

## Development Workflow

1. Run dev server: `npm run dev`
2. Make changes -- hot reload handles updates
3. Verify in browser (check both light and dark mode)
4. Build to verify no errors: `npm run build`
5. Commit with conventional commit format
6. Push to main -- Vercel auto-deploys

## Notes

- Site updates with each Engineering Taste drop (Palette Thief, Storefront Critic, etc.)
- Fonts loaded via Google Fonts CDN: Inter, Playfair Display, Bodoni Moda, Caveat
- Tailwind loaded via CDN (not build-time) -- configured in index.html script tag
