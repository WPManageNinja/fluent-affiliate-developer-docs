/// <reference types="node" />

import { defineConfig } from 'vitepress'

const databaseSidebar = [
  {
    text: 'Overview',
    items: [
      { text: 'Schema', link: '/database/schema' },
      { text: 'Models Overview', link: '/database/models/' },
      { text: 'Query Builder', link: '/database/query-builder' },
    ],
  },
  {
    text: 'Core Models',
    items: [
      { text: 'Affiliate', link: '/database/models/affiliate' },
      { text: 'Referral', link: '/database/models/referral' },
      { text: 'Payout', link: '/database/models/payout' },
      { text: 'Visit', link: '/database/models/visit' },
      { text: 'Customer', link: '/database/models/customer' },
      { text: 'Transaction', link: '/database/models/transaction' },
      { text: 'Meta', link: '/database/models/meta' },
    ],
  },
  {
    text: 'WordPress Models',
    items: [
      { text: 'User', link: '/database/models/user' },
    ],
  },
  {
    text: 'Pro Models',
    items: [
      { text: 'AffiliateGroup (Pro)', link: '/database/models/affiliate-group' },
      { text: 'Creative (Pro)', link: '/database/models/creative' },
    ],
  },
]

const actionHookPages = [
  { text: 'Affiliates', link: '/hooks/actions/affiliates' },
  { text: 'Groups (Pro)', link: '/hooks/actions/groups' },
  { text: 'Referrals', link: '/hooks/actions/referrals' },
  { text: 'Payouts', link: '/hooks/actions/payouts' },
  { text: 'Portal', link: '/hooks/actions/portal' },
  { text: 'Integrations', link: '/hooks/actions/integrations' },
  { text: 'Creatives (Pro)', link: '/hooks/actions/creatives' },
]

const filterHookPages = [
  { text: 'Affiliates', link: '/hooks/filters/affiliates' },
  { text: 'Groups (Pro)', link: '/hooks/filters/groups' },
  { text: 'Referrals', link: '/hooks/filters/referrals' },
  { text: 'Permissions (Pro)', link: '/hooks/filters/permissions' },
  { text: 'Portal', link: '/hooks/filters/portal' },
  { text: 'Settings', link: '/hooks/filters/settings' },
  { text: 'Auth', link: '/hooks/filters/auth' },
  { text: 'Integrations', link: '/hooks/filters/integrations' },
  { text: 'Creatives (Pro)', link: '/hooks/filters/creatives' },
]

function buildHooksSidebar() {
  return [
    {
      text: 'Actions',
      collapsed: true,
      items: [{ text: 'Overview', link: '/hooks/actions/' }, ...actionHookPages],
    },
    {
      text: 'Filters',
      collapsed: true,
      items: [{ text: 'Overview', link: '/hooks/filters/' }, ...filterHookPages],
    },
  ]
}

function buildRestApiSidebar() {
  return [
    {
      text: 'Getting Started',
      items: [{ text: 'API Overview', link: '/restapi/' }],
    },
    {
      text: 'Core Resources',
      items: [
        { text: 'Affiliates', link: '/restapi/affiliates' },
        { text: 'Referrals', link: '/restapi/referrals' },
        { text: 'Payouts', link: '/restapi/payouts' },
        { text: 'Visits', link: '/restapi/visits' },
        { text: 'Portal', link: '/restapi/portal' },
      ],
    },
    {
      text: 'Administration',
      items: [
        { text: 'Reports', link: '/restapi/reports' },
        { text: 'Settings', link: '/restapi/settings' },
      ],
    },
    {
      text: 'Pro',
      items: [
        { text: 'Affiliate Groups (Pro)', link: '/restapi/groups' },
        { text: 'Creatives (Pro)', link: '/restapi/creatives' },
        { text: 'Connected Sites (Pro)', link: '/restapi/connected-sites' },
        { text: 'License (Pro)', link: '/restapi/license' },
      ],
    },
  ]
}

const guidePages = [
  { text: 'Guides Overview', link: '/guides/' },
  { text: 'Custom Integration', link: '/guides/custom-integration' },
  { text: 'Code Snippets', link: '/guides/code-snippets' },
]

