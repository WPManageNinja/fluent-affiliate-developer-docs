# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VitePress-based static documentation site for the FluentAffiliate WordPress plugin. Covers the REST API, database models, WordPress hooks, and developer guides.

## Commands

```bash
npm install                 # Install dependencies
npm run generate:docs       # Regenerate auto-generated docs from plugin PHP source
npm run docs:dev            # Generate docs then start dev server with hot reload
npm run docs:build          # Generate docs then build for production
npm run docs:preview        # Preview the production build locally
```

## Auto-generation vs. Static Files

**Critical distinction:** Most docs are auto-generated. `scripts/generate-docs.mjs` scans the FluentAffiliate plugin PHP source (at `../`, one level up from this repo) and regenerates these files on every dev/build run:

- `docs/database/schema.md`
- `docs/database/models/*.md`
- `docs/hooks/actions/*.md`
- `docs/hooks/filters/*.md`
- `docs/restapi/*.md`

**Do not hand-edit these files** — changes will be overwritten the next time the generator runs.

**These files are static and safe to edit:**

- `docs/index.md` — Home page
- `docs/getting-started.md` — Architecture overview and authentication guide
- `docs/guides/**` — All guide pages (custom integration, portal customization, etc.)
- `docs/database/query-builder.md` — Query builder reference

When a Pro extension is present at `../../fluent-affiliate-pro/`, the generator also includes Pro models, hooks, and endpoints.

## Adding or Changing Content

**To update auto-generated content:** Edit the generator logic in `scripts/generate-docs.mjs`, not the output `.md` files.

**To add a new guide page:**
1. Create the `.md` file under `docs/guides/`
2. Register it in `.vitepress/config.mts` — add to `guidePages`, `proFeaturePages`, or `integrationPages` arrays and the sidebar config

**To add a new nav/sidebar entry** for any section, edit the relevant sidebar array in `.vitepress/config.mts`.

## Architecture

- **VitePress config:** `.vitepress/config.mts` — nav, sidebars, Mermaid fence renderer, and head scripts (includes the Fluent Bot chat widget injection)
- **Custom theme:** `.vitepress/theme/index.ts` extends VitePress default; registers `DocsHome` and `Mermaid` Vue components globally
- **DocsHome.vue** — Home page stats display component used in `docs/index.md` via `<DocsHome />`
- **Mermaid.vue** — Wraps Mermaid diagrams with click-to-zoom + ESC-to-close; activated by using ` ```mermaid ` fences in markdown (the config rewrites them to `<Mermaid content="..." />`)
- **generate-docs.mjs** — Single-file generator (~111 KB). Scans PHP migrations for schema, `do_action`/`apply_filters` calls for hooks, and route definitions for REST API docs. Has a built-in `COLUMN_DESC` lookup table for human-readable column descriptions.

## Sidebar Registration

When adding pages to any section, update **both** the relevant array (`databaseSidebar`, `actionHookPages`, `guidePages`, etc.) and any sidebar config object in `.vitepress/config.mts`. The nav dropdowns for Guides also reference `guidePages`, `proFeaturePages`, and `integrationPages` directly.
