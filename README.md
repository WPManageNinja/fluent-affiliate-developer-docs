# FluentAffiliate Developer Docs

Developer documentation for [FluentAffiliate](https://fluentaffiliate.com/) — the self-hosted affiliate program plugin by WPManageNinja.

**Live site:** [dev.fluentaffiliate.com](https://dev.fluentaffiliate.com/)

## What's inside 

- **Database** — Schema overview, Eloquent-style models, relationships, and query builder usage
- **Hooks** — Action and filter hook references with signatures, parameters, and examples (110+ hooks)
- **REST API** — Full endpoint reference for affiliates, referrals, payouts, visits, portal, and Pro resources (94 routes)
- **Pro Features** — Affiliate Groups, Creatives, Social Media Share, Permission Manager, Connected Sites, Recurring Commissions
- **Integrations** — WooCommerce, Easy Digital Downloads, SureCart, FluentCart, Fluent Forms, LifterLMS, GiveWP, MemberPress, and more
- **Guides** — Custom integration pattern, code snippets, and practical developer recipes

## Local development

```bash
npm install
npm run docs:dev      # Start dev server with hot reload
npm run docs:build    # Production build
npm run docs:preview  # Preview production build locally
```

`docs:dev` and `docs:build` auto-generate database, hook, and REST API references from the FluentAffiliate plugin source before starting VitePress.

## Tech stack

- [VitePress](https://vitepress.dev/) — Static site generator
- [Vue 3](https://vuejs.org/) — Component framework
- [Mermaid](https://mermaid.js.org/) — Diagram rendering (ER diagrams, flowcharts)

## Contributing

Found an issue or want to improve the docs? PRs are welcome. Each page has an "Edit this page" link that takes you directly to the source file.

## License

Copyright © 2026 WPManageNinja
