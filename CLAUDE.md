CLAUDE — Frontend notes

Purpose
- Quick reference for using Claude when working on the frontend (Next.js) portion of this repo.

Repository location
- Path: siliconbay-frontend

Quick environment
- Node.js 16+ (use the version the project targets)
- npm or pnpm

Common commands
- Install: `npm install`
- Development: `npm run dev` (starts Next.js on port 3000 by default)
- Build: `npm run build`
- Start (production): `npm run start` or use a platform-specific adapter

Key files & folders
- App: `app/` (Next.js App Router)
- Components: `components/`
- API routes: `app/api/` and `app/api/backend/`

Notes for Claude prompts
- When asking Claude about frontend code include the module path (siliconbay-frontend) and specific file paths.
- Include reproduction steps and browser console output when relevant.
- Mention Node.js version and package manager when troubleshooting dev tooling.

Security
- Do not paste secrets or `.env.local` contents when interacting with Claude.

Maintainers
- See project README or contact repository owners for more details.