const proFeaturePages = [
  { text: 'Affiliate Groups', link: '/guides/affiliate-groups' },
  { text: 'Creatives', link: '/guides/creatives' },
  { text: 'Social Media Share', link: '/guides/social-share' },
  { text: 'Permission Manager', link: '/guides/permission-manager' },
  { text: 'Connected Sites', link: '/guides/connected-sites' },
  { text: 'Recurring Commissions', link: '/guides/recurring-commissions' },
]

const integrationPages = [
  { text: 'WooCommerce', link: '/guides/integrations/woocommerce' },
  { text: 'Easy Digital Downloads', link: '/guides/integrations/edd' },
  { text: 'SureCart', link: '/guides/integrations/surecart' },
  { text: 'FluentCart', link: '/guides/integrations/fluentcart' },
  { text: 'FluentForms', link: '/guides/integrations/fluentforms' },
  { text: 'Other Integrations', link: '/guides/integrations/others' },
]

export default defineConfig({
  srcDir: 'docs',
  title: 'FluentAffiliate Developer Docs',
  description: 'Developer documentation for FluentAffiliate — hooks, REST API, database models, and integration guides.',
  ignoreDeadLinks: true,
  cleanUrls: true,
  head: [
    ['meta', { name: 'theme-color', content: '#2271b1' }],
    ['meta', { property: 'og:title', content: 'FluentAffiliate Developer Docs' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Database, hooks, and REST API references for FluentAffiliate.',
      },
    ],
    [
      'script',
      {
        type: 'module',
        src: 'https://cdn.jsdelivr.net/gh/fluent-docai/chat-widget@latest/chat-widget.js',
      },
    ],
    [
      'script',
      { type: 'module' },
      'FluentBotChatWidget.injectWidget("019c031f-69e0-7336-a3c4-702e78ca84be");',
    ],
  ],
  markdown: {
    config(md) {
      const originalFence = md.renderer.rules.fence

      if (!originalFence) {
        return
      }

      md.renderer.rules.fence = (tokens, index, options, env, renderer) => {
        const token = tokens[index]
        const info = token.info ? md.utils.unescapeAll(token.info).trim() : ''
        const language = info ? info.split(/\s+/g)[0] : ''

        if (language === 'mermaid') {
          return `<Mermaid content="${md.utils.escapeHtml(token.content)}" />`
        }

        return originalFence(tokens, index, options, env, renderer)
      }
    },
  },
  themeConfig: {
    siteTitle: 'FluentAffiliate',
    nav: [
      { text: 'Getting Started', link: '/getting-started' },
      {
        text: 'Database',
        items: [
          { text: 'Schema', link: '/database/schema' },
          { text: 'Models', link: '/database/models/' },
          { text: 'Query Builder', link: '/database/query-builder' },
        ],
      },
      {
        text: 'Hooks',
        items: [
          { text: 'Action Hooks', link: '/hooks/actions/' },
          { text: 'Filter Hooks', link: '/hooks/filters/' },
        ],
      },
      { text: 'REST API', link: '/restapi/' },
      {
        text: 'Guides',
        items: [
          {
            text: 'Getting Started',
            items: guidePages.filter((page) => !page.text.includes('Overview')),
          },
          {
            text: 'Pro Features',
            items: proFeaturePages,
          },
          {
            text: 'Integrations',
            items: integrationPages,
          },
        ],
      },
    ],
    sidebar: {
      '/database/': [
        {
          text: 'Database',
          items: databaseSidebar,
        },
      ],
      '/hooks/': buildHooksSidebar(),
      '/restapi/': buildRestApiSidebar(),
      '/guides/': [
        {
          text: 'Getting Started',
          items: guidePages,
        },
        {
          text: 'Pro Features',
          collapsed: false,
          items: proFeaturePages,
        },
        {
          text: 'Integrations',
          collapsed: false,
          items: integrationPages,
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/WPManageNinja/fluent-affiliate' },
    ],
    search: {
      provider: 'local',
    },
    outline: {
      level: [2, 3],
      label: 'On this page',
    },
    editLink: {
      pattern:
        'https://github.com/WPManageNinja/fluent-affiliate-developer-docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'FluentAffiliate developer documentation',
      copyright: 'Copyright © WPManageNinja',
    },
  },
})
