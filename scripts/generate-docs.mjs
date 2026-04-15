/**
 * generate-docs.mjs
 *
 * Scans the FluentAffiliate PHP source and regenerates:
 *   docs/database/schema.md
 *   docs/database/models/*.md
 *   docs/hooks/actions/*.md
 *   docs/hooks/filters/*.md
 *   docs/restapi/*.md
 *
 * Static files (docs/guides/, docs/index.md, docs/getting-started.md) are left untouched.
 *
 * Run via: node scripts/generate-docs.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync, rmSync } from 'fs'
import { resolve, join, dirname, relative, basename } from 'path'
import { fileURLToPath } from 'url'

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

const repoRoot = resolve(__dirname, '..')               // fluent-affiliate-developer-docs/
const coreRoot = resolve(repoRoot, '..')                // fluent-affiliate/ (plugin root)
const proRoot  = resolve(coreRoot, '..', 'fluent-affiliate-pro')
const hasPro   = existsSync(proRoot)

const DOCS_DIR = join(repoRoot, 'docs')

console.log('FluentAffiliate Docs Generator')
console.log('  Core root :', coreRoot)
console.log('  Pro root  :', proRoot, hasPro ? '(found)' : '(not found)')

// ---------------------------------------------------------------------------
// Filesystem helpers
// ---------------------------------------------------------------------------

function readFile(p) {
  try { return readFileSync(p, 'utf8') } catch { return '' }
}

function scanPhpFiles(dir) {
  const results = []
  if (!existsSync(dir)) return results
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    try {
      const stat = statSync(full)
      if (stat.isDirectory()) results.push(...scanPhpFiles(full))
      else if (full.endsWith('.php')) results.push(full)
    } catch { /* skip */ }
  }
  return results
}

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true })
}

function writeDoc(filePath, content) {
  ensureDir(dirname(filePath))
  writeFileSync(filePath, content, 'utf8')
  console.log('  wrote', relative(repoRoot, filePath))
}

function cleanDir(p) {
  if (existsSync(p)) rmSync(p, { recursive: true, force: true })
  mkdirSync(p, { recursive: true })
}

// ---------------------------------------------------------------------------
// Column description lookup (from actual migration columns)
// ---------------------------------------------------------------------------

const COLUMN_DESC = {
  // Shared
  id:            'Primary key, auto-increment.',
  status:        'Record status.',
  settings:      'Serialized JSON settings blob.',
  created_at:    'Timestamp when the record was created.',
  updated_at:    'Timestamp when the record was last updated.',
  currency:      'ISO 4217 currency code (e.g. `USD`).',
  description:   'Free-text description.',

  // fa_affiliates
  contact_id:    'Optional FluentCRM contact ID linked to this affiliate.',
  user_id:       'WordPress user ID of the affiliate.',
  group_id:      'Affiliate group ID (Pro feature).',
  rate:          'Commission rate. Interpretation depends on `rate_type`.',
  total_earnings:'Cumulative lifetime earnings (denormalised).',
  unpaid_earnings:'Earnings not yet included in a paid payout.',
  referrals:     'Total referral count (denormalised).',
  visits:        'Total visit count (denormalised).',
  lead_counts:   'Total lead count (denormalised).',
  rate_type:     'Commission type — `percentage` or `flat`.',
  custom_param:  'Custom URL parameter value used for tracking.',
  payment_email: 'Email address used for payout delivery.',
  note:          'Internal admin notes about the affiliate.',

  // fa_referrals
  affiliate_id:  'Affiliate who earned this referral.',
  parent_id:     'Parent referral ID (for multi-tier, reserved).',
  customer_id:   'Customer record associated with this purchase.',
  visit_id:      'Visit that initiated this referral (if known).',
  amount:        'Commission amount earned by the affiliate.',
  order_total:   'Total order value that generated the referral.',
  utm_campaign:  'UTM campaign parameter from the tracking URL.',
  provider:      'Integration slug that created this referral (e.g. `woo`, `fluentcart`).',
  provider_id:   'Provider-specific order/payment numeric ID.',
  provider_sub_id:'Provider-specific sub-ID (e.g. subscription ID).',
  products:      'JSON list of product IDs in the order.',
  payout_transaction_id: 'Payout transaction that included this referral.',
  payout_id:     'Parent payout record.',
  type:          'Referral type — `sale`, `recurring_sale`, or `lead`.',

  // fa_payouts
  created_by:    'WordPress user ID of the admin who created the payout.',
  total_amount:  'Sum of all transactions in this payout.',
  payout_method: 'Delivery method — `manual`, `paypal`, etc.',
  title:         'Human-readable payout title.',

  // fa_payout_transactions (inherits created_by, affiliate_id, payout_id, total_amount, payout_method from above)

  // fa_visits
  referral_id:   'Referral created from this visit (if any).',
  url:           'Full URL visited by the user.',
  referrer:      'HTTP referer of the visit.',
  utm_medium:    'UTM medium parameter.',
  utm_source:    'UTM source parameter.',
  ip:            'Hashed or raw visitor IP address.',

  // fa_customers
  by_affiliate_id: 'Affiliate who referred this customer.',
  email:         'Customer email address.',
  first_name:    'Customer first name.',
  last_name:     'Customer last name.',

  // fa_meta
  object_type:   'Type of object this meta belongs to (e.g. `affiliate`).',
  object_id:     'ID of the associated object.',
  meta_key:      'Meta key.',
  value:         'Meta value (serialized if complex).',

  // fa_creatives (Pro)
  name:          'Creative asset name.',
  type:          'Creative type — `image`, `text`, `html`, `banner`.', // overridden per-table below
  image:         'URL of the creative image asset.',
  text:          'Text content for text-type creatives.',
  url:           'Destination URL linked from the creative.',
  privacy:       'Visibility — `public` or `private`.',
  affiliate_ids: 'JSON array of affiliate IDs this creative is restricted to.',
  group_ids:     'JSON array of group IDs this creative is restricted to.',
  meta:          'Additional metadata for the creative.',
}

// Per-table column description overrides — takes precedence over COLUMN_DESC
const TABLE_COLUMN_DESC = {
  fa_referrals: {
    type: 'Referral type — `sale`, `opt_in`, or `recurring_sale`.',
  },
}

// ---------------------------------------------------------------------------
// Migration parser — extract table schemas from PHP CREATE TABLE SQL
// ---------------------------------------------------------------------------

function parseMigrationsDir(dir) {
  const tables = {}
  if (!existsSync(dir)) return tables

  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.php')) continue
    const content = readFile(join(dir, file))

    // Try static property first: static $tableName = 'fa_xxx';
    let tableNameMatch = content.match(/\$tableName\s*=\s*'([^']+)'/)
    // Fall back to inline: $wpdb->prefix . 'fa_xxx'
    if (!tableNameMatch) tableNameMatch = content.match(/\$wpdb->prefix\s*\.\s*'([^']+)'/)
    if (!tableNameMatch) continue
    const tableName = tableNameMatch[1]

    const sqlMatch = content.match(/CREATE TABLE \$table \(([\s\S]*?)\)\s*\$charsetCollate/)
    if (!sqlMatch) continue

    tables[tableName] = parseCreateTableBody(sqlMatch[1], tableName)
  }
  return tables
}

function parseCreateTableBody(body, tableName = '') {
  const columns = []
  for (const rawLine of body.split('\n')) {
    const line = rawLine.trim()
    if (!line.startsWith('`')) continue

    const m = line.match(/^`([^`]+)`\s+([A-Z]+(?:\([^)]*\))?)(.*?)(?:,\s*)?$/i)
    if (!m) continue

    const [, colName, colType, rest] = m
    const nullable    = /NOT NULL/.test(rest) ? 'NO' : 'YES'
    const defMatch    = rest.match(/DEFAULT\s+'?([^',\s)]+)'?/)
    const defaultVal  = defMatch ? defMatch[1] : null

    columns.push({
      name:    colName,
      type:    colType.toUpperCase(),
      nullable,
      default: defaultVal,
      desc:    (TABLE_COLUMN_DESC[tableName] ?? {})[colName] ?? COLUMN_DESC[colName] ?? '',
    })
  }
  return columns
}

// ---------------------------------------------------------------------------
// Hook extraction from PHP source
// ---------------------------------------------------------------------------

function extractHooks(sourceDirs) {
  const actions = {}   // hook => { files, isPro, isDynamic }
  const filters = {}

  for (const dir of sourceDirs) {
    const isPro = dir.includes('fluent-affiliate-pro')
    for (const file of scanPhpFiles(dir)) {
      const content = readFile(file)
      const rel     = relative(coreRoot, file)

      // Static action hooks (not followed by string concatenation ` . $`)
      for (const [, hook] of content.matchAll(/do_action\s*\(\s*'(fluent_affiliate\/[^']+)'(?!\s*\.)/g)) {
        if (!actions[hook]) actions[hook] = { files: [], isPro, isDynamic: false }
        if (!actions[hook].files.includes(rel)) actions[hook].files.push(rel)
      }

      // Dynamic action hooks  e.g.  'fluent_affiliate/foo_' . $var
      for (const [, base, varName] of content.matchAll(/do_action\s*\(\s*'(fluent_affiliate\/[^']+)'\s*\.\s*\$(\w+)/g)) {
        const hook = base + `{${varName}}`
        if (!actions[hook]) actions[hook] = { files: [], isPro, isDynamic: true }
        if (!actions[hook].files.includes(rel)) actions[hook].files.push(rel)
      }

      // Static filter hooks (not followed by string concatenation ` . $`)
      for (const [, hook] of content.matchAll(/apply_filters\s*\(\s*'(fluent_affiliate\/[^']+)'(?!\s*\.)/g)) {
        if (!filters[hook]) filters[hook] = { files: [], isPro, isDynamic: false }
        if (!filters[hook].files.includes(rel)) filters[hook].files.push(rel)
      }

      // Dynamic filter hooks  e.g.  'fluent_affiliate/foo_' . $var
      for (const [, base, varName] of content.matchAll(/apply_filters\s*\(\s*'(fluent_affiliate\/[^']+)'\s*\.\s*\$(\w+)/g)) {
        const hook = base + `{${varName}}`
        if (!filters[hook]) filters[hook] = { files: [], isPro, isDynamic: true }
        if (!filters[hook].files.includes(rel)) filters[hook].files.push(rel)
      }
    }
  }

  return { actions, filters }
}

// ---------------------------------------------------------------------------
// Hook metadata — descriptions, parameters, categories
// ---------------------------------------------------------------------------

// category → list of hook name prefixes/patterns
const ACTION_CATEGORIES = {
  affiliates:   h => /\/affiliate/.test(h) || h === 'fluent_affiliate/admin_app_rendering' || h === 'fluent_affiliate/wipe_current_data',
  referrals:    h => /\/referral/.test(h),
  payouts:      h => /\/payout/.test(h),
  portal:       h => /\/portal|\/render_login|\/render_signup|\/email_head/.test(h),
  integrations: h => /\/affiliate_created_via_fluent_form/.test(h),
  creatives:    h => false,  // pro
}

const FILTER_CATEGORIES = {
  affiliates:   h => /\/affiliate(?!_created_via)/.test(h) && !/permission|access|auth/.test(h),
  referrals:    h => /\/referral|\/data_export_limit|\/provider_reference|\/commission|\/ignore_zero|\/formatted_order/.test(h),
  permissions:  h => /has_all_|user_has_affiliate_access/.test(h),
  portal:       h => /\/portal|\/default_share_url|\/will_load_tracker|\/smartcode/.test(h),
  settings:     h => /\/get_email_config|\/update_email_config|\/get_referral_config|\/update_referral_config|\/get_feature|\/update_feature|\/settings_menu|\/top_menu|\/right_menu|\/admin_vars|\/dashboard_notices|\/admin_url|\/portal_page_url|\/registered_features|\/max_execution|\/is_rtl|\/suggested_colors|\/payout_form_schema|\/referral_formats|\/portal_menu_items|\/get_currencies|\/currency_symbols|\/referral_config_field_types|\/default_referral_settings/.test(h),
  auth:         h => /\/auth\/|\/terms_policy|\/reserved_usernames/.test(h),
  integrations: h => /\/get_integrations|\/get_integration_config|\/save_integration_config|\/user_ip|\/migrators|\/get_migration|\/get_current_data|\/wppayform|\/advanced_report/.test(h),
  creatives:    h => false,
}

const HOOK_DOCS = {
  // --- Actions ---
  'fluent_affiliate/affiliate_created': {
    desc: 'Fired after a new affiliate record is created.',
    params: [
      { name: '$affiliate', type: 'Affiliate', desc: 'The newly created Affiliate model instance.' },
      { name: '$user',      type: 'User',      desc: 'The WordPress User model associated with the affiliate.' },
    ],
    example: `add_action('fluent_affiliate/affiliate_created', function($affiliate, $user) {
    // Send a welcome email, sync to CRM, etc.
    my_plugin_send_affiliate_welcome($affiliate->payment_email);
}, 10, 2);`,
  },
  'fluent_affiliate/affiliate_updated': {
    desc: 'Fired after an affiliate record is updated by an admin.',
    params: [
      { name: '$affiliate', type: 'Affiliate', desc: 'The updated Affiliate model.' },
      { name: '$by',        type: 'string',    desc: 'Who triggered the update — `"by_admin"`.' },
      { name: '$data',      type: 'array',     desc: 'Array of changed data.' },
    ],
    example: `add_action('fluent_affiliate/affiliate_updated', function($affiliate, $by, $data) {
    // Log the change or notify an external system.
}, 10, 3);`,
  },
  'fluent_affiliate/affiliate_status_to_{status}': {
    desc: 'Fired when an affiliate\'s status changes. The hook name is dynamic: the suffix is the **new** status (e.g. `active`, `inactive`, `banned`).',
    params: [
      { name: '$affiliate',  type: 'Affiliate', desc: 'The Affiliate model with its new status.' },
      { name: '$prevStatus', type: 'string',    desc: 'The previous status, or an empty string on first activation.' },
    ],
    example: `// Fires for any status change
add_action('fluent_affiliate/affiliate_status_to_active', function($affiliate, $prevStatus) {
    // e.g. send a "you're approved" email
}, 10, 2);`,
  },
  'fluent_affiliate/before_delete_affiliate': {
    desc: 'Fired immediately before an affiliate record is permanently deleted.',
    params: [
      { name: '$affiliate', type: 'Affiliate', desc: 'The Affiliate model about to be deleted.' },
    ],
    example: `add_action('fluent_affiliate/before_delete_affiliate', function($affiliate) {
    // Clean up any plugin data tied to $affiliate->id
});`,
  },
  'fluent_affiliate/after_delete_affiliate': {
    desc: 'Fired after an affiliate record has been permanently deleted.',
    params: [
      { name: '$affiliateId', type: 'int', desc: 'ID of the deleted affiliate.' },
    ],
    example: `add_action('fluent_affiliate/after_delete_affiliate', function($affiliateId) {
    // Remove any external records for this affiliate ID.
});`,
  },
  'fluent_affiliate/affiliate_created_via_fluent_form': {
    desc: 'Fired when a new affiliate is created through a Fluent Forms registration feed.',
    params: [
      { name: '$affiliate', type: 'Affiliate', desc: 'The new Affiliate model.' },
      { name: '$user',      type: 'WP_User',   desc: 'The WordPress user linked to the affiliate.' },
      { name: '$feedData',  type: 'array',     desc: 'The Fluent Forms feed data that triggered the creation.' },
    ],
    example: `add_action('fluent_affiliate/affiliate_created_via_fluent_form', function($affiliate, $user, $feedData) {
    // Integration-specific post-processing
}, 10, 3);`,
  },
  'fluent_affiliate/referral_created': {
    desc: 'Fired after a new referral record is inserted into the database.',
    params: [
      { name: '$referral', type: 'Referral', desc: 'The new Referral model instance.' },
    ],
    example: `add_action('fluent_affiliate/referral_created', function($referral) {
    // React to a new referral — e.g. send a notification.
});`,
  },
  'fluent_affiliate/referral_marked_unpaid': {
    desc: 'Fired after a referral\'s status is set to `unpaid` (ready for payout).',
    params: [
      { name: '$referral', type: 'Referral', desc: 'The Referral model now in unpaid status.' },
    ],
    example: `add_action('fluent_affiliate/referral_marked_unpaid', function($referral) {
    // Update an external ledger, send a notification, etc.
});`,
  },
  'fluent_affiliate/referral_marked_rejected': {
    desc: 'Fired after a referral is marked as rejected.',
    params: [
      { name: '$referral', type: 'Referral', desc: 'The rejected Referral model.' },
    ],
    example: `add_action('fluent_affiliate/referral_marked_rejected', function($referral) {
    // Notify the affiliate or log the rejection.
});`,
  },
  'fluent_affiliate/referral_commission_updated': {
    desc: 'Fired after the commission amount on an existing referral is updated.',
    params: [
      { name: '$referral', type: 'Referral', desc: 'The updated Referral model.' },
    ],
    example: `add_action('fluent_affiliate/referral_commission_updated', function($referral) {
    // Sync the new amount to an external system.
});`,
  },
  'fluent_affiliate/referral/before_delete': {
    desc: 'Fired immediately before a referral record is deleted.',
    params: [
      { name: '$referral', type: 'Referral', desc: 'The Referral model about to be deleted.' },
    ],
    example: `add_action('fluent_affiliate/referral/before_delete', function($referral) {
    // Archive or sync before deletion.
});`,
  },
  'fluent_affiliate/referral/deleted': {
    desc: 'Fired after a referral has been permanently deleted.',
    params: [
      { name: '$id',        type: 'int',       desc: 'ID of the deleted referral.' },
      { name: '$affiliate', type: 'Affiliate', desc: 'The affiliate who owned the referral.' },
    ],
    example: `add_action('fluent_affiliate/referral/deleted', function($id, $affiliate) {
    // Post-deletion cleanup.
}, 10, 2);`,
  },
  'fluent_affiliate/payout/processed': {
    desc: 'Fired after a payout batch has been fully processed.',
    params: [
      { name: '$payout',     type: 'Payout', desc: 'The Payout model that was processed.' },
      { name: '$affiliates', type: 'array',  desc: 'Array of Affiliate models included in the payout.' },
    ],
    example: `add_action('fluent_affiliate/payout/processed', function($payout, $affiliates) {
    foreach ($affiliates as $affiliate) {
        // Send payment notifications, trigger PayPal mass pay, etc.
    }
}, 10, 2);`,
  },
  'fluent_affiliate/payout/transaction/transaction_updated_to_{status}': {
    desc: 'Fired when a payout transaction status changes. The hook suffix is the new `status` (e.g. `paid`, `failed`, `pending`).',
    params: [
      { name: '$transaction', type: 'Transaction', desc: 'The Transaction model with its updated status.' },
      { name: '$payout',      type: 'Payout',      desc: 'The parent Payout model.' },
    ],
    example: `add_action('fluent_affiliate/payout/transaction/transaction_updated_to_paid', function($transaction, $payout) {
    // Send receipt to the affiliate.
}, 10, 2);`,
  },
  'fluent_affiliate/payout/transaction/deleting': {
    desc: 'Fired just before a payout transaction is deleted.',
    params: [
      { name: '$transaction', type: 'Transaction', desc: 'The Transaction model about to be deleted.' },
      { name: '$payout',      type: 'Payout',      desc: 'The parent Payout model.' },
    ],
    example: `add_action('fluent_affiliate/payout/transaction/deleting', function($transaction, $payout) {
    // Reverse any external payment before deletion.
}, 10, 2);`,
  },
  'fluent_affiliate/payout/transaction/deleted': {
    desc: 'Fired after a payout transaction has been deleted.',
    params: [
      { name: '$transactionId', type: 'int',    desc: 'ID of the deleted transaction.' },
      { name: '$payout',        type: 'Payout', desc: 'The parent Payout model.' },
    ],
    example: `add_action('fluent_affiliate/payout/transaction/deleted', function($transactionId, $payout) {
    // Post-deletion audit logging.
}, 10, 2);`,
  },
  'fluent_affiliate/render_login_form': {
    desc: 'Fired inside the portal login form template. Use to output custom HTML before the default form.',
    params: [],
    example: `add_action('fluent_affiliate/render_login_form', function() {
    echo '<p class="notice">Please log in to view your affiliate dashboard.</p>';
});`,
  },
  'fluent_affiliate/render_signup_form': {
    desc: 'Fired inside the portal sign-up form template.',
    params: [],
    example: `add_action('fluent_affiliate/render_signup_form', function() {
    echo '<div class="custom-signup-notice">Join today!</div>';
});`,
  },
  'fluent_affiliate/admin_app_rendering': {
    desc: 'Fired just before the admin SPA is rendered. Useful for adding custom scripts or data.',
    params: [],
    example: `add_action('fluent_affiliate/admin_app_rendering', function() {
    wp_enqueue_script('my-admin-extension', MY_PLUGIN_URL . 'admin-ext.js', ['jquery'], '1.0', true);
});`,
  },
  'fluent_affiliate/wipe_current_data': {
    desc: 'Fired when an admin triggers a full data-wipe via the migration tools.',
    params: [],
    example: `add_action('fluent_affiliate/wipe_current_data', function() {
    // Remove plugin data that is not in FA tables.
    delete_option('my_plugin_affiliate_cache');
});`,
  },
  'fluent_affiliate/email_head': {
    desc: 'Fired inside the `<head>` section of the FluentAffiliate email template. Use to inject custom CSS.',
    params: [],
    example: `add_action('fluent_affiliate/email_head', function() {
    echo '<style>body { font-family: Arial, sans-serif; }</style>';
});`,
  },

  // --- Filters ---
  'fluent_affiliate/has_all_affiliate_access': {
    desc: 'Filters whether the current user has full access to all affiliates. Return `true` to grant access.',
    params: [
      { name: '$hasAccess', type: 'bool', desc: 'Whether the user currently has full affiliate access.' },
    ],
    example: `add_filter('fluent_affiliate/has_all_affiliate_access', function($hasAccess) {
    // Grant access to a custom role
    if (current_user_can('my_affiliate_manager_role')) {
        return true;
    }
    return $hasAccess;
});`,
  },
  'fluent_affiliate/has_all_referral_access': {
    desc: 'Filters whether the current user has full access to all referrals.',
    params: [
      { name: '$hasAccess', type: 'bool', desc: 'Whether the user currently has full referral access.' },
    ],
    example: `add_filter('fluent_affiliate/has_all_referral_access', '__return_true');`,
  },
  'fluent_affiliate/has_all_visit_access': {
    desc: 'Filters whether the current user has full access to all visit records.',
    params: [
      { name: '$hasAccess', type: 'bool', desc: 'Whether the user currently has full visit access.' },
    ],
    example: `add_filter('fluent_affiliate/has_all_visit_access', '__return_true');`,
  },
  'fluent_affiliate/has_all_payout_access': {
    desc: 'Filters whether the current user has full access to all payout records.',
    params: [
      { name: '$hasAccess', type: 'bool', desc: 'Whether the user currently has full payout access.' },
    ],
    example: `add_filter('fluent_affiliate/has_all_payout_access', '__return_true');`,
  },
  'fluent_affiliate/user_has_affiliate_access': {
    desc: 'Filters whether a specific user ID has affiliate-level access.',
    params: [
      { name: '$hasAccess', type: 'bool', desc: 'Current access state.' },
      { name: '$userId',    type: 'int',  desc: 'WordPress user ID being checked.' },
    ],
    example: `add_filter('fluent_affiliate/user_has_affiliate_access', function($hasAccess, $userId) {
    if (get_user_meta($userId, 'is_affiliate_partner', true)) {
        return true;
    }
    return $hasAccess;
}, 10, 2);`,
  },
  'fluent_affiliate/default_share_url': {
    desc: 'Filters the default share URL used in affiliate tracking links when no specific page is configured.',
    params: [
      { name: '$url',       type: 'string',    desc: 'The current share URL (defaults to `home_url(\'/\')`).' },
      { name: '$affiliate', type: 'Affiliate', desc: 'The Affiliate model.' },
    ],
    example: `add_filter('fluent_affiliate/default_share_url', function($url, $affiliate) {
    return home_url('/shop/');
}, 10, 2);`,
  },
  'fluent_affiliate/commission': {
    desc: 'Filters the calculated commission amount before it is saved to a referral.',
    params: [
      { name: '$commission', type: 'float', desc: 'Calculated commission amount.' },
      { name: '$context',    type: 'array', desc: 'Contextual data: `order`, `affiliate`, `rate`, `rate_type`, etc.' },
    ],
    example: `add_filter('fluent_affiliate/commission', function($commission, $context) {
    // Apply a cap of $100 per referral.
    return min($commission, 100.00);
}, 10, 2);`,
  },
  'fluent_affiliate/ignore_zero_amount_referral': {
    desc: 'Filters whether referrals with a zero commission amount should be discarded. Return `false` to record them.',
    params: [
      { name: '$ignore',  type: 'bool',  desc: '`true` to ignore, `false` to record. Defaults to `true`.' },
      { name: '$context', type: 'array', desc: 'Referral creation context data.' },
    ],
    example: `add_filter('fluent_affiliate/ignore_zero_amount_referral', '__return_false');`,
  },
  'fluent_affiliate/data_export_limit': {
    desc: 'Filters the maximum number of rows returned in CSV exports.',
    params: [
      { name: '$limit', type: 'int', desc: 'Row limit. Default `5000`.' },
    ],
    example: `add_filter('fluent_affiliate/data_export_limit', function($limit) {
    return 10000;
});`,
  },
  'fluent_affiliate/affiliate_widgets': {
    desc: 'Filters the widgets displayed on the affiliate single-view page.',
    params: [
      { name: '$widgets',   type: 'array',     desc: 'Existing widget definitions.' },
      { name: '$affiliate', type: 'Affiliate', desc: 'The affiliate being viewed.' },
    ],
    example: `add_filter('fluent_affiliate/affiliate_widgets', function($widgets, $affiliate) {
    $widgets[] = ['type' => 'custom_metric', 'title' => 'Custom KPI', 'value' => 42];
    return $widgets;
}, 10, 2);`,
  },
  'fluent_affiliate/payout/before_create': {
    desc: 'Filters the payout data array before the payout record is created.',
    params: [
      { name: '$payoutData',  type: 'array',  desc: 'Payout creation data.' },
      { name: '$dataConfig',  type: 'array',  desc: 'Payout configuration from the request.' },
      { name: '$affiliates',  type: 'array',  desc: 'Affiliates being included.' },
    ],
    example: `add_filter('fluent_affiliate/payout/before_create', function($payoutData, $dataConfig, $affiliates) {
    $payoutData['title'] = 'Custom: ' . $payoutData['title'];
    return $payoutData;
}, 10, 3);`,
  },
  'fluent_affiliate/payout/before_processing': {
    desc: 'Filters the payout before it is processed. Return a `WP_Error` to halt processing.',
    params: [
      { name: '$payout',     type: 'Payout', desc: 'The Payout model.' },
      { name: '$affiliates', type: 'array',  desc: 'Affiliates included in the payout.' },
      { name: '$dataConfig', type: 'array',  desc: 'Payout configuration.' },
    ],
    example: `add_filter('fluent_affiliate/payout/before_processing', function($payout, $affiliates, $dataConfig) {
    if (empty($dataConfig['method'])) {
        return new WP_Error('missing_method', 'Payout method is required.');
    }
    return $payout;
}, 10, 3);`,
  },
  'fluent_affiliate/portal/pending_message': {
    desc: 'Filters the HTML shown to an affiliate whose account is pending approval.',
    params: [
      { name: '$html',      type: 'string',    desc: 'The pending message HTML.' },
      { name: '$affiliate', type: 'Affiliate', desc: 'The affiliate viewing the portal.' },
    ],
    example: `add_filter('fluent_affiliate/portal/pending_message', function($html, $affiliate) {
    return '<p>Your application is under review. We will email you within 24 hours.</p>';
}, 10, 2);`,
  },
  'fluent_affiliate/portal/inactive_message': {
    desc: 'Filters the HTML shown to an affiliate whose account is inactive.',
    params: [
      { name: '$html',      type: 'string',    desc: 'The inactive message HTML.' },
      { name: '$affiliate', type: 'Affiliate', desc: 'The affiliate viewing the portal.' },
    ],
    example: `add_filter('fluent_affiliate/portal/inactive_message', function($html, $affiliate) {
    return '<p>Your account has been deactivated. Please contact support.</p>';
}, 10, 2);`,
  },
  'fluent_affiliate/portal/additional_sites': {
    desc: 'Filters the list of additional sites shown in the affiliate portal share widget (Pro connected-sites feature).',
    params: [
      { name: '$sites', type: 'array', desc: 'Array of site definitions. Each entry: `[\'name\', \'url\', \'param\']`.' },
    ],
    example: `add_filter('fluent_affiliate/portal/additional_sites', function($sites) {
    $sites[] = ['name' => 'My Store', 'url' => 'https://mystore.com/', 'param' => 'ref'];
    return $sites;
});`,
  },
  'fluent_affiliate/portal_localize_data': {
    desc: 'Filters all JavaScript data passed to the affiliate portal SPA.',
    params: [
      { name: '$portalData', type: 'array', desc: 'Associative array of JS variables.' },
    ],
    example: `add_filter('fluent_affiliate/portal_localize_data', function($portalData) {
    $portalData['custom_setting'] = get_option('my_plugin_portal_setting');
    return $portalData;
});`,
  },
  'fluent_affiliate/portal_notice_html': {
    desc: 'Filters the HTML notice shown at the top of the affiliate portal.',
    params: [
      { name: '$html', type: 'string', desc: 'Notice HTML, empty by default.' },
    ],
    example: `add_filter('fluent_affiliate/portal_notice_html', function($html) {
    return '<div class="notice notice-info">Special promotion this month!</div>';
});`,
  },
  'fluent_affiliate/will_load_tracker_js': {
    desc: 'Filters whether the affiliate tracking JavaScript is enqueued on the front end.',
    params: [
      { name: '$willLoad', type: 'bool', desc: '`true` to load (default), `false` to suppress.' },
    ],
    example: `// Disable tracker on specific pages
add_filter('fluent_affiliate/will_load_tracker_js', function($willLoad) {
    if (is_page('checkout')) {
        return false;
    }
    return $willLoad;
});`,
  },
  'fluent_affiliate/parse_smart_codes': {
    desc: 'Filters smart-code template strings before they are rendered. Used by the email notification system.',
    params: [
      { name: '$output',  type: 'string', desc: 'The rendered output string.' },
      { name: '$context', type: 'array',  desc: 'Context data: `affiliate`, `referral`, etc.' },
      { name: '$type',    type: 'string', desc: '`"text"` or `"html"`.' },
    ],
    example: `add_filter('fluent_affiliate/parse_smart_codes', function($output, $context, $type) {
    return str_replace('{{my_tag}}', get_bloginfo('name'), $output);
}, 10, 3);`,
  },
  'fluent_affiliate/smartcode_fallback': {
    desc: 'Filters the fallback output when a smart code is unrecognised.',
    params: [
      { name: '$original', type: 'string', desc: 'Original unmatched smart code string.' },
      { name: '$data',     type: 'array',  desc: 'Context data passed to the parser.' },
    ],
    example: `add_filter('fluent_affiliate/smartcode_fallback', function($original, $data) {
    return ''; // Remove unrecognised codes instead of leaving them visible.
}, 10, 2);`,
  },
  'fluent_affiliate/smartcode_group_callback_{dataKey}': {
    desc: 'Fires for an unrecognised smart code group, allowing third-party data keys. The hook suffix is the group key from the template.',
    params: [
      { name: '$original',     type: 'string', desc: 'Original matched string.' },
      { name: '$valueKey',     type: 'string', desc: 'The specific sub-key requested.' },
      { name: '$defaultValue', type: 'mixed',  desc: 'Default value if unresolved.' },
      { name: '$data',         type: 'array',  desc: 'Context data.' },
    ],
    example: `add_filter('fluent_affiliate/smartcode_group_callback_order', function($original, $valueKey, $default, $data) {
    if ($valueKey === 'number') {
        return $data['order']['number'] ?? $default;
    }
    return $original;
}, 10, 4);`,
  },
  'fluent_affiliate/get_integrations': {
    desc: 'Filters the array of registered integration definitions shown in Settings → Integrations.',
    params: [
      { name: '$integrations', type: 'array', desc: 'Existing integration definitions keyed by slug.' },
    ],
    example: `add_filter('fluent_affiliate/get_integrations', function($integrations) {
    $integrations['my_plugin'] = [
        'title' => 'My Plugin',
        'slug'  => 'my_plugin',
        'logo'  => MY_PLUGIN_URL . 'logo.svg',
    ];
    return $integrations;
});`,
  },
  'fluent_affiliate/get_integration_config_{integration}': {
    desc: 'Filters the configuration data for a specific integration. The hook suffix is the integration slug.',
    params: [
      { name: '$config', type: 'array', desc: 'Saved configuration for the integration.' },
    ],
    example: `add_filter('fluent_affiliate/get_integration_config_my_plugin', function($config) {
    $config['api_key'] = get_option('my_plugin_api_key', '');
    return $config;
});`,
  },
  'fluent_affiliate/save_integration_config_{integration}': {
    desc: 'Filters the result of saving an integration\'s configuration. Return a non-empty string to show as an error.',
    params: [
      { name: '$message', type: 'string', desc: 'Error message (empty string = success).' },
      { name: '$config',  type: 'array',  desc: 'The configuration data being saved.' },
    ],
    example: `add_filter('fluent_affiliate/save_integration_config_my_plugin', function($message, $config) {
    update_option('my_plugin_api_key', sanitize_text_field($config['api_key'] ?? ''));
    return ''; // return empty string = success
}, 10, 2);`,
  },
  'fluent_affiliate/user_ip': {
    desc: 'Filters the visitor IP address used for visit tracking.',
    params: [
      { name: '$ip', type: 'string', desc: 'Detected IP address.' },
    ],
    example: `add_filter('fluent_affiliate/user_ip', function($ip) {
    // Return anonymised IP for GDPR compliance
    $parts = explode('.', $ip);
    $parts[3] = '0';
    return implode('.', $parts);
});`,
  },
  'fluent_affiliate/provider_reference_{provider}_url': {
    desc: 'Filters the admin URL for a referral\'s source order/payment. The suffix is the provider slug.',
    params: [
      { name: '$url',      type: 'string',   desc: 'URL to the order/payment admin page.' },
      { name: '$referral', type: 'Referral', desc: 'The Referral model.' },
    ],
    example: `add_filter('fluent_affiliate/provider_reference_my_plugin_url', function($url, $referral) {
    return admin_url('admin.php?page=my-plugin&order=' . $referral->provider_id);
}, 10, 2);`,
  },
  'fluent_affiliate/formatted_order_data_by_{provider}': {
    desc: 'Filters the normalised order data array before a referral is created.',
    params: [
      { name: '$data',  type: 'array',  desc: 'Normalised order data.' },
      { name: '$order', type: 'mixed',  desc: 'Raw order object from the provider.' },
    ],
    example: `add_filter('fluent_affiliate/formatted_order_data_by_fluentcart', function($data, $order) {
    $data['utm_campaign'] = $order->get_meta('utm_campaign');
    return $data;
}, 10, 2);`,
  },
  'fluent_affiliate/get_email_config': {
    desc: 'Filters the global email notification configuration before it is returned to the admin.',
    params: [
      { name: '$config', type: 'array', desc: 'Email configuration array.' },
    ],
    example: `add_filter('fluent_affiliate/get_email_config', function($config) {
    $config['from_name'] = get_bloginfo('name') . ' Affiliates';
    return $config;
});`,
  },
  'fluent_affiliate/update_email_config': {
    desc: 'Filters the email configuration before it is persisted after an admin save.',
    params: [
      { name: '$config', type: 'array', desc: 'New configuration data being saved.' },
    ],
    example: `add_filter('fluent_affiliate/update_email_config', function($config) {
    // Force a specific reply-to address.
    $config['reply_to'] = 'affiliates@example.com';
    return $config;
});`,
  },
  'fluent_affiliate/get_referral_config': {
    desc: 'Filters the referral program configuration before it is returned to the admin.',
    params: [
      { name: '$config', type: 'array', desc: 'Referral configuration array.' },
    ],
    example: `add_filter('fluent_affiliate/get_referral_config', function($config) {
    $config['cookie_expiry'] = 60; // 60 days
    return $config;
});`,
  },
  'fluent_affiliate/update_referral_config': {
    desc: 'Filters the referral configuration before it is saved.',
    params: [
      { name: '$config', type: 'array', desc: 'New referral configuration.' },
    ],
    example: `add_filter('fluent_affiliate/update_referral_config', function($config) {
    return $config;
});`,
  },
  'fluent_affiliate/default_referral_settings': {
    desc: 'Filters the default referral settings used when no custom configuration is saved.',
    params: [
      { name: '$settings', type: 'array', desc: 'Default settings array.' },
    ],
    example: `add_filter('fluent_affiliate/default_referral_settings', function($settings) {
    $settings['cookie_expiry'] = 90;
    return $settings;
});`,
  },
  'fluent_affiliate/registered_features': {
    desc: 'Filters the list of feature modules registered with FluentAffiliate.',
    params: [
      { name: '$features', type: 'array', desc: 'Registered feature definitions.' },
    ],
    example: `add_filter('fluent_affiliate/registered_features', function($features) {
    $features['my_feature'] = ['title' => 'My Feature', 'enabled' => true];
    return $features;
});`,
  },
  'fluent_affiliate/get_feature_settings_{featureKey}': {
    desc: 'Filters the settings returned for a specific feature. The suffix is the feature key.',
    params: [
      { name: '$response',  type: 'array', desc: 'Settings response data.' },
      { name: '$savedData', type: 'array', desc: 'Data as saved in the database.' },
    ],
    example: `add_filter('fluent_affiliate/get_feature_settings_my_feature', function($response, $saved) {
    $response['extra_option'] = get_option('my_extra_option', false);
    return $response;
}, 10, 2);`,
  },
  'fluent_affiliate/update_feature_response_{featureKey}': {
    desc: 'Filters the response after a feature\'s settings are updated.',
    params: [
      { name: '$response',  type: 'array', desc: 'Response data returned to the client.' },
      { name: '$savedData', type: 'array', desc: 'Data as saved.' },
    ],
    example: `add_filter('fluent_affiliate/update_feature_response_my_feature', function($response, $saved) {
    return $response;
}, 10, 2);`,
  },
  'fluent_affiliate/settings_menu_items': {
    desc: 'Filters the settings sub-menu items shown in the admin sidebar.',
    params: [
      { name: '$items', type: 'array', desc: 'Menu item definitions.' },
    ],
    example: `add_filter('fluent_affiliate/settings_menu_items', function($items) {
    $items[] = ['title' => 'My Setting', 'route' => '/settings/my-setting'];
    return $items;
});`,
  },
  'fluent_affiliate/top_menu_items': {
    desc: 'Filters the top navigation items in the FluentAffiliate admin.',
    params: [
      { name: '$items', type: 'array', desc: 'Navigation item definitions.' },
    ],
    example: `add_filter('fluent_affiliate/top_menu_items', function($items) {
    $items[] = ['title' => 'My Page', 'route' => '/my-page', 'icon' => 'el-icon-star-on'];
    return $items;
});`,
  },
  'fluent_affiliate/right_menu_items': {
    desc: 'Filters the right-side navigation items in the admin header.',
    params: [
      { name: '$items', type: 'array', desc: 'Right-side navigation items.' },
    ],
    example: `add_filter('fluent_affiliate/right_menu_items', function($items) {
    return $items;
});`,
  },
  'fluent_affiliate/admin_vars': {
    desc: 'Filters the JavaScript variables object passed to the admin SPA.',
    params: [
      { name: '$vars', type: 'array', desc: 'JS variables object.' },
    ],
    example: `add_filter('fluent_affiliate/admin_vars', function($vars) {
    $vars['my_plugin_key'] = get_option('my_plugin_option');
    return $vars;
});`,
  },
  'fluent_affiliate/dashboard_notices': {
    desc: 'Filters the notices array displayed at the top of the FluentAffiliate dashboard.',
    params: [
      { name: '$notices', type: 'array', desc: 'Array of notice definitions.' },
    ],
    example: `add_filter('fluent_affiliate/dashboard_notices', function($notices) {
    $notices[] = ['type' => 'info', 'message' => 'New payment gateway available!'];
    return $notices;
});`,
  },
  'fluent_affiliate/portal_page_url': {
    desc: 'Filters the URL of the affiliate portal page.',
    params: [
      { name: '$url', type: 'string', desc: 'The portal page URL.' },
    ],
    example: `add_filter('fluent_affiliate/portal_page_url', function($url) {
    return home_url('/affiliates/dashboard/');
});`,
  },
  'fluent_affiliate/admin_url': {
    desc: 'Filters the FluentAffiliate admin URL.',
    params: [
      { name: '$url', type: 'string', desc: 'Admin URL.' },
    ],
    example: `add_filter('fluent_affiliate/admin_url', function($url) {
    return $url;
});`,
  },
  'fluent_affiliate/portal_menu_items': {
    desc: 'Filters the navigation items shown in the affiliate portal sidebar.',
    params: [
      { name: '$items', type: 'array', desc: 'Portal menu items.' },
    ],
    example: `add_filter('fluent_affiliate/portal_menu_items', function($items) {
    $items[] = ['title' => 'My Custom Page', 'route' => 'custom-page', 'icon' => 'el-icon-document'];
    return $items;
});`,
  },
  'fluent_affiliate/get_currencies': {
    desc: 'Filters the list of available currencies.',
    params: [
      { name: '$currencies', type: 'array', desc: 'Array of currency code => label pairs.' },
    ],
    example: `add_filter('fluent_affiliate/get_currencies', function($currencies) {
    $currencies['XBT'] = 'Bitcoin';
    return $currencies;
});`,
  },
  'fluent_affiliate/currency_symbols': {
    desc: 'Filters the currency symbol lookup table.',
    params: [
      { name: '$symbols', type: 'array', desc: 'Array of currency code => symbol pairs.' },
    ],
    example: `add_filter('fluent_affiliate/currency_symbols', function($symbols) {
    $symbols['XBT'] = '₿';
    return $symbols;
});`,
  },
  'fluent_affiliate/referral_formats': {
    desc: 'Filters the available referral link formats (URL parameter styles).',
    params: [
      { name: '$formats', type: 'array', desc: 'Format definitions.' },
    ],
    example: `add_filter('fluent_affiliate/referral_formats', function($formats) {
    return $formats;
});`,
  },
  'fluent_affiliate/payout_form_schema': {
    desc: 'Filters the schema used to render the payout creation form in the admin.',
    params: [
      { name: '$schema', type: 'array', desc: 'Form field schema.' },
    ],
    example: `add_filter('fluent_affiliate/payout_form_schema', function($schema) {
    return $schema;
});`,
  },
  'fluent_affiliate/suggested_colors': {
    desc: 'Filters the colour palette suggested in affiliate creative settings.',
    params: [
      { name: '$colors', type: 'array', desc: 'Array of hex colour strings.' },
    ],
    example: `add_filter('fluent_affiliate/suggested_colors', function($colors) {
    $colors[] = '#ff5722';
    return $colors;
});`,
  },
  'fluent_affiliate/max_execution_time': {
    desc: 'Filters the maximum execution time (seconds) for long-running background jobs.',
    params: [
      { name: '$seconds', type: 'int', desc: 'Max execution seconds.' },
    ],
    example: `add_filter('fluent_affiliate/max_execution_time', function($seconds) {
    return 120;
});`,
  },
  'fluent_affiliate/is_rtl': {
    desc: 'Filters whether RTL (right-to-left) mode is active for the affiliate portal.',
    params: [
      { name: '$isRtl', type: 'bool', desc: '`true` for RTL, `false` for LTR.' },
    ],
    example: `add_filter('fluent_affiliate/is_rtl', '__return_false');`,
  },
  'fluent_affiliate/referral_config_field_types': {
    desc: 'Filters the allowed field types in the referral program configuration form.',
    params: [
      { name: '$fieldTypes', type: 'array', desc: 'Allowed field type keys.' },
    ],
    example: `add_filter('fluent_affiliate/referral_config_field_types', function($fieldTypes) {
    $fieldTypes[] = 'my_custom_type';
    return $fieldTypes;
});`,
  },
  'fluent_affiliate/affiliate_by_param': {
    desc: 'Filters the resolved Affiliate model when looking up an affiliate from a URL parameter.',
    params: [
      { name: '$affiliate', type: 'Affiliate|null', desc: 'Resolved affiliate, or `null` if not found.' },
      { name: '$paramId',   type: 'string',         desc: 'The tracking parameter value from the URL.' },
    ],
    example: `add_filter('fluent_affiliate/affiliate_by_param', function($affiliate, $paramId) {
    // Fall back to lookup by email
    if (!$affiliate) {
        return Affiliate::where('payment_email', $paramId)->first();
    }
    return $affiliate;
}, 10, 2);`,
  },
  'fluent_affiliate/affiliate_attached_coupons': {
    desc: 'Filters the coupons attached to an affiliate.',
    params: [
      { name: '$coupons',   type: 'array',     desc: 'Array of coupon definitions.' },
      { name: '$affiliate', type: 'Affiliate', desc: 'The affiliate.' },
      { name: '$context',   type: 'string',    desc: 'Context string (e.g. `"portal"`, `"admin"`).' },
    ],
    example: `add_filter('fluent_affiliate/affiliate_attached_coupons', function($coupons, $affiliate, $context) {
    $coupons[] = ['code' => 'AFF' . strtoupper($affiliate->custom_param), 'discount' => '10%'];
    return $coupons;
}, 10, 3);`,
  },
  'fluent_affiliate/advanced_report_providers': {
    desc: 'Filters the advanced report providers available in the Reports section.',
    params: [
      { name: '$providers', type: 'array', desc: 'Report provider definitions.' },
    ],
    example: `add_filter('fluent_affiliate/advanced_report_providers', function($providers) {
    $providers['my_report'] = ['title' => 'My Report', 'component' => 'MyReportComponent'];
    return $providers;
});`,
  },
  'fluent_affiliate/migrators': {
    desc: 'Filters the list of available data migrators in the Migration Tools.',
    params: [
      { name: '$migrators', type: 'array', desc: 'Migrator class definitions keyed by slug.' },
    ],
    example: `add_filter('fluent_affiliate/migrators', function($migrators) {
    $migrators['my_plugin'] = ['title' => 'My Plugin Importer', 'class' => MyMigrator::class];
    return $migrators;
});`,
  },
  'fluent_affiliate/get_migration_statistics': {
    desc: 'Filters migration statistics shown in the admin migration tools.',
    params: [
      { name: '$stats', type: 'array', desc: 'Statistics array.' },
    ],
    example: `add_filter('fluent_affiliate/get_migration_statistics', function($stats) {
    $stats['my_plugin'] = MyMigrator::getStats();
    return $stats;
});`,
  },
  'fluent_affiliate/get_current_data_counts': {
    desc: 'Filters the current data counts displayed before a wipe operation.',
    params: [
      { name: '$counts', type: 'array', desc: 'Label => count pairs.' },
    ],
    example: `add_filter('fluent_affiliate/get_current_data_counts', function($counts) {
    return $counts;
});`,
  },
  'fluent_affiliate/terms_policy_url': {
    desc: 'Filters the Terms & Privacy Policy URL shown on the affiliate sign-up form.',
    params: [
      { name: '$url', type: 'string', desc: 'Policy URL (defaults to `get_privacy_policy_url()`).' },
    ],
    example: `add_filter('fluent_affiliate/terms_policy_url', function($url) {
    return home_url('/affiliate-terms/');
});`,
  },
  'fluent_affiliate/auth/signup_fields': {
    desc: 'Filters the form fields shown on the affiliate registration form.',
    params: [
      { name: '$fields', type: 'array',   desc: 'Form field definitions.' },
      { name: '$user',   type: 'WP_User', desc: 'Current user (if logged in).' },
    ],
    example: `add_filter('fluent_affiliate/auth/signup_fields', function($fields, $user) {
    $fields['company'] = [
        'label'    => 'Company Name',
        'type'     => 'text',
        'required' => false,
    ];
    return $fields;
}, 10, 2);`,
  },
  'fluent_affiliate/auth/lost_password_url': {
    desc: 'Filters the lost password URL linked on the affiliate login form.',
    params: [
      { name: '$url', type: 'string', desc: 'Lost password URL.' },
    ],
    example: `add_filter('fluent_affiliate/auth/lost_password_url', function($url) {
    return wp_lostpassword_url(home_url('/affiliate-login/'));
});`,
  },
  'fluent_affiliate/auth/signup_verification_email_body': {
    desc: 'Filters the body of the email verification message sent during sign-up.',
    params: [
      { name: '$message',          type: 'string', desc: 'Email body HTML.' },
      { name: '$verificationCode', type: 'string', desc: 'The verification code.' },
      { name: '$formData',         type: 'array',  desc: 'Submitted form data.' },
    ],
    example: `add_filter('fluent_affiliate/auth/signup_verification_email_body', function($message, $code, $formData) {
    return $message . '<p>Your code expires in 30 minutes.</p>';
}, 10, 3);`,
  },
  'fluent_affiliate/reserved_usernames': {
    desc: 'Filters the list of usernames that affiliates are not allowed to register.',
    params: [
      { name: '$reserved', type: 'array', desc: 'Array of reserved username strings.' },
    ],
    example: `add_filter('fluent_affiliate/reserved_usernames', function($reserved) {
    $reserved[] = 'admin';
    $reserved[] = 'affiliate';
    return $reserved;
});`,
  },
  'fluent_affiliate/auth/auto_approve_affiliates': {
    desc: 'Filters whether new affiliates are automatically approved on registration.',
    params: [
      { name: '$autoApprove', type: 'bool', desc: '`true` to auto-approve. Default `false`.' },
    ],
    example: `add_filter('fluent_affiliate/auth/auto_approve_affiliates', '__return_true');`,
  },
  'fluent_affiliate/auth/after_login_redirect_url': {
    desc: 'Filters the URL the affiliate is redirected to after logging in.',
    params: [
      { name: '$url',  type: 'string',  desc: 'Redirect URL.' },
      { name: '$user', type: 'WP_User', desc: 'The logged-in user.' },
    ],
    example: `add_filter('fluent_affiliate/auth/after_login_redirect_url', function($url, $user) {
    return home_url('/affiliates/');
}, 10, 2);`,
  },
  'fluent_affiliate/auth/after_signup_redirect_url': {
    desc: 'Filters the URL the affiliate is redirected to after signing up.',
    params: [
      { name: '$url',     type: 'string',  desc: 'Redirect URL.' },
      { name: '$user',    type: 'WP_User', desc: 'The newly created user.' },
      { name: '$request', type: 'array',   desc: 'The submitted sign-up form data.' },
    ],
    example: `add_filter('fluent_affiliate/auth/after_signup_redirect_url', function($url, $user, $request) {
    return home_url('/affiliates/welcome/');
}, 10, 3);`,
  },
  'fluent_affiliate/wppayform__defaults': {
    desc: 'Filters the default field values pre-filled into a Paymattic affiliate registration form.',
    params: [
      { name: '$fields', type: 'array', desc: 'Form field defaults.' },
      { name: '$formId', type: 'int',   desc: 'Paymattic form ID.' },
    ],
    example: `add_filter('fluent_affiliate/wppayform__defaults', function($fields, $formId) {
    return $fields;
}, 10, 2);`,
  },

  // ── Pro: Affiliate Groups ──────────────────────────────────────────────────
  'fluent_affiliate/before_create_affiliate_group': {
    desc: 'Fired immediately before a new affiliate group is saved to the database.',
    params: [
      { name: '$data', type: 'array', desc: 'The group data about to be saved: `meta_key` (name), `rate_type`, `rate`, `status`, `notes`.' },
    ],
    example: `add_action('fluent_affiliate/before_create_affiliate_group', function($data) {
    // Validate or log the incoming group data
    error_log('Creating group: ' . $data['meta_key']);
});`,
  },
  'fluent_affiliate/after_create_affiliate_group': {
    desc: 'Fired after a new affiliate group has been successfully created.',
    params: [
      { name: '$group', type: 'AffiliateGroup', desc: 'The newly created AffiliateGroup model.' },
    ],
    example: `add_action('fluent_affiliate/after_create_affiliate_group', function($group) {
    // Sync new group to an external system
    my_crm_sync_group($group->id, $group->meta_key);
});`,
  },
  'fluent_affiliate/before_delete_affiliate_group': {
    desc: 'Fired immediately before an affiliate group is permanently deleted.',
    params: [
      { name: '$group', type: 'AffiliateGroup', desc: 'The AffiliateGroup model about to be deleted.' },
    ],
    example: `add_action('fluent_affiliate/before_delete_affiliate_group', function($group) {
    // Migrate affiliates in this group to a default group
    Affiliate::where('group_id', $group->id)->update(['group_id' => 0]);
});`,
  },
  'fluent_affiliate/after_delete_affiliate_group': {
    desc: 'Fired after an affiliate group has been permanently deleted.',
    params: [
      { name: '$affiliateGroup', type: 'AffiliateGroup', desc: 'The AffiliateGroup model that was deleted (read-only at this point).' },
    ],
    example: `add_action('fluent_affiliate/after_delete_affiliate_group', function($affiliateGroup) {
    // Remove external records for this group
    delete_option('my_plugin_group_' . $affiliateGroup->id . '_config');
});`,
  },

  // ── Pro: Creatives ─────────────────────────────────────────────────────────
  'fluent_affiliate/after_create_creative': {
    desc: 'Fired after a new creative asset has been saved to the database.',
    params: [
      { name: '$creative', type: 'Creative', desc: 'The newly created Creative model.' },
    ],
    example: `add_action('fluent_affiliate/after_create_creative', function($creative) {
    // Notify affiliates about the new creative
    my_plugin_notify_affiliates('New creative available: ' . $creative->name);
});`,
  },
  'fluent_affiliate/creative_updated': {
    desc: 'Fired after a creative asset has been updated.',
    params: [
      { name: '$creative',    type: 'Creative', desc: 'The updated Creative model (new state).' },
      { name: '$oldCreative', type: 'Creative', desc: 'The Creative model before the update (old state).' },
    ],
    example: `add_action('fluent_affiliate/creative_updated', function($creative, $oldCreative) {
    // Flush CDN cache only when the image URL changed
    if ($creative->image !== $oldCreative->image) {
        my_cdn_purge_url($oldCreative->image);
    }
}, 10, 2);`,
  },
  'fluent_affiliate/before_delete_creative': {
    desc: 'Fired immediately before a creative asset is permanently deleted.',
    params: [
      { name: '$creative', type: 'Creative', desc: 'The Creative model about to be deleted.' },
    ],
    example: `add_action('fluent_affiliate/before_delete_creative', function($creative) {
    // Archive the creative before deletion
    my_plugin_archive_creative($creative);
});`,
  },
  'fluent_affiliate/after_delete_creative': {
    desc: 'Fired after a creative asset has been permanently deleted.',
    params: [
      { name: '$creative', type: 'Creative', desc: 'The Creative model that was deleted (read-only at this point).' },
    ],
    example: `add_action('fluent_affiliate/after_delete_creative', function($creative) {
    // Clean up any custom data tied to this creative
    delete_post_meta(0, '_fa_creative_ref_' . $creative->id);
});`,
  },
  'fluent_affiliate/creative_status_changed': {
    desc: 'Fired when a creative\'s status transitions (e.g. scheduled → active, active → expired). Triggered by the Action Scheduler jobs. Read `$creative->status` to determine the new status.',
    params: [
      { name: '$creative', type: 'Creative', desc: 'The Creative model with its already-updated status field.' },
    ],
    example: `add_action('fluent_affiliate/creative_status_changed', function($creative) {
    if ($creative->status === 'active') {
        // Notify relevant affiliates the creative is now live
    }
});`,
  },
  'fluent_affiliate/activate_creative': {
    desc: 'Action Scheduler job name used to activate a scheduled creative at its `start_time`. Do not hook into this unless you understand the scheduling lifecycle.',
    params: [
      { name: '$creativeId', type: 'int', desc: 'ID of the creative to activate.' },
    ],
    example: `// This is primarily an internal Action Scheduler hook.
// Use 'fluent_affiliate/creative_status_changed' to react to status changes.`,
  },
  'fluent_affiliate/expire_creative': {
    desc: 'Action Scheduler job name used to expire a scheduled creative at its `end_time`. Do not hook into this unless you understand the scheduling lifecycle.',
    params: [
      { name: '$creativeId', type: 'int', desc: 'ID of the creative to expire.' },
    ],
    example: `// This is primarily an internal Action Scheduler hook.
// Use 'fluent_affiliate/creative_status_changed' to react to status changes.`,
  },

  // ── Pro: Creative Filters ──────────────────────────────────────────────────
  'fluent_affiliate/create_creative_data': {
    desc: 'Filters the creative data array before a new creative is inserted.',
    params: [
      { name: '$data', type: 'array', desc: 'Creative data including `name`, `type`, `url`, `privacy`, `affiliate_ids`, `group_ids`, `meta`.' },
    ],
    example: `add_filter('fluent_affiliate/create_creative_data', function($data) {
    // Enforce max width for image creatives
    if ($data['type'] === 'image' && isset($data['meta']['media_width'])) {
        $data['meta']['media_width'] = min($data['meta']['media_width'], 728);
    }
    return $data;
});`,
  },
  'fluent_affiliate/update_creative_data': {
    desc: 'Filters the creative data array before an existing creative is updated.',
    params: [
      { name: '$data', type: 'array', desc: 'Updated creative data including `name`, `type`, `url`, `privacy`, `affiliate_ids`, `group_ids`, `meta`.' },
    ],
    example: `add_filter('fluent_affiliate/update_creative_data', function($data) {
    // Prevent type from being changed via the API
    unset($data['type']);
    return $data;
});`,
  },

  // ── Pro: Affiliate Group Filters ───────────────────────────────────────────
  'fluent_affiliate/create_affiliate_group_data_value': {
    desc: 'Filters the serialised value stored in `fa_meta` when a new affiliate group is created.',
    params: [
      { name: '$value', type: 'array', desc: 'Group value array: `rate_type`, `rate`, `status`, `notes`.' },
      { name: '$data',  type: 'array', desc: 'The full incoming request data.' },
    ],
    example: `add_filter('fluent_affiliate/create_affiliate_group_data_value', function($value, $data) {
    // Add a custom field to every new group
    $value['custom_tier'] = sanitize_text_field($data['custom_tier'] ?? 'standard');
    return $value;
}, 10, 2);`,
  },
  'fluent_affiliate/update_affiliate_group_data_value': {
    desc: 'Filters the serialised value stored in `fa_meta` when an existing affiliate group is updated.',
    params: [
      { name: '$value', type: 'array',         desc: 'Group value array with updated fields.' },
      { name: '$group', type: 'AffiliateGroup', desc: 'The existing group model being updated.' },
      { name: '$data',  type: 'array',         desc: 'The full incoming request data.' },
    ],
    example: `add_filter('fluent_affiliate/update_affiliate_group_data_value', function($value, $group, $data) {
    return $value;
}, 10, 3);`,
  },

  // ── Pro: Social Media Share Filters ───────────────────────────────────────
  'fluent_affiliate/social_media_links': {
    desc: 'Filters the array of social media platform definitions shown in the affiliate portal share widget. Each item must have `key`, `title`, `icon`, `share_url`, and `status`.',
    params: [
      { name: '$links', type: 'array', desc: 'Associative array of platform definitions keyed by slug (e.g. `twitter`, `facebook`).' },
    ],
    example: `add_filter('fluent_affiliate/social_media_links', function($links) {
    // Add a custom platform
    $links['mastodon'] = [
        'key'       => 'mastodon',
        'title'     => 'Mastodon',
        'icon'      => '<svg>…</svg>',
        'share_url' => 'https://mastodon.social/share?text={title}%20{url}',
        'status'    => 'yes',
    ];
    return $links;
});`,
  },
  'fluent_affiliate/social_media_share_default_enabled_keys': {
    desc: 'Filters the list of social platform keys that are enabled by default (when no custom configuration has been saved). Defaults to `[\'facebook\', \'twitter\', \'linkedin\', \'whatsapp\', \'email\']`.',
    params: [
      { name: '$keys', type: 'array', desc: 'Array of platform key strings.' },
    ],
    example: `add_filter('fluent_affiliate/social_media_share_default_enabled_keys', function($keys) {
    // Only enable Twitter and email by default
    return ['twitter', 'email'];
});`,
  },

  // ── Pro: WooCommerce Integration Filters ───────────────────────────────────
  'fluent_affiliate/woo_menu_link_position': {
    desc: 'Filters the menu position integer for the FluentAffiliate link added to the WooCommerce My Account menu.',
    params: [
      { name: '$position', type: 'int', desc: 'Menu priority/position. Lower = earlier in the list.' },
    ],
    example: `add_filter('fluent_affiliate/woo_menu_link_position', function($position) {
    return 5; // Move to top of account menu
});`,
  },
  'fluent_affiliate/woo_menu_label': {
    desc: 'Filters the label text for the FluentAffiliate link in the WooCommerce My Account menu.',
    params: [
      { name: '$label', type: 'string', desc: 'The menu item label. Defaults to `\'Affiliate Dashboard\'`.' },
    ],
    example: `add_filter('fluent_affiliate/woo_menu_label', function($label) {
    return __('My Referrals', 'my-plugin');
});`,
  },

  // ── Pro: Recurring Commissions ─────────────────────────────────────────────
  // ── Pro: Recurring Referrals ───────────────────────────────────────────────
  'fluent_affiliate/recurring_referral_created': {
    desc: 'Fired after a recurring referral is recorded for a subscription renewal (WooCommerce Subscriptions or FluentCart). Fires on every renewal, not just the first.',
    params: [
      { name: '$referral', type: 'Referral', desc: 'The newly created Referral model for this renewal.' },
    ],
    example: `add_action('fluent_affiliate/recurring_referral_created', function($referral) {
    // Log each recurring commission for external reporting
    my_plugin_log_recurring_commission($referral->affiliate_id, $referral->amount);
});`,
  },

  // ── Pro: Recurring Commission Filters ─────────────────────────────────────
  // ── Core: Admin URL / JS vars ──────────────────────────────────────────────
  'fluent_affiliate_base_url': {
    desc: 'Filters the base URL used by the admin SPA hash router. Override this if you serve the admin under a non-standard path.',
    params: [
      { name: '$url', type: 'string', desc: 'The admin page URL used as the hash router base.' },
    ],
    example: `add_filter('fluent_affiliate_base_url', function($url) {
    return admin_url('admin.php?page=fluent-affiliate');
});`,
  },
  'fluent_affiliate_tracker_vars': {
    desc: 'Filters the JavaScript variable object passed to the front-end affiliate tracking script. Add keys here to expose custom data to the tracker.',
    params: [
      { name: '$vars', type: 'array', desc: 'Associative array of variables localised to the tracking script.' },
    ],
    example: `add_filter('fluent_affiliate_tracker_vars', function($vars) {
    $vars['cookie_lifetime'] = 90; // expose custom cookie lifetime to JS
    return $vars;
});`,
  },
  'fluent_affiliate_dashboard_stats': {
    desc: 'Filters the full dashboard statistics response before it is returned to the admin SPA. Useful for adding or removing widgets from the admin dashboard overview.',
    params: [
      { name: '$stats', type: 'array', desc: 'Associative array of stat widgets (each with `title`, `count`, `is_money`).' },
    ],
    example: `add_filter('fluent_affiliate_dashboard_stats', function($stats) {
    unset($stats['pending_payout']); // remove a widget
    return $stats;
});`,
  },
  'fluent_affiliate_dashboard_{provider}_stats': {
    desc: 'Dynamic filter for per-integration dashboard stats widgets. The `{provider}` segment is the integration key (e.g. `woo`, `edd`, `fla`). Allows adding integration-specific stat widgets to the dashboard.',
    params: [
      { name: '$widgets', type: 'array', desc: 'Array of widget definitions for this provider (each with `title`, `count`, `is_money`).' },
    ],
    example: `// Example: modify stats for the WooCommerce integration
add_filter('fluent_affiliate_dashboard_woo_stats', function($widgets) {
    $widgets['custom_metric'] = ['title' => 'My Metric', 'count' => 0, 'is_money' => false];
    return $widgets;
});`,
  },
  'fluent_affiliate/get_product_cat_options_{integration}': {
    desc: 'Dynamic filter for populating the product/category options list in an integration settings form. The `{integration}` segment is the integration slug (e.g. `woo`, `edd`). Return an array of `{ id, name }` objects.',
    params: [
      { name: '$options', type: 'array', desc: 'Array of option objects, each with `id` (int) and `name` (string).' },
    ],
    example: `// Example: add a custom option to the WooCommerce product category list
add_filter('fluent_affiliate/get_product_cat_options_woo', function($options) {
    $options[] = ['id' => 999, 'name' => 'My Custom Category'];
    return $options;
});`,
  },

  // ── Pro: Recurring Commission Filters ─────────────────────────────────────
  'fluent_affiliate/recurring_commission': {
    desc: 'Filters the recurring commission data before it is recorded for a subscription renewal.',
    params: [
      { name: '$commissionData', type: 'array', desc: 'Commission data: `amount`, `rate`, `rate_type`, `renewal_count`, `max_renewal_count`.' },
      { name: '$context',        type: 'array', desc: 'Renewal context: `order`, `affiliate`, `referral` (original).' },
    ],
    example: `add_filter('fluent_affiliate/recurring_commission', function($commissionData, $context) {
    // Reduce recurring commission by 50% after 3 renewals
    if ($commissionData['renewal_count'] > 3) {
        $commissionData['amount'] *= 0.5;
    }
    return $commissionData;
}, 10, 2);`,
  },
}

// ---------------------------------------------------------------------------
// Route parser
// ---------------------------------------------------------------------------

function parseRoutes(apiFile) {
  const content = readFile(apiFile)
  if (!content) return []

  const routes = []

  // Match prefix groups — policy may be a string 'PolicyName' or a ::class reference
  // e.g. withPolicy('AdminPolicy') OR withPolicy(\Full\Class\Name::class)
  const groupRe = /\$router->prefix\('([^']+)'\)->withPolicy\(([^)]+)\)->group\(function\s*\(\$router\)\s*\{([\s\S]*?)\n\}\);/g
  let gm
  while ((gm = groupRe.exec(content)) !== null) {
    const [, prefix, rawPolicy, body] = gm
    // Normalise policy: extract class name from '...' or \Full\Class::class
    let policy = rawPolicy.trim()
    if (policy.startsWith("'") || policy.startsWith('"')) {
      policy = policy.replace(/['"]/g, '')
    } else {
      // \Full\Class\PolicyName::class  →  PolicyName
      const classMatch = policy.match(/(\w+)::class/)
      policy = classMatch ? classMatch[1] : policy
    }

    const routeRe = /\$router->(get|post|patch|delete|put)\s*\(\s*'([^']+)'\s*,\s*\[([^:,\]]+)::class\s*,\s*'([^']+)'\]/g
    let rm
    while ((rm = routeRe.exec(body)) !== null) {
      const [, method, path, controllerFull, action] = rm
      const controller = controllerFull.trim().split('\\').pop().trim()
      routes.push({ method: method.toUpperCase(), prefix, path: path === '/' ? '' : path, controller, action, policy })
    }
  }

  return routes
}

// ---------------------------------------------------------------------------
// Model metadata
// ---------------------------------------------------------------------------

const MODEL_META = {
  fa_affiliates: {
    class: 'Affiliate',
    file:  'app/Models/Affiliate.php',
    desc:  'Represents a registered affiliate. Central model in FluentAffiliate.',
    relations: [
      { method: 'user()',         type: 'belongsTo',  target: 'User',        desc: 'WordPress user owning this affiliate account.' },
      { method: 'referrals()',    type: 'hasMany',     target: 'Referral',    desc: 'All referrals attributed to this affiliate.' },
      { method: 'visits()',       type: 'hasMany',     target: 'Visit',       desc: 'All tracked visits attributed to this affiliate.' },
      { method: 'transactions()', type: 'hasMany',     target: 'Transaction', desc: 'All payout transactions for this affiliate.' },
      { method: 'payouts()',      type: 'belongsToMany', target: 'Payout',    desc: 'Payouts that include this affiliate.' },
      { method: 'group()',        type: 'belongsTo',  target: 'AffiliateGroup', desc: 'Affiliate group (Pro).' },
      { method: 'meta()',         type: 'hasMany',     target: 'Meta',        desc: 'Meta key-value pairs for this affiliate.' },
    ],
    scopes: [
      { name: 'ofStatus($status)',    desc: 'Filter by `status`.' },
      { name: 'searchBy($search)',    desc: 'Full-text search across user email/name and `custom_param`.' },
      { name: 'filterByGroups($ids)', desc: 'Restrict to affiliates in the given group IDs.' },
    ],
    example: `use FluentAffiliate\\App\\Models\\Affiliate;

// Active affiliates with earnings
$affiliates = Affiliate::ofStatus('active')
    ->where('unpaid_earnings', '>', 0)
    ->orderBy('total_earnings', 'desc')
    ->get();`,
  },
  fa_referrals: {
    class: 'Referral',
    file:  'app/Models/Referral.php',
    desc:  'Represents a commission event generated when a referred visitor completes a qualifying action.',
    relations: [
      { method: 'affiliate()',  type: 'belongsTo', target: 'Affiliate',   desc: 'Affiliate who earned this referral.' },
      { method: 'customer()',   type: 'belongsTo', target: 'Customer',    desc: 'Customer who made the purchase.' },
      { method: 'visit()',      type: 'belongsTo', target: 'Visit',       desc: 'Click-through visit that led to this referral.' },
      { method: 'payout()',     type: 'belongsTo', target: 'Payout',      desc: 'Payout batch that paid this referral.' },
      { method: 'transaction()', type: 'belongsTo', target: 'Transaction', desc: 'Payout transaction record.' },
    ],
    scopes: [
      { name: 'ofStatus($status)',   desc: 'Filter by `status`.' },
      { name: 'searchBy($search)',   desc: 'Search across description and provider fields.' },
      { name: 'filterByAffiliate($id)', desc: 'Restrict to a specific affiliate.' },
    ],
    example: `use FluentAffiliate\\App\\Models\\Referral;

$unpaid = Referral::ofStatus('unpaid')
    ->where('affiliate_id', $affiliateId)
    ->sum('amount');`,
  },
  fa_payouts: {
    class: 'Payout',
    file:  'app/Models/Payout.php',
    desc:  'A payout batch grouping multiple affiliate transactions.',
    relations: [
      { method: 'transactions()', type: 'hasMany',     target: 'Transaction', desc: 'Individual payout transactions in this batch.' },
      { method: 'affiliates()',   type: 'belongsToMany', target: 'Affiliate', desc: 'Affiliates included in this payout.' },
      { method: 'referrals()',    type: 'hasManyThrough', target: 'Referral', desc: 'Referrals covered by this payout.' },
    ],
    scopes: [
      { name: 'ofStatus($status)', desc: 'Filter by `status`.' },
      { name: 'searchBy($search)', desc: 'Search by title or description.' },
    ],
    example: `use FluentAffiliate\\App\\Models\\Payout;

$processed = Payout::ofStatus('processed')
    ->with('transactions')
    ->orderBy('created_at', 'desc')
    ->get();`,
  },
  fa_payout_transactions: {
    class: 'Transaction',
    file:  'app/Models/Transaction.php',
    desc:  'An individual payout transaction for a single affiliate within a payout batch.',
    relations: [
      { method: 'affiliate()', type: 'belongsTo', target: 'Affiliate', desc: 'Affiliate receiving this payment.' },
      { method: 'payout()',    type: 'belongsTo', target: 'Payout',    desc: 'Parent payout batch.' },
    ],
    scopes: [
      { name: 'ofStatus($status)', desc: 'Filter by `status`.' },
    ],
    example: `use FluentAffiliate\\App\\Models\\Transaction;

$paid = Transaction::ofStatus('paid')
    ->where('affiliate_id', $affiliateId)
    ->sum('total_amount');`,
  },
  fa_visits: {
    class: 'Visit',
    file:  'app/Models/Visit.php',
    desc:  'Tracks each click of an affiliate referral link.',
    relations: [
      { method: 'affiliate()', type: 'belongsTo', target: 'Affiliate', desc: 'Affiliate whose link was clicked.' },
      { method: 'referral()',  type: 'hasOne',    target: 'Referral',  desc: 'Referral created from this visit (if any).' },
    ],
    scopes: [
      { name: 'filterByAffiliate($id)',    desc: 'Restrict to a specific affiliate.' },
      { name: 'filterByCampaign($campaign)', desc: 'Filter by UTM campaign.' },
    ],
    example: `use FluentAffiliate\\App\\Models\\Visit;

$visits = Visit::filterByAffiliate($affiliateId)
    ->whereBetween('created_at', [$startDate, $endDate])
    ->count();`,
  },
  fa_customers: {
    class: 'Customer',
    file:  'app/Models/Customer.php',
    desc:  'A customer who made a purchase through an affiliate link.',
    relations: [
      { method: 'affiliate()',  type: 'belongsTo', target: 'Affiliate', desc: 'The affiliate who referred this customer.' },
      { method: 'referrals()',  type: 'hasMany',   target: 'Referral',  desc: 'All referrals from this customer.' },
    ],
    scopes: [
      { name: 'searchBy($search)', desc: 'Search by email, first name, or last name.' },
    ],
    example: `use FluentAffiliate\\App\\Models\\Customer;

$customer = Customer::where('email', $email)->first();`,
  },
  fa_meta: {
    class: 'Meta',
    file:  'app/Models/Meta.php',
    desc:  'Generic key-value meta storage for affiliate and other objects.',
    relations: [],
    scopes: [
      { name: 'ofObjectType($type)', desc: 'Filter by `object_type`.' },
      { name: 'ofObjectId($id)',     desc: 'Filter by `object_id`.' },
    ],
    example: `use FluentAffiliate\\App\\Models\\Meta;

$value = Meta::where('object_type', 'affiliate')
    ->where('object_id', $affiliateId)
    ->where('meta_key', 'custom_rate_override')
    ->value('value');`,
  },
  fa_creatives: {
    class: 'Creative',
    file:  'app/Models/Creative.php',
    desc:  'A marketing creative asset (banner, image, or text) managed in FluentAffiliate Pro.',
    isPro: true,
    relations: [],
    scopes: [
      { name: 'ofStatus($status)',  desc: 'Filter by `status`.' },
      { name: 'ofType($type)',      desc: 'Filter by creative `type`.' },
      { name: 'publicCreatives()',  desc: 'Restrict to publicly visible creatives.' },
    ],
    example: `use FluentAffiliatePro\\App\\Models\\Creative;

$banners = Creative::ofStatus('active')
    ->ofType('image')
    ->publicCreatives()
    ->get();`,
  },
  // AffiliateGroup is stored in fa_meta (object_type = 'affiliate_group'), not a dedicated table.
  // Documented as a virtual entry — no migration columns, but the model metadata is useful.
  fa_affiliate_groups_virtual: {
    class: 'AffiliateGroup',
    file:  'app/Models/AffiliateGroup.php',
    desc:  'Affiliate groups — stored in `fa_meta` with `object_type = \'affiliate_group\'`. Each group\'s name is the `meta_key`; commission overrides are serialized in `value`.',
    isPro: true,
    relations: [
      { method: 'affiliates()', type: 'hasMany', target: 'Affiliate', desc: 'Affiliates assigned to this group.' },
    ],
    scopes: [
      { name: 'search($query)', desc: 'Search by group name (`meta_key`) or value content.' },
    ],
    example: `use FluentAffiliate\\App\\Models\\AffiliateGroup;

// Get all active groups
$groups = AffiliateGroup::where('value->status', 'active')->get();

// Get affiliates in a group
$group = AffiliateGroup::find($groupId);
$affiliates = $group->affiliates()->ofStatus('active')->get();`,
  },
}

// ---------------------------------------------------------------------------
// Markdown generators — Database
// ---------------------------------------------------------------------------

function buildSchemaDoc(tables) {
  const tableOrder = [
    'fa_affiliates', 'fa_referrals', 'fa_payouts', 'fa_payout_transactions',
    'fa_visits', 'fa_customers', 'fa_meta', 'fa_creatives'
  ]

  const lines = [
    '---',
    'title: Database Schema',
    'description: Overview of all FluentAffiliate database tables and their relationships.',
    '---',
    '',
    '# Database Schema',
    '',
    'FluentAffiliate uses **custom database tables** (not WordPress post types). All tables are prefixed with `fa_` in addition to the WordPress table prefix (`$wpdb->prefix`).',
    '',
    '## Table Inventory',
    '',
    '| Table | Description |',
    '|-------|-------------|',
  ]

  for (const t of tableOrder) {
    const meta = MODEL_META[t]
    if (!meta) continue
    const proTag = meta.isPro ? ' <span class="pro-badge">PRO</span>' : ''
    lines.push(`| [\`${t}\`](#${t.replace(/_/g, '-')}) | ${meta.desc}${proTag} |`)
  }

  lines.push('', '## Entity Relationships', '', '```mermaid')
  lines.push(`erDiagram
    fa_affiliates {
        bigint id PK
        bigint user_id FK
        bigint group_id FK
        double rate
        double total_earnings
        double unpaid_earnings
        varchar status
        varchar rate_type
        varchar custom_param
    }
    fa_referrals {
        bigint id PK
        bigint affiliate_id FK
        bigint customer_id FK
        bigint visit_id FK
        bigint payout_id FK
        double amount
        varchar status
        varchar provider
        varchar type
    }
    fa_payouts {
        bigint id PK
        bigint created_by FK
        double total_amount
        varchar status
        varchar payout_method
    }
    fa_payout_transactions {
        bigint id PK
        bigint affiliate_id FK
        bigint payout_id FK
        double total_amount
        varchar status
        varchar payout_method
    }
    fa_visits {
        bigint id PK
        bigint affiliate_id FK
        bigint referral_id FK
        mediumtext url
        varchar utm_campaign
    }
    fa_customers {
        bigint id PK
        bigint user_id FK
        bigint by_affiliate_id FK
        varchar email
    }
    fa_meta {
        bigint id PK
        bigint object_id FK
        varchar object_type
        varchar meta_key
        longtext value
    }
    fa_affiliates ||--o{ fa_referrals : "has many"
    fa_affiliates ||--o{ fa_visits : "has many"
    fa_affiliates ||--o{ fa_payout_transactions : "has many"
    fa_referrals }o--|| fa_customers : "belongs to"
    fa_referrals }o--|| fa_visits : "belongs to"
    fa_referrals }o--|| fa_payouts : "belongs to"
    fa_payout_transactions }o--|| fa_payouts : "belongs to"
    fa_meta }o--|| fa_affiliates : "polymorphic"
\`\`\``)

  // Per-table details
  for (const tableName of tableOrder) {
    const cols = tables[tableName]
    const meta = MODEL_META[tableName]
    if (!cols || !meta) continue

    const proTag = meta.isPro ? ' <span class="pro-badge">PRO</span>' : ''
    const TABLE_MODEL_SLUG = { fa_affiliates: 'affiliate', fa_referrals: 'referral', fa_payouts: 'payout', fa_payout_transactions: 'transaction', fa_visits: 'visit', fa_customers: 'customer', fa_meta: 'meta', fa_creatives: 'creative' }
    const modelSlug = TABLE_MODEL_SLUG[tableName] ?? tableName.replace('fa_', '').replace(/_/g, '-')
    lines.push('', `## \`${tableName}\`${proTag}`, '', meta.desc, '', `**Model class:** [\`${meta.class}\`](/database/models/${modelSlug})`, '', '| Column | Type | Nullable | Default | Description |', '|--------|------|----------|---------|-------------|')

    for (const col of cols) {
      const def = col.default !== null ? `\`${col.default}\`` : '—'
      lines.push(`| \`${col.name}\` | \`${col.type}\` | ${col.nullable} | ${def} | ${col.desc} |`)
    }
  }

  return lines.join('\n') + '\n'
}

function buildModelDoc(tableName, columns, meta) {
  if (!meta || !columns) return null

  const proTag = meta.isPro ? ' <span class="pro-badge">PRO</span>' : ''
  const lines = [
    '---',
    `title: ${meta.class} Model${meta.isPro ? ' (Pro)' : ''}`,
    `description: ${meta.desc}`,
    '---',
    '',
    `# ${meta.class}${proTag}`,
    '',
    meta.desc,
    '',
    `**Table:** \`${tableName}\`  `,
    `**Class:** \`${meta.file.replace('app/Models/', 'FluentAffiliate\\\\App\\\\Models\\\\')}\``,
    '',
    '## Columns',
    '',
    '| Column | Type | Nullable | Default | Description |',
    '|--------|------|----------|---------|-------------|',
  ]

  for (const col of columns) {
    const def = col.default !== null ? `\`${col.default}\`` : '—'
    lines.push(`| \`${col.name}\` | \`${col.type}\` | ${col.nullable} | ${def} | ${col.desc} |`)
  }

  if (meta.relations && meta.relations.length > 0) {
    lines.push('', '## Relationships', '', '| Method | Type | Target | Description |', '|--------|------|--------|-------------|')
    for (const rel of meta.relations) {
      lines.push(`| \`${rel.method}\` | \`${rel.type}\` | \`${rel.target}\` | ${rel.desc} |`)
    }
  }

  if (meta.scopes && meta.scopes.length > 0) {
    lines.push('', '## Query Scopes', '', '| Scope | Description |', '|-------|-------------|')
    for (const scope of meta.scopes) {
      lines.push(`| \`${scope.name}\` | ${scope.desc} |`)
    }
  }

  if (meta.example) {
    lines.push('', '## Usage Example', '', '```php', meta.example, '```')
  }

  return lines.join('\n') + '\n'
}

function buildModelsIndexDoc(tables) {
  const lines = [
    '---',
    'title: Models Overview',
    'description: Index of all FluentAffiliate ORM model classes.',
    '---',
    '',
    '# Models Overview',
    '',
    'FluentAffiliate uses an Eloquent-like ORM (WPFluent Framework). All models extend `FluentAffiliate\\Framework\\Database\\Orm\\Builder`.',
    '',
    '| Model | Table | Description |',
    '|-------|-------|-------------|',
  ]

  const tableOrder = [
    'fa_affiliates', 'fa_referrals', 'fa_payouts', 'fa_payout_transactions',
    'fa_visits', 'fa_customers', 'fa_meta', 'fa_creatives'
  ]

  for (const t of tableOrder) {
    const meta = MODEL_META[t]
    if (!meta) continue
    const proTag = meta.isPro ? ' <span class="pro-badge">PRO</span>' : ''
    const TABLE_MODEL_SLUG2 = { fa_affiliates: 'affiliate', fa_referrals: 'referral', fa_payouts: 'payout', fa_payout_transactions: 'transaction', fa_visits: 'visit', fa_customers: 'customer', fa_meta: 'meta', fa_creatives: 'creative' }
    const slug   = TABLE_MODEL_SLUG2[t] ?? t.replace('fa_', '').replace(/_/g, '-')
    lines.push(`| [\`${meta.class}\`](/database/models/${slug}) | \`${t}\` | ${meta.desc}${proTag} |`)
  }

  return lines.join('\n') + '\n'
}

// ---------------------------------------------------------------------------
// Markdown generators — Hooks
// ---------------------------------------------------------------------------

function categoriseHook(hook, categories) {
  for (const [cat, fn] of Object.entries(categories)) {
    if (fn(hook)) return cat
  }
  return null
}

function hookAnchor(hook) {
  // Match VitePress anchor generation: /, _, {, }, . all become -, collapse multiples, lowercase
  return hook
    .toLowerCase()
    .replace(/[/._{}]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function renderHookSection(hook, hookInfo, type) {
  const doc = HOOK_DOCS[hook]
  const lines = []

  lines.push(`## \`${hook}\``, '')

  if (doc?.desc) {
    lines.push(doc.desc, '')
  } else if (hookInfo.isDynamic) {
    lines.push('Dynamic hook — the suffix is determined at runtime. See source for exact usage.', '')
  }

  if (hookInfo.isPro) {
    lines.push('> **Requires FluentAffiliate Pro.**', '')
  }

  // Parameters table
  if (doc?.params && doc.params.length > 0) {
    lines.push('**Parameters**', '', '| Parameter | Type | Description |', '|-----------|------|-------------|')
    for (const p of doc.params) {
      lines.push(`| \`${p.name}\` | \`${p.type}\` | ${p.desc} |`)
    }
    lines.push('')
    lines.push(`**Source:** \`${hookInfo.files[0] ?? 'n/a'}\``)
  } else {
    lines.push(`**Source:** \`${hookInfo.files[0] ?? 'n/a'}\``)
  }

  if (doc?.example) {
    lines.push('', '```php', doc.example, '```')
  }

  lines.push('')
  return lines.join('\n')
}

function buildHookCategoryDoc(title, hooks, hookMap, type) {
  if (hooks.length === 0) {
    return [
      '---',
      `title: ${title}`,
      `description: ${type === 'action' ? 'Action' : 'Filter'} hooks in the ${title} category.`,
      '---',
      '',
      `# ${title}`,
      '',
      'No hooks in this category are available in the current plugin version.',
      '',
    ].join('\n') + '\n'
  }

  const lines = [
    '---',
    `title: ${title}`,
    `description: ${type === 'action' ? 'Action' : 'Filter'} hooks in the ${title} category.`,
    '---',
    '',
    `# ${title}`,
    '',
    '## Hook Reference',
    '',
    '| Hook | Description |',
    '|------|-------------|',
  ]

  for (const hook of hooks) {
    const doc  = HOOK_DOCS[hook]
    const desc = doc?.desc ? doc.desc.split('.')[0] + '.' : 'See source.'
    lines.push(`| [\`${hook}\`](#${hookAnchor(hook)}) | ${desc} |`)
  }

  lines.push('')

  for (const hook of hooks) {
    lines.push(renderHookSection(hook, hookMap[hook], type))
  }

  return lines.join('\n') + '\n'
}

function buildHooksIndexDoc(actionMap, filterMap) {
  const actionCount = Object.keys(actionMap).length
  const filterCount = Object.keys(filterMap).length

  return [
    '---',
    'title: Hooks Overview',
    'description: Overview of all FluentAffiliate WordPress action and filter hooks.',
    '---',
    '',
    '# Hooks Overview',
    '',
    `FluentAffiliate registers **${actionCount} action hooks** and **${filterCount} filter hooks** (including dynamic variants).`,
    '',
    '## Action Hooks',
    '',
    '| Category | Description |',
    '|----------|-------------|',
    '| [Affiliates](/hooks/actions/affiliates) | Affiliate lifecycle events |',
    '| [Referrals](/hooks/actions/referrals) | Referral creation and status changes |',
    '| [Payouts](/hooks/actions/payouts) | Payout and transaction events |',
    '| [Portal](/hooks/actions/portal) | Customer portal render hooks |',
    '| [Integrations](/hooks/actions/integrations) | Third-party integration and migration events |',
    '| [Groups](/hooks/actions/groups) | Affiliate group lifecycle events <span class="pro-badge">PRO</span> |',
    '| [Creatives](/hooks/actions/creatives) | Creative asset lifecycle events <span class="pro-badge">PRO</span> |',
    '',
    '## Filter Hooks',
    '',
    '| Category | Description |',
    '|----------|-------------|',
    '| [Affiliates](/hooks/filters/affiliates) | Affiliate data and behaviour filters |',
    '| [Referrals](/hooks/filters/referrals) | Commission and referral data filters |',
    '| [Permissions](/hooks/filters/permissions) | Access control filters |',
    '| [Portal](/hooks/filters/portal) | Affiliate portal UI filters |',
    '| [Settings](/hooks/filters/settings) | Plugin configuration and admin UI filters |',
    '| [Auth](/hooks/filters/auth) | Registration and login filters |',
    '| [Integrations](/hooks/filters/integrations) | Integration config and data filters |',
    '| [Groups](/hooks/filters/groups) | Affiliate group data filters <span class="pro-badge">PRO</span> |',
    '| [Creatives](/hooks/filters/creatives) | Creative asset data filters <span class="pro-badge">PRO</span> |',
    '',
  ].join('\n') + '\n'
}

function buildActionHooksIndexDoc(actionMap) {
  const actionCount = Object.keys(actionMap).length

  return [
    '---',
    'title: Action Hooks',
    'description: All FluentAffiliate WordPress action hooks, organized by category.',
    '---',
    '',
    '# Action Hooks',
    '',
    `FluentAffiliate fires **${actionCount} action hooks** (including dynamic variants). Use \`add_action()\` to hook into these events.`,
    '',
    '| Category | Description |',
    '|----------|-------------|',
    '| [Affiliates](/hooks/actions/affiliates) | Affiliate lifecycle events — created, updated, status changes, deleted |',
    '| [Referrals](/hooks/actions/referrals) | Referral creation, status transitions, and deletion |',
    '| [Payouts](/hooks/actions/payouts) | Payout batch and transaction events |',
    '| [Portal](/hooks/actions/portal) | Customer portal render hooks |',
    '| [Integrations](/hooks/actions/integrations) | Third-party integration events and data migration hooks |',
    '| [Groups](/hooks/actions/groups) | Affiliate group lifecycle events <span class="pro-badge">PRO</span> |',
    '| [Creatives](/hooks/actions/creatives) | Creative asset lifecycle events <span class="pro-badge">PRO</span> |',
    '',
  ].join('\n') + '\n'
}

function buildFilterHooksIndexDoc(filterMap) {
  const filterCount = Object.keys(filterMap).length

  return [
    '---',
    'title: Filter Hooks',
    'description: All FluentAffiliate WordPress filter hooks, organized by category.',
    '---',
    '',
    '# Filter Hooks',
    '',
    `FluentAffiliate exposes **${filterCount} filter hooks** (including dynamic variants). Use \`add_filter()\` to modify data or behaviour.`,
    '',
    '| Category | Description |',
    '|----------|-------------|',
    '| [Affiliates](/hooks/filters/affiliates) | Affiliate data, rate calculation, and display filters |',
    '| [Referrals](/hooks/filters/referrals) | Commission amounts, referral data, and provider URL filters |',
    '| [Permissions](/hooks/filters/permissions) | Access control and capability checks |',
    '| [Portal](/hooks/filters/portal) | Affiliate portal UI, menus, and smart-code filters |',
    '| [Settings](/hooks/filters/settings) | Plugin configuration, admin UI, and JS variable filters |',
    '| [Auth](/hooks/filters/auth) | Registration form, login, and reserved username filters |',
    '| [Integrations](/hooks/filters/integrations) | Integration configuration, menu labels, and product option filters |',
    '| [Groups](/hooks/filters/groups) | Affiliate group data filters <span class="pro-badge">PRO</span> |',
    '| [Creatives](/hooks/filters/creatives) | Creative asset data filters <span class="pro-badge">PRO</span> |',
    '',
  ].join('\n') + '\n'
}

// ---------------------------------------------------------------------------
// REST API — metadata, helpers, and generators
// ---------------------------------------------------------------------------

// Paths for generated output
const openapiRoot  = join(repoRoot, 'public', 'openapi')
const generatedRoot = join(repoRoot, '.generated')

const REST_DESCRIPTIONS = {
  // Affiliates
  'GET /affiliates':              'List all affiliates with pagination and filters.',
  'GET /affiliates/export':       'Export affiliates as a CSV file.',
  'POST /affiliates':             'Create a new affiliate.',
  'GET /affiliates/{id}':         'Retrieve a single affiliate by ID.',
  'DELETE /affiliates/{id}':      'Permanently delete an affiliate.',
  'PATCH /affiliates/{id}':       'Update an affiliate\'s settings.',
  'PATCH /affiliates/{id}/status': 'Change an affiliate\'s status.',
  'GET /affiliates/{id}/transactions': 'List payout transactions for an affiliate.',
  'GET /affiliates/{id}/visits':  'List visits for an affiliate.',
  'GET /affiliates/{id}/referrals': 'List referrals for an affiliate.',
  'GET /affiliates/{id}/stats':   'Get summary stats for an affiliate.',
  'GET /affiliates/{id}/statistics': 'Get detailed statistics for an affiliate.',
  // Referrals
  'GET /referrals':               'List referrals with filters.',
  'GET /referrals/export':        'Export referrals as CSV.',
  'POST /referrals':              'Manually create a referral.',
  'GET /referrals/{id}':          'Retrieve a single referral.',
  'PATCH /referrals/{id}':        'Update a referral.',
  'DELETE /referrals/{id}':       'Delete a referral.',
  // Payouts
  'GET /payouts':                 'List payouts.',
  'POST /payouts/validate-payout-config': 'Validate a payout configuration before processing.',
  'POST /payouts/process-payout': 'Process a payout batch.',
  'GET /payouts/{id}':            'Retrieve a single payout.',
  'GET /payouts/{id}/referrals':  'List referrals included in a payout.',
  'GET /payouts/{id}/transactions': 'List transactions in a payout.',
  'GET /payouts/{id}/transactions-export': 'Export payout transactions as CSV.',
  'DELETE /payouts/{id}/transactions/{transaction_id}': 'Delete a payout transaction.',
  'PATCH /payouts/{id}/transactions/{transaction_id}': 'Update a payout transaction.',
  'PATCH /payouts/{id}/transactions/bulk-action': 'Bulk update payout transactions.',
  'PATCH /payouts/{id}':          'Update a payout.',
  // Visits
  'GET /visits':                  'List affiliate visits.',
  'GET /visits/export':           'Export visits as CSV.',
  // Portal
  'GET /portal/stats':            'Get the authenticated affiliate\'s summary stats.',
  'GET /portal/referrals':        'Get the authenticated affiliate\'s referrals.',
  'GET /portal/transactions':     'Get the authenticated affiliate\'s payout transactions.',
  'GET /portal/visits':           'Get the authenticated affiliate\'s visits.',
  'GET /portal/settings':         'Get the authenticated affiliate\'s portal settings.',
  'POST /portal/settings':        'Update the authenticated affiliate\'s portal settings.',
  // Reports
  'GET /reports/advanced-providers': 'List advanced report providers.',
  'GET /reports/commerce-reports/{provider}': 'Get reports for a specific commerce provider.',
  'GET /reports/dashboard-stats': 'Get dashboard KPI statistics.',
  'GET /reports/dashboard-chart-stats': 'Get time-series data for dashboard charts.',
  // Settings
  'GET /settings/email-config':   'Get email notification configuration.',
  'POST /settings/email-config':  'Update email notification configuration.',
  'GET /settings/email-config/emails': 'List all notification email templates.',
  'POST /settings/email-config/emails': 'Update all notification email templates.',
  'PATCH /settings/email-config/emails': 'Update a single notification email template.',
  'GET /settings/features':       'List all feature modules.',
  'GET /settings/features/{feature_key}': 'Get settings for a specific feature.',
  'POST /settings/features/{feature_key}': 'Update settings for a specific feature.',
  'POST /settings/addons/install': 'Install an addon.',
  'GET /settings/integrations':   'List registered integrations.',
  'GET /settings/integration/config': 'Get configuration for an integration.',
  'POST /settings/integration/config': 'Save integration configuration.',
  'POST /settings/integration/update-status': 'Enable or disable an integration.',
  'GET /settings/integration/product_cat_options': 'Get product/category options for an integration.',
  'GET /settings/pages':          'Get a list of WordPress pages for the portal page selector.',
  'POST /settings/create-page':   'Create a new WordPress page for the portal.',
  'GET /settings/referral-config': 'Get the referral program configuration.',
  'POST /settings/referral-config': 'Save the referral program configuration.',
  'GET /settings/migrations':     'List available data migrators.',
  'POST /settings/migrations/start': 'Start a data migration.',
  'GET /settings/migrations/status': 'Poll the status of a running migration.',
  'POST /settings/migrations/wipe': 'Wipe all FluentAffiliate data.',
  'GET /settings/migrations/statistics': 'Get migration statistics.',
  'GET /settings/options/affiliates': 'Get affiliate options for select inputs.',
  'GET /settings/options/users':  'Get WordPress user options for select inputs.',
  'GET /settings/registration-fields': 'Get affiliate registration field configuration.',

  // Pro: groups (under /settings prefix in routes, shown as /groups in docs)
  'GET /settings/groups':              'List all affiliate groups.',
  'POST /settings/groups':             'Create a new affiliate group.',
  'PATCH /settings/groups/{id}':       'Update an affiliate group.',
  'GET /settings/groups/{id}':         'Get a single affiliate group.',
  'GET /settings/groups/{id}/affiliates': 'List affiliates in a group.',
  'GET /settings/groups/{id}/overview': 'Get summary stats for a group.',
  'GET /settings/groups/{id}/statistics': 'Get detailed statistics for a group.',
  'DELETE /settings/groups/{id}':      'Delete an affiliate group.',

  // Pro: creatives (admin, under /settings prefix)
  'GET /settings/creatives':           'List all creative assets.',
  'GET /settings/creatives/{id}':      'Get a single creative.',
  'POST /settings/creatives':          'Create a new creative.',
  'PATCH /settings/creatives/{id}':    'Update a creative.',
  'DELETE /settings/creatives/{id}':   'Delete a creative.',
  // Pro: creatives (portal)
  'GET /portal/creatives':             'Get creative assets available to the authenticated affiliate.',

  // Pro: connected sites
  'GET /settings/connected-sites-config':           'Get the connected-sites configuration.',
  'PATCH /settings/connected-sites-config':          'Update the global connected-sites status.',
  'PATCH /settings/connected-sites-config/update':   'Update a single connected site config.',
  'POST /settings/connected-sites-config/issue':     'Validate and issue a token for a new site.',
  'POST /settings/connected-sites-config/disconnect': 'Disconnect a connected site.',

  // Pro: license
  'GET /settings/license':             'Get the current Pro license status.',
  'POST /settings/license':            'Save / activate a Pro license key.',
  'DELETE /settings/license':          'Deactivate the Pro license.',

  // Pro: additional settings
  'GET /settings/options/affiliate-groups': 'Get affiliate group options for select inputs.',
  'POST /settings/registration-fields':     'Save affiliate registration field configuration.',
  'GET /settings/managers':                 'List affiliate managers.',
  'POST /settings/managers':               'Add or update an affiliate manager.',
  'DELETE /settings/managers/{id}':        'Remove an affiliate manager.',
}

// ---------------------------------------------------------------------------
// REST API module metadata
// ---------------------------------------------------------------------------

const REST_MODULE_META = {
  affiliates: {
    title: 'Affiliates API',
    description: 'Affiliate listing, creation, updates, deletion, and per-affiliate statistics and transactions.',
    auth: 'These routes are protected by `AffiliatePolicy`. Admin users have full access; affiliate-level users require the `read_all_affiliates` capability.',
    isPro: false,
  },
  referrals: {
    title: 'Referrals API',
    description: 'Referral listing, manual creation, updates, deletion, and CSV export.',
    auth: 'Referral routes are protected by `ReferralPolicy`. Admin users have full access; affiliate-level users require `read_all_referrals`.',
    isPro: false,
  },
  payouts: {
    title: 'Payouts API',
    description: 'Payout batch management, transaction operations, payout processing, and CSV export.',
    auth: 'Payout routes are protected by `PayoutPolicy`. Admin users have full access; affiliate-level users require `read_all_payouts`.',
    isPro: false,
  },
  visits: {
    title: 'Visits API',
    description: 'Affiliate visit tracking records — listing and CSV export.',
    auth: 'Visit routes are protected by `VisitPolicy`. Admin users have full access; affiliate-level users require `read_all_visits`.',
    isPro: false,
  },
  portal: {
    title: 'Portal API',
    description: 'Affiliate portal data — stats, referrals, transactions, visits, and settings for the currently authenticated affiliate.',
    auth: 'Portal routes use `UserPolicy` and always return data scoped to the currently authenticated affiliate.',
    isPro: false,
  },
  reports: {
    title: 'Reports API',
    description: 'Dashboard statistics, chart data, advanced commerce reports, and report provider listing.',
    auth: 'Reports routes use `UserPolicy`. Dashboard stats require admin access; advanced report access depends on user capabilities.',
    isPro: false,
  },
  settings: {
    title: 'Settings API',
    description: 'Email configuration, feature settings, integrations, referral config, page management, migrations, and registration fields.',
    auth: 'All settings routes are protected by `AdminPolicy` and require WordPress administrator access.',
    isPro: false,
  },
  groups: {
    title: 'Affiliate Groups API',
    description: 'Affiliate group CRUD operations, member listing, overview stats, and group statistics.',
    auth: 'Affiliate group routes are protected by `AdminPolicy` and require WordPress administrator access.',
    isPro: true,
  },
  creatives: {
    title: 'Creatives API',
    description: 'Creative asset management (admin) and portal creative retrieval for authenticated affiliates.',
    auth: 'Admin creative routes are protected by `AdminPolicy`. The portal creatives endpoint uses `UserPolicy`.',
    isPro: true,
  },
  'connected-sites': {
    title: 'Connected Sites API',
    description: 'Connected site configuration management, token issuance, and site disconnect operations.',
    auth: 'Connected Sites routes are protected by `AdminPolicy` and require WordPress administrator access.',
    isPro: true,
  },
  license: {
    title: 'License API',
    description: 'Pro license status retrieval, activation, and deactivation.',
    auth: 'License routes are protected by `AdminPolicy` and require WordPress administrator access.',
    isPro: true,
  },
}

// ---------------------------------------------------------------------------
// REST API helpers
// ---------------------------------------------------------------------------

function humanizeSlug(value) {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\bapi\b/gi, 'API')
    .replace(/\bid\b/gi, 'ID')
    .replace(/\burl\b/gi, 'URL')
    .replace(/\bhtml\b/gi, 'HTML')
    .replace(/\bjson\b/gi, 'JSON')
    .replace(/\bcsv\b/gi, 'CSV')
    .replace(/\bcrm\b/gi, 'CRM')
    .replace(/\bwp\b/gi, 'WP')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase())
}

function kebabToCamel(value) {
  return value.replace(/-([a-z])/g, (_, char) => char.toUpperCase())
}

function normalizeRoutePathParams(path) {
  return path.replace(/\{(\w+)\}/g, '{$1}')
}

function getFullPath(route) {
  const path = route.path === '' ? '' : (route.path.startsWith('/') ? route.path : `/${route.path}`)
  return `/${route.prefix}${path}`
}

function classifyRoute(route) {
  const { prefix, controller } = route
  if (prefix === 'affiliates') return 'affiliates'
  if (prefix === 'referrals') return 'referrals'
  if (prefix === 'payouts') return 'payouts'
  if (prefix === 'visits') return 'visits'
  if (prefix === 'reports') return 'reports'
  if (prefix === 'portal') {
    if (controller === 'CreativeController') return 'creatives'
    return 'portal'
  }
  if (prefix === 'settings') {
    if (controller === 'AffiliateGroupController') return 'groups'
    if (controller === 'CreativeController') return 'creatives'
    if (controller === 'DomainController') return 'connected-sites'
    if (controller === 'LicenseController') return 'license'
    return 'settings'
  }
  return prefix
}

function renderSourceLabel(isPro) {
  return isPro ? '<span class="pro-badge">PRO</span>' : 'Core'
}

function policyAuth(policy) {
  const map = {
    AdminPolicy:     'WordPress administrator (`manage_options`)',
    AffiliatePolicy: 'Admin or affiliate with `read_all_affiliates` capability',
    ReferralPolicy:  'Admin or affiliate with `read_all_referrals` capability',
    PayoutPolicy:    'Admin or affiliate with `read_all_payouts` capability',
    VisitPolicy:     'Admin or affiliate with `read_all_visits` capability',
    UserPolicy:      'Any authenticated WordPress user',
  }
  return map[policy] ?? policy
}

// ---------------------------------------------------------------------------
// Operation slug map
// ---------------------------------------------------------------------------

const OPERATION_SLUG_MAP = [
  // affiliates
  { module: 'affiliates', method: 'GET',    path: /^\/affiliates$/, slug: 'list-affiliates' },
  { module: 'affiliates', method: 'GET',    path: /^\/affiliates\/export$/, slug: 'export-affiliates' },
  { module: 'affiliates', method: 'POST',   path: /^\/affiliates$/, slug: 'create-affiliate' },
  { module: 'affiliates', method: 'GET',    path: /^\/affiliates\/.+\/transactions$/, slug: 'list-affiliate-transactions' },
  { module: 'affiliates', method: 'GET',    path: /^\/affiliates\/.+\/visits$/, slug: 'list-affiliate-visits' },
  { module: 'affiliates', method: 'GET',    path: /^\/affiliates\/.+\/referrals$/, slug: 'list-affiliate-referrals' },
  { module: 'affiliates', method: 'GET',    path: /^\/affiliates\/.+\/stats$/, slug: 'get-affiliate-stats' },
  { module: 'affiliates', method: 'GET',    path: /^\/affiliates\/.+\/statistics$/, slug: 'get-affiliate-statistics' },
  { module: 'affiliates', method: 'GET',    path: /^\/affiliates\/.+$/, slug: 'get-affiliate' },
  { module: 'affiliates', method: 'DELETE', path: /^\/affiliates\/.+$/, slug: 'delete-affiliate' },
  { module: 'affiliates', method: 'PATCH',  path: /^\/affiliates\/.+\/status$/, slug: 'update-affiliate-status' },
  { module: 'affiliates', method: 'PATCH',  path: /^\/affiliates\/.+$/, slug: 'update-affiliate' },
  // referrals
  { module: 'referrals', method: 'GET',    path: /^\/referrals$/, slug: 'list-referrals' },
  { module: 'referrals', method: 'GET',    path: /^\/referrals\/export$/, slug: 'export-referrals' },
  { module: 'referrals', method: 'POST',   path: /^\/referrals$/, slug: 'create-referral' },
  { module: 'referrals', method: 'GET',    path: /^\/referrals\/.+$/, slug: 'get-referral' },
  { module: 'referrals', method: 'PATCH',  path: /^\/referrals\/.+$/, slug: 'update-referral' },
  { module: 'referrals', method: 'DELETE', path: /^\/referrals\/.+$/, slug: 'delete-referral' },
  // payouts
  { module: 'payouts', method: 'GET',    path: /^\/payouts$/, slug: 'list-payouts' },
  { module: 'payouts', method: 'POST',   path: /^\/payouts\/validate-payout-config$/, slug: 'validate-payout-config' },
  { module: 'payouts', method: 'POST',   path: /^\/payouts\/process-payout$/, slug: 'process-payout' },
  { module: 'payouts', method: 'GET',    path: /^\/payouts\/.+\/referrals$/, slug: 'list-payout-referrals' },
  { module: 'payouts', method: 'GET',    path: /^\/payouts\/.+\/transactions-export$/, slug: 'export-payout-transactions' },
  { module: 'payouts', method: 'GET',    path: /^\/payouts\/.+\/transactions$/, slug: 'list-payout-transactions' },
  { module: 'payouts', method: 'DELETE', path: /^\/payouts\/.+\/transactions\/.+$/, slug: 'delete-payout-transaction' },
  { module: 'payouts', method: 'PATCH',  path: /^\/payouts\/.+\/transactions\/bulk-action$/, slug: 'bulk-update-payout-transactions' },
  { module: 'payouts', method: 'PATCH',  path: /^\/payouts\/.+\/transactions\/.+$/, slug: 'update-payout-transaction' },
  { module: 'payouts', method: 'GET',    path: /^\/payouts\/.+$/, slug: 'get-payout' },
  { module: 'payouts', method: 'PATCH',  path: /^\/payouts\/.+$/, slug: 'update-payout' },
  // visits
  { module: 'visits', method: 'GET', path: /^\/visits$/, slug: 'list-visits' },
  { module: 'visits', method: 'GET', path: /^\/visits\/export$/, slug: 'export-visits' },
  // portal
  { module: 'portal', method: 'GET',  path: /^\/portal\/stats$/, slug: 'get-portal-stats' },
  { module: 'portal', method: 'GET',  path: /^\/portal\/referrals$/, slug: 'list-portal-referrals' },
  { module: 'portal', method: 'GET',  path: /^\/portal\/transactions$/, slug: 'list-portal-transactions' },
  { module: 'portal', method: 'GET',  path: /^\/portal\/visits$/, slug: 'list-portal-visits' },
  { module: 'portal', method: 'GET',  path: /^\/portal\/settings$/, slug: 'get-portal-settings' },
  { module: 'portal', method: 'POST', path: /^\/portal\/settings$/, slug: 'update-portal-settings' },
  // reports
  { module: 'reports', method: 'GET', path: /^\/reports\/advanced-providers$/, slug: 'list-advanced-providers' },
  { module: 'reports', method: 'GET', path: /^\/reports\/commerce-reports\/.+$/, slug: 'get-commerce-report' },
  { module: 'reports', method: 'GET', path: /^\/reports\/dashboard-stats$/, slug: 'get-dashboard-stats' },
  { module: 'reports', method: 'GET', path: /^\/reports\/dashboard-chart-stats$/, slug: 'get-dashboard-chart-stats' },
  // settings
  { module: 'settings', method: 'GET',   path: /^\/settings\/email-config\/emails$/, slug: 'list-email-templates' },
  { module: 'settings', method: 'POST',  path: /^\/settings\/email-config\/emails$/, slug: 'update-email-templates' },
  { module: 'settings', method: 'PATCH', path: /^\/settings\/email-config\/emails$/, slug: 'update-email-template' },
  { module: 'settings', method: 'GET',   path: /^\/settings\/email-config$/, slug: 'get-email-config' },
  { module: 'settings', method: 'POST',  path: /^\/settings\/email-config$/, slug: 'update-email-config' },
  { module: 'settings', method: 'GET',   path: /^\/settings\/features\/.+$/, slug: 'get-feature-settings' },
  { module: 'settings', method: 'POST',  path: /^\/settings\/features\/.+$/, slug: 'update-feature-settings' },
  { module: 'settings', method: 'GET',   path: /^\/settings\/features$/, slug: 'list-features' },
  { module: 'settings', method: 'POST',  path: /^\/settings\/addons\/install$/, slug: 'install-addon' },
  { module: 'settings', method: 'GET',   path: /^\/settings\/integrations$/, slug: 'list-integrations' },
  { module: 'settings', method: 'GET',   path: /^\/settings\/integration\/config$/, slug: 'get-integration-config' },
  { module: 'settings', method: 'POST',  path: /^\/settings\/integration\/config$/, slug: 'save-integration-config' },
  { module: 'settings', method: 'POST',  path: /^\/settings\/integration\/update-status$/, slug: 'update-integration-status' },
  { module: 'settings', method: 'GET',   path: /^\/settings\/integration\/product_cat_options$/, slug: 'get-integration-product-options' },
  { module: 'settings', method: 'GET',   path: /^\/settings\/pages$/, slug: 'list-pages' },
  { module: 'settings', method: 'POST',  path: /^\/settings\/create-page$/, slug: 'create-page' },
  { module: 'settings', method: 'GET',   path: /^\/settings\/referral-config$/, slug: 'get-referral-config' },
  { module: 'settings', method: 'POST',  path: /^\/settings\/referral-config$/, slug: 'update-referral-config' },
  { module: 'settings', method: 'GET',   path: /^\/settings\/migrations\/status$/, slug: 'get-migration-status' },
  { module: 'settings', method: 'GET',   path: /^\/settings\/migrations\/statistics$/, slug: 'get-migration-statistics' },
  { module: 'settings', method: 'GET',   path: /^\/settings\/migrations$/, slug: 'list-migrations' },
  { module: 'settings', method: 'POST',  path: /^\/settings\/migrations\/start$/, slug: 'start-migration' },
  { module: 'settings', method: 'POST',  path: /^\/settings\/migrations\/wipe$/, slug: 'wipe-data' },
  { module: 'settings', method: 'GET',   path: /^\/settings\/options\/affiliate-groups$/, slug: 'get-affiliate-group-options' },
  { module: 'settings', method: 'GET',   path: /^\/settings\/options\/affiliates$/, slug: 'get-affiliate-options' },
  { module: 'settings', method: 'GET',   path: /^\/settings\/options\/users$/, slug: 'get-user-options' },
  { module: 'settings', method: 'GET',   path: /^\/settings\/registration-fields$/, slug: 'get-registration-fields' },
  { module: 'settings', method: 'POST',  path: /^\/settings\/registration-fields$/, slug: 'update-registration-fields' },
  { module: 'settings', method: 'GET',   path: /^\/settings\/managers$/, slug: 'list-managers' },
  { module: 'settings', method: 'POST',  path: /^\/settings\/managers$/, slug: 'update-managers' },
  { module: 'settings', method: 'DELETE', path: /^\/settings\/managers\/.+$/, slug: 'delete-manager' },
  // groups (Pro)
  { module: 'groups', method: 'GET',    path: /^\/settings\/groups$/, slug: 'list-groups' },
  { module: 'groups', method: 'POST',   path: /^\/settings\/groups$/, slug: 'create-group' },
  { module: 'groups', method: 'GET',    path: /^\/settings\/groups\/.+\/affiliates$/, slug: 'list-group-affiliates' },
  { module: 'groups', method: 'GET',    path: /^\/settings\/groups\/.+\/overview$/, slug: 'get-group-overview' },
  { module: 'groups', method: 'GET',    path: /^\/settings\/groups\/.+\/statistics$/, slug: 'get-group-statistics' },
  { module: 'groups', method: 'GET',    path: /^\/settings\/groups\/.+$/, slug: 'get-group' },
  { module: 'groups', method: 'PATCH',  path: /^\/settings\/groups\/.+$/, slug: 'update-group' },
  { module: 'groups', method: 'DELETE', path: /^\/settings\/groups\/.+$/, slug: 'delete-group' },
  // creatives (Pro)
  { module: 'creatives', method: 'GET',    path: /^\/settings\/creatives$/, slug: 'list-creatives' },
  { module: 'creatives', method: 'POST',   path: /^\/settings\/creatives$/, slug: 'create-creative' },
  { module: 'creatives', method: 'GET',    path: /^\/settings\/creatives\/.+$/, slug: 'get-creative' },
  { module: 'creatives', method: 'PATCH',  path: /^\/settings\/creatives\/.+$/, slug: 'update-creative' },
  { module: 'creatives', method: 'DELETE', path: /^\/settings\/creatives\/.+$/, slug: 'delete-creative' },
  { module: 'creatives', method: 'GET',    path: /^\/portal\/creatives$/, slug: 'list-portal-creatives' },
  // connected-sites (Pro)
  { module: 'connected-sites', method: 'GET',   path: /^\/settings\/connected-sites-config$/, slug: 'get-connected-sites-config' },
  { module: 'connected-sites', method: 'PATCH', path: /^\/settings\/connected-sites-config\/update$/, slug: 'update-connected-site' },
  { module: 'connected-sites', method: 'PATCH', path: /^\/settings\/connected-sites-config$/, slug: 'update-connected-sites-status' },
  { module: 'connected-sites', method: 'POST',  path: /^\/settings\/connected-sites-config\/issue$/, slug: 'issue-site-token' },
  { module: 'connected-sites', method: 'POST',  path: /^\/settings\/connected-sites-config\/disconnect$/, slug: 'disconnect-site' },
  // license (Pro)
  { module: 'license', method: 'GET',    path: /^\/settings\/license$/, slug: 'get-license' },
  { module: 'license', method: 'POST',   path: /^\/settings\/license$/, slug: 'save-license' },
  { module: 'license', method: 'DELETE', path: /^\/settings\/license$/, slug: 'delete-license' },
]

function buildOperationAlias(module, method, fullPath) {
  const found = OPERATION_SLUG_MAP.find(
    (entry) => entry.module === module && entry.method === method && entry.path.test(fullPath),
  )
  if (found) return found.slug
  return `${method.toLowerCase()}${fullPath.replace(/\//g, '-').replace(/[{}]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')}`
}

function buildOperationMeta(route) {
  const fullPath = getFullPath(route)
  const slug = buildOperationAlias(route.module, route.method, fullPath)
  const title = humanizeSlug(slug)
  const operationId = kebabToCamel(slug)
  const description = REST_DESCRIPTIONS[`${route.method} ${fullPath}`]
    ?? `${title}.`
  return { slug, title, operationId, description }
}

// ---------------------------------------------------------------------------
// OpenAPI parameter helpers
// ---------------------------------------------------------------------------

function extractPathParams(routePath) {
  const params = []
  for (const m of routePath.matchAll(/\{(\w+)\}/g)) {
    const name = m[1]
    params.push({
      name,
      in: 'path',
      required: true,
      description: `The ${name.replace(/_/g, ' ')}.`,
      schema: { type: 'integer' },
    })
  }
  return params
}

function getDefaultQueryParams(slug) {
  if (!slug.startsWith('list-') && !slug.startsWith('export-')) return []
  return [
    { name: 'per_page', in: 'query', required: false, description: 'Number of items per page.', schema: { type: 'integer', default: 15 } },
    { name: 'page', in: 'query', required: false, description: 'Page number (1-based).', schema: { type: 'integer', default: 1 } },
    { name: 'search', in: 'query', required: false, description: 'Search query string.', schema: { type: 'string' } },
    { name: 'status', in: 'query', required: false, description: 'Filter by status.', schema: { type: 'string' } },
  ]
}

// ---------------------------------------------------------------------------
// Markdown generators — REST API
// ---------------------------------------------------------------------------

function buildRestApiModuleDoc(module, moduleRoutes) {
  const meta = REST_MODULE_META[module]
  if (!meta) return null

  if (!moduleRoutes.length) {
    return [
      '---',
      `title: ${meta.title}`,
      `description: ${meta.description}`,
      '---',
      '',
      `# ${meta.title}${meta.isPro ? ' <span class="pro-badge">PRO</span>' : ''}`,
      '',
      meta.description,
      '',
      '## Status',
      '',
      'No REST routes are currently registered for this module in the route files scanned by the generator.',
      '',
    ].join('\n') + '\n'
  }

  const lines = [
    '---',
    `title: ${meta.title}`,
    `description: ${meta.description}`,
    '---',
    '',
    `# ${meta.title}${meta.isPro ? ' <span class="pro-badge">PRO</span>' : ''}`,
    '',
    meta.description,
    '',
    '## Authentication',
    '',
    meta.auth,
    '',
    '## Endpoints',
    '',
    '| Method | Path | Edition | Operation | Controller |',
    '| --- | --- | --- | --- | --- |',
  ]

  for (const route of moduleRoutes) {
    const fullPath = getFullPath(route)
    const edition = renderSourceLabel(route.isPro)
    lines.push(
      `| \`${route.method}\` | \`${fullPath}\` | ${edition} | [${route.title}](/restapi/operations/${module}/${route.slug}) | \`${route.controller}@${route.action}\` |`,
    )
  }

  lines.push('')
  return lines.join('\n') + '\n'
}

function buildOperationDoc(route) {
  const fullPath = getFullPath(route)
  const edition = renderSourceLabel(route.isPro)
  const routeSourceFile = route.isPro
    ? 'fluent-affiliate-pro/app/Http/Routes/api.php'
    : 'app/Http/Routes/api.php'

  return [
    '---',
    `title: ${route.title}`,
    `description: "${route.description.replace(/"/g, '\\"')}"`,
    'outline: false',
    'aside: false',
    '---',
    '## Endpoint',
    '',
    `- **Method:** \`${route.method}\``,
    `- **Path:** \`${fullPath}\``,
    `- **Edition:** ${edition}`,
    `- **Controller:** \`${route.controller}@${route.action}\``,
    `- **Route source:** \`${routeSourceFile}\``,
    '',
    `<OAOperation operationId="${route.operationId}" specUrl="/openapi/public/${route.module}/${route.slug}.json" />`,
    '',
  ].join('\n')
}

// ---------------------------------------------------------------------------
// Response schemas — keyed by operation slug
// ---------------------------------------------------------------------------

const affiliateObject = {
  type: 'object',
  properties: {
    id:               { type: 'integer' },
    user_id:          { type: 'integer' },
    status:           { type: 'string', enum: ['active', 'pending', 'rejected', 'inactive'] },
    affiliate_code:   { type: 'string' },
    rate:             { type: 'string' },
    rate_type:        { type: 'string', enum: ['percentage', 'flat'] },
    earnings_balance: { type: 'string' },
    total_paid:       { type: 'string' },
    total_unpaid:     { type: 'string' },
    created_at:       { type: 'string', format: 'date-time' },
    updated_at:       { type: 'string', format: 'date-time' },
  },
}

const affiliateDetailObject = {
  type: 'object',
  properties: {
    ...affiliateObject.properties,
    bank_details:      { type: 'object' },
    rate_details:      { type: 'array', items: { type: 'object' } },
    widgets:           { type: 'array', items: { type: 'object' } },
    attached_coupons:  { type: 'array', items: { type: 'object' } },
    share_url:         { type: 'string' },
  },
}

function paginatedSchema(itemSchema) {
  return {
    type: 'object',
    properties: {
      data:         { type: 'array', items: itemSchema },
      total:        { type: 'integer' },
      per_page:     { type: 'integer' },
      current_page: { type: 'integer' },
    },
  }
}

const referralObject = {
  type: 'object',
  properties: {
    id:           { type: 'integer' },
    affiliate_id: { type: 'integer' },
    visit_id:     { type: 'integer', nullable: true },
    order_id:     { type: 'string' },
    status:       { type: 'string', enum: ['pending', 'approved', 'rejected', 'paid'] },
    amount:       { type: 'string' },
    currency:     { type: 'string' },
    provider:     { type: 'string' },
    provider_url: { type: 'string' },
    created_at:   { type: 'string', format: 'date-time' },
    updated_at:   { type: 'string', format: 'date-time' },
  },
}

const transactionObject = {
  type: 'object',
  properties: {
    id:               { type: 'integer' },
    payout_id:        { type: 'integer' },
    affiliate_id:     { type: 'integer' },
    status:           { type: 'string', enum: ['pending', 'paid', 'failed'] },
    amount:           { type: 'string' },
    currency:         { type: 'string' },
    currency_symbol:  { type: 'string' },
    referrals_count:  { type: 'integer' },
    created_at:       { type: 'string', format: 'date-time' },
    updated_at:       { type: 'string', format: 'date-time' },
  },
}

const visitObject = {
  type: 'object',
  properties: {
    id:           { type: 'integer' },
    affiliate_id: { type: 'integer' },
    url:          { type: 'string' },
    ip:           { type: 'string' },
    created_at:   { type: 'string', format: 'date-time' },
    referrals:    { type: 'array', items: { type: 'object', properties: { id: { type: 'integer' }, visit_id: { type: 'integer' }, status: { type: 'string' }, amount: { type: 'string' }, currency: { type: 'string' } } } },
  },
}

const payoutObject = {
  type: 'object',
  properties: {
    id:                  { type: 'integer' },
    status:              { type: 'string', enum: ['pending', 'paid', 'failed'] },
    amount:              { type: 'string' },
    currency:            { type: 'string' },
    referrals_count:     { type: 'integer' },
    transactions_count:  { type: 'integer' },
    affiliates_count:    { type: 'integer' },
    created_at:          { type: 'string', format: 'date-time' },
    updated_at:          { type: 'string', format: 'date-time' },
  },
}

const groupObject = {
  type: 'object',
  properties: {
    id:               { type: 'integer' },
    name:             { type: 'string' },
    description:      { type: 'string' },
    status:           { type: 'string' },
    affiliates_count: { type: 'integer' },
    visits_count:     { type: 'integer' },
    total_earnings:   { type: 'string' },
    created_at:       { type: 'string', format: 'date-time' },
    updated_at:       { type: 'string', format: 'date-time' },
  },
}

const creativeObject = {
  type: 'object',
  properties: {
    id:          { type: 'integer' },
    title:       { type: 'string' },
    type:        { type: 'string', enum: ['banner', 'text', 'html'] },
    content:     { type: 'string' },
    status:      { type: 'string', enum: ['active', 'inactive'] },
    created_at:  { type: 'string', format: 'date-time' },
    updated_at:  { type: 'string', format: 'date-time' },
  },
}

const messageOnlySchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
  },
  required: ['message'],
}

const RESPONSE_SCHEMAS = {
  // ── Affiliates ──────────────────────────────────────────────────────────
  'list-affiliates': {
    type: 'object',
    properties: {
      affiliates: paginatedSchema(affiliateObject),
    },
  },
  'create-affiliate': {
    type: 'object',
    properties: {
      message:   { type: 'string' },
      affiliate: affiliateObject,
    },
    required: ['message', 'affiliate'],
  },
  'get-affiliate': {
    type: 'object',
    properties: {
      affiliate: affiliateDetailObject,
    },
  },
  'update-affiliate': {
    type: 'object',
    properties: {
      message:   { type: 'string' },
      affiliate: affiliateObject,
    },
    required: ['message', 'affiliate'],
  },
  'update-affiliate-status': {
    type: 'object',
    properties: {
      message:   { type: 'string' },
      affiliate: affiliateObject,
    },
    required: ['message', 'affiliate'],
  },
  'delete-affiliate': messageOnlySchema,
  'export-affiliates': {
    type: 'object',
    properties: {
      affiliates: { type: 'array', items: affiliateObject },
      limited:    { type: 'boolean' },
      total:      { type: 'integer' },
    },
  },
  'list-affiliate-referrals': {
    type: 'object',
    properties: {
      referrals: paginatedSchema(referralObject),
    },
  },
  'list-affiliate-visits': {
    type: 'object',
    properties: {
      visits: paginatedSchema(visitObject),
    },
  },
  'list-affiliate-transactions': {
    type: 'object',
    properties: {
      transactions: paginatedSchema(transactionObject),
    },
  },
  'get-affiliate-stats': {
    type: 'object',
    properties: {
      stats: {
        type: 'object',
        properties: {
          total_paid:       { type: 'object', properties: { title: { type: 'string' }, amount: { type: 'string' }, is_currency: { type: 'boolean' } } },
          total_unpaid:     { type: 'object', properties: { title: { type: 'string' }, amount: { type: 'string' }, is_currency: { type: 'boolean' } } },
          total_order_value:{ type: 'object', properties: { title: { type: 'string' }, amount: { type: 'string' }, is_currency: { type: 'boolean' } } },
          conversion_rate:  { type: 'object', properties: { title: { type: 'string' }, amount: { type: 'string' }, is_number: { type: 'boolean' } } },
          total_visits:     { type: 'object', properties: { title: { type: 'string' }, amount: { type: 'integer' }, is_number: { type: 'boolean' } } },
          total_referrals:  { type: 'object', properties: { title: { type: 'string' }, amount: { type: 'integer' }, is_number: { type: 'boolean' } } },
        },
      },
    },
  },
  'get-affiliate-statistics': {
    type: 'object',
    properties: {
      data:   { type: 'array', items: { type: 'object' } },
      labels: { type: 'array', items: { type: 'string' } },
    },
  },
  // ── Referrals ────────────────────────────────────────────────────────────
  'list-referrals': {
    type: 'object',
    properties: {
      referrals: paginatedSchema(referralObject),
    },
  },
  'create-referral': {
    type: 'object',
    properties: {
      referral: referralObject,
      message:  { type: 'string' },
    },
    required: ['referral', 'message'],
  },
  'get-referral': {
    type: 'object',
    properties: {
      referral: {
        type: 'object',
        properties: {
          ...referralObject.properties,
          visit:    { type: 'object', nullable: true },
          payout:   { type: 'object', nullable: true },
          customer: { type: 'object', nullable: true },
        },
      },
    },
  },
  'update-referral': {
    type: 'object',
    properties: {
      referral: referralObject,
      message:  { type: 'string' },
    },
    required: ['referral', 'message'],
  },
  'delete-referral': messageOnlySchema,
  'export-referrals': {
    type: 'object',
    properties: {
      referrals: { type: 'array', items: referralObject },
      limited:   { type: 'boolean' },
      total:     { type: 'integer' },
    },
  },
  // ── Payouts ──────────────────────────────────────────────────────────────
  'list-payouts': {
    type: 'object',
    properties: {
      payouts: paginatedSchema(payoutObject),
    },
  },
  'get-payout': {
    type: 'object',
    properties: {
      payout: {
        type: 'object',
        properties: {
          ...payoutObject.properties,
          creator: { type: 'object', nullable: true },
        },
      },
    },
  },
  'update-payout': {
    type: 'object',
    properties: {
      payout:  payoutObject,
      message: { type: 'string' },
    },
    required: ['payout', 'message'],
  },
  'validate-payout-config': {
    type: 'object',
    properties: {
      payable_affiliates:    { type: 'array', items: affiliateObject },
      payable_total_amount:  { type: 'number' },
      config: {
        type: 'object',
        properties: {
          start_date:    { type: 'string', format: 'date' },
          end_date:      { type: 'string', format: 'date' },
          min_payout:    { type: 'number' },
          affiliate_ids: { type: 'array', items: { type: 'integer' } },
        },
      },
    },
  },
  'process-payout': {
    type: 'object',
    properties: {
      payout:  payoutObject,
      message: { type: 'string' },
    },
    required: ['payout', 'message'],
  },
  'list-payout-transactions': {
    type: 'object',
    properties: {
      transactions:      paginatedSchema(transactionObject),
      processing_count:  { type: 'integer' },
    },
  },
  'update-payout-transaction': {
    type: 'object',
    properties: {
      transaction:      transactionObject,
      processing_count: { type: 'integer' },
      message:          { type: 'string' },
    },
    required: ['transaction', 'processing_count', 'message'],
  },
  'bulk-update-payout-transactions': {
    type: 'object',
    properties: {
      processing_count: { type: 'integer' },
      message:          { type: 'string' },
    },
  },
  'delete-payout-transaction': {
    type: 'object',
    properties: {
      payout:  payoutObject,
      message: { type: 'string' },
    },
    required: ['payout', 'message'],
  },
  'list-payout-referrals': {
    type: 'object',
    properties: {
      referrals:      paginatedSchema(referralObject),
      affiliate_lists: { type: 'array', items: affiliateObject, nullable: true },
    },
  },
  'export-payout-transactions': {
    type: 'object',
    properties: {
      transactions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            affiliate_id:   { type: 'integer' },
            affiliate_name: { type: 'string' },
            email:          { type: 'string' },
            payout_email:   { type: 'string' },
            amount:         { type: 'number' },
            currency:       { type: 'string' },
          },
        },
      },
    },
  },
  // ── Visits ───────────────────────────────────────────────────────────────
  'list-visits': {
    type: 'object',
    properties: {
      visits: paginatedSchema(visitObject),
    },
  },
  'export-visits': {
    type: 'object',
    properties: {
      visits:  { type: 'array', items: visitObject },
      limited: { type: 'boolean' },
      total:   { type: 'integer' },
    },
  },
  // ── Portal ───────────────────────────────────────────────────────────────
  'get-portal-stats': {
    type: 'object',
    properties: {
      stats: {
        type: 'object',
        properties: {
          total_paid:       { type: 'string' },
          total_unpaid:     { type: 'string' },
          total_referrals:  { type: 'integer' },
          conversion_rate:  { type: 'string' },
        },
      },
      recent_referrals:  { type: 'array', items: referralObject },
      portal_notice_html: { type: 'string' },
    },
  },
  'list-portal-referrals': {
    type: 'object',
    properties: {
      referrals: paginatedSchema(referralObject),
    },
  },
  'list-portal-transactions': {
    type: 'object',
    properties: {
      transactions: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                human_date:  { type: 'string' },
                amount:      { type: 'number' },
                status:      { type: 'string' },
                description: { type: 'string' },
              },
            },
          },
          total:        { type: 'integer' },
          per_page:     { type: 'integer' },
          current_page: { type: 'integer' },
        },
      },
    },
  },
  'list-portal-visits': {
    type: 'object',
    properties: {
      visits: paginatedSchema({
        type: 'object',
        properties: {
          ...visitObject.properties,
          human_date:            { type: 'string' },
          total_referral_amount: { type: 'number' },
          is_converted:          { type: 'boolean' },
        },
      }),
    },
  },
  'get-portal-settings': {
    type: 'object',
    properties: {
      settings: {
        type: 'object',
        properties: {
          ref_email_notification: { type: 'string', enum: ['yes', 'no'] },
          payment_email:          { type: 'string', nullable: true },
          bank_details:           { type: 'string', nullable: true },
        },
      },
      form_fields: { type: 'object' },
    },
  },
  'update-portal-settings': messageOnlySchema,
  // ── Reports ──────────────────────────────────────────────────────────────
  'get-dashboard-stats': {
    type: 'object',
    properties: {
      stats: {
        type: 'object',
        properties: {
          affiliates:         { type: 'object', properties: { title: { type: 'string' }, count: { type: 'number' }, is_money: { type: 'boolean' } } },
          pending:            { type: 'object', properties: { title: { type: 'string' }, count: { type: 'number' }, is_money: { type: 'boolean' } } },
          paid:               { type: 'object', properties: { title: { type: 'string' }, count: { type: 'number' }, is_money: { type: 'boolean' } } },
          unpaid:             { type: 'object', properties: { title: { type: 'string' }, count: { type: 'number' }, is_money: { type: 'boolean' } } },
          visits:             { type: 'object', properties: { title: { type: 'string' }, count: { type: 'number' }, is_money: { type: 'boolean' } } },
          paid_transactions:  { type: 'object', properties: { title: { type: 'string' }, count: { type: 'number' }, is_money: { type: 'boolean' } } },
          pending_payout:     { type: 'object', properties: { title: { type: 'string' }, count: { type: 'number' }, is_money: { type: 'boolean' } } },
        },
      },
      recent_referrals: { type: 'array', items: referralObject },
      top_affiliates:   { type: 'array', items: affiliateObject },
      recent_visits:    { type: 'array', items: visitObject },
      recent_payouts:   { type: 'array', items: payoutObject },
    },
  },
  'get-dashboard-chart-stats': {
    type: 'object',
    properties: {
      data:   { type: 'array', items: { type: 'object' } },
      labels: { type: 'array', items: { type: 'string' } },
    },
  },
  'list-advanced-providers': {
    type: 'object',
    properties: {
      providers: {
        type: 'object',
        properties: {
          fla: { type: 'object', properties: { title: { type: 'string' } } },
          edd: { type: 'object', properties: { title: { type: 'string' } } },
          woo: { type: 'object', properties: { title: { type: 'string' } } },
        },
      },
    },
  },
  'get-commerce-report': {
    type: 'object',
    properties: {
      report: {
        type: 'object',
        properties: {
          enabled: { type: 'boolean' },
          title:   { type: 'string' },
          widgets: { type: 'array', items: { type: 'object', properties: { label: { type: 'string' }, value: {}, is_money: { type: 'boolean' } } } },
        },
      },
    },
  },
  // ── Settings ─────────────────────────────────────────────────────────────
  'get-email-config': {
    type: 'object',
    properties: {
      settings: { type: 'object' },
    },
  },
  'update-email-config': {
    type: 'object',
    properties: {
      settings: { type: 'object' },
      message:  { type: 'string' },
    },
    required: ['settings', 'message'],
  },
  'list-email-templates': {
    type: 'object',
    properties: {
      emails: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            email_key:    { type: 'string' },
            default_body: { type: 'string' },
            settings:     { type: 'object' },
          },
        },
      },
      smartcodes: { type: 'array', items: { type: 'object' } },
    },
  },
  'update-email-template': {
    type: 'object',
    properties: {
      message:      { type: 'string' },
      settings:     { type: 'object' },
      all_settings: { type: 'object' },
    },
    required: ['message'],
  },
  'get-referral-config': {
    type: 'object',
    properties: {
      config: { type: 'object' },
    },
  },
  'update-referral-config': {
    type: 'object',
    properties: {
      config:  { type: 'object' },
      message: { type: 'string' },
    },
    required: ['config', 'message'],
  },
  'list-pages': {
    type: 'object',
    properties: {
      pages: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id:    { type: 'integer' },
            link:  { type: 'string' },
            title: { type: 'string' },
          },
        },
      },
    },
  },
  'create-page': {
    type: 'object',
    properties: {
      page: {
        type: 'object',
        properties: {
          id:    { type: 'integer' },
          link:  { type: 'string' },
          title: { type: 'string' },
        },
      },
      message: { type: 'string' },
    },
    required: ['page', 'message'],
  },
  'get-affiliate-options': {
    type: 'object',
    properties: {
      affiliates: { type: 'array', items: affiliateObject },
    },
  },
  'get-user-options': {
    type: 'object',
    properties: {
      users: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            ID:           { type: 'integer' },
            display_name: { type: 'string' },
          },
        },
      },
    },
  },
  'get-registration-fields': {
    type: 'object',
    properties: {
      fields:   { type: 'array', items: { type: 'object' } },
      settings: { type: 'object' },
    },
  },
  'list-features': {
    type: 'object',
    properties: {
      features: { type: 'object' },
      addons:   { type: 'array', items: { type: 'object' } },
    },
  },
  'install-addon': {
    type: 'object',
    properties: {
      results: { type: 'object' },
      message: { type: 'string' },
    },
  },
  'get-feature-settings': {
    type: 'object',
    properties: {
      is_enabled:  { type: 'string', enum: ['yes', 'no'] },
      feature_key: { type: 'string' },
    },
  },
  'update-feature-settings': messageOnlySchema,
  'update-registration-fields': {
    type: 'object',
    properties: {
      message:  { type: 'string' },
      fields:   { type: 'array', items: { type: 'object' } },
      settings: { type: 'object' },
    },
    required: ['message'],
  },
  'list-managers': {
    type: 'object',
    properties: {
      managers: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id:          { type: 'integer' },
            name:        { type: 'string' },
            email:       { type: 'string' },
            avatar:      { type: 'string' },
            permissions: { type: 'object' },
            is_admin:    { type: 'boolean' },
          },
        },
      },
      permissions: { type: 'array', items: { type: 'object' } },
    },
  },
  'update-managers': messageOnlySchema,
  'delete-manager':  messageOnlySchema,
  // ── Groups (Pro) ─────────────────────────────────────────────────────────
  'list-groups': {
    type: 'object',
    properties: {
      groups: paginatedSchema(groupObject),
    },
  },
  'create-group': {
    type: 'object',
    properties: {
      message: { type: 'string' },
      data:    groupObject,
    },
    required: ['message', 'data'],
  },
  'get-group': {
    type: 'object',
    properties: {
      group: groupObject,
    },
  },
  'update-group': {
    type: 'object',
    properties: {
      data:    groupObject,
      message: { type: 'string' },
    },
    required: ['data', 'message'],
  },
  'delete-group': {
    type: 'object',
    properties: {
      message: { type: 'string' },
      data:    groupObject,
    },
    required: ['message'],
  },
  'list-group-affiliates': {
    type: 'object',
    properties: {
      affiliates: paginatedSchema(affiliateObject),
    },
  },
  'get-group-overview': {
    type: 'object',
    properties: {
      widgets: {
        type: 'object',
        properties: {
          unpaid_amount:   { type: 'number' },
          paid_amount:     { type: 'number' },
          total_affiliate: { type: 'integer' },
          total_earnings:  { type: 'number' },
        },
      },
    },
  },
  'get-group-statistics': {
    type: 'object',
    properties: {
      data:   { type: 'array', items: { type: 'object' } },
      labels: { type: 'array', items: { type: 'string' } },
    },
  },
  // ── Creatives (Pro) ──────────────────────────────────────────────────────
  'list-creatives': {
    type: 'object',
    properties: {
      creatives: paginatedSchema(creativeObject),
    },
  },
  'create-creative': {
    type: 'object',
    properties: {
      creative: creativeObject,
      message:  { type: 'string' },
    },
    required: ['creative', 'message'],
  },
  'get-creative': {
    type: 'object',
    properties: {
      creative: creativeObject,
    },
  },
  'update-creative': {
    type: 'object',
    properties: {
      creative: creativeObject,
      message:  { type: 'string' },
    },
    required: ['creative', 'message'],
  },
  'delete-creative': messageOnlySchema,
  'list-portal-creatives': {
    type: 'object',
    properties: {
      creatives: paginatedSchema(creativeObject),
    },
  },
  // ── Connected Sites (Pro) ────────────────────────────────────────────────
  'get-connected-sites-config': {
    type: 'object',
    properties: {
      config: { type: 'object' },
    },
  },
  'update-connected-sites-status': messageOnlySchema,
  'update-connected-site': messageOnlySchema,
  'issue-site-token': {
    type: 'object',
    properties: {
      message:        { type: 'string' },
      new_site: {
        type: 'object',
        properties: {
          status:       { type: 'string' },
          site_url:     { type: 'string' },
          site_title:   { type: 'string' },
          server_token: { type: 'string' },
          logo:         { type: 'string' },
          description:  { type: 'string' },
          subtitle:     { type: 'string' },
          site_id:      { type: 'integer' },
        },
      },
      connect_config: { type: 'string', description: 'JSON-encoded connection config string.' },
    },
    required: ['message', 'new_site'],
  },
  'disconnect-site': messageOnlySchema,
  // ── License (Pro) ────────────────────────────────────────────────────────
  'get-license': {
    type: 'object',
    properties: {
      license_status:  { type: 'string' },
      license_expires: { type: 'string', nullable: true },
    },
  },
  'save-license': {
    type: 'object',
    properties: {
      license_data: { type: 'object' },
      message:      { type: 'string' },
    },
    required: ['license_data', 'message'],
  },
  'delete-license': {
    type: 'object',
    properties: {
      license_data: { type: 'object' },
      message:      { type: 'string' },
    },
    required: ['license_data', 'message'],
  },
  // ── Settings — integrations ──────────────────────────────────────────────
  'list-integrations': {
    type: 'object',
    properties: {
      integrations: { type: 'array', items: { type: 'object', properties: { key: { type: 'string' }, title: { type: 'string' }, is_active: { type: 'boolean' } } } },
    },
  },
  'get-integration-config': {
    type: 'object',
    properties: {
      config: { type: 'object' },
    },
  },
  'save-integration-config': messageOnlySchema,
  'update-integration-status': messageOnlySchema,
  'get-integration-product-options': {
    type: 'object',
    properties: {
      options: { type: 'array', items: { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' } } } },
    },
  },
  'get-affiliate-group-options': {
    type: 'object',
    properties: {
      affiliate_groups: {
        type: 'array',
        items: { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' } } },
      },
    },
  },
  'update-email-templates': messageOnlySchema,
  'get-migration-status':     { type: 'object', properties: { status: { type: 'object' } } },
  'get-migration-statistics': { type: 'object', properties: { statistics: { type: 'object' } } },
  'list-migrations':          { type: 'object', properties: { migrations: { type: 'array', items: { type: 'object' } } } },
  'start-migration':          messageOnlySchema,
  'wipe-data':                messageOnlySchema,
}

// ---------------------------------------------------------------------------

function buildOpenApiSpec(route) {
  const fullPath = getFullPath(route)
  const meta = REST_MODULE_META[route.module]
  const pathParams = extractPathParams(fullPath)
  const queryParams = getDefaultQueryParams(route.slug)
  const parameters = [...pathParams, ...queryParams]

  const isWriteMethod = ['POST', 'PUT', 'PATCH'].includes(route.method)
  const requestBody = isWriteMethod
    ? {
        required: false,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              description: 'Request body parameters.',
            },
          },
        },
      }
    : undefined

  const spec = {
    openapi: '3.0.4',
    info: {
      title: 'FluentAffiliate API',
      description: 'REST API documentation for FluentAffiliate — a WordPress affiliate program management plugin.',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'https://{website}/wp-json/fluent-affiliate/v2',
        description: 'Your WordPress website',
        variables: {
          website: {
            default: 'YourWebsite.com',
            description: 'Your WordPress website domain (without https://)',
          },
        },
      },
    ],
    security: [{ ApplicationPasswords: [] }],
    paths: {
      [normalizeRoutePathParams(fullPath)]: {
        [route.method.toLowerCase()]: {
          operationId: route.operationId,
          summary: `${route.method} ${route.title}`,
          description: `${route.description}\n\nController: \`${route.controller}@${route.action}\`\nRoute source: \`${route.isPro ? 'fluent-affiliate-pro/' : ''}app/Http/Routes/api.php\``,
          tags: [(meta?.title ?? route.module).replace(/ API$/, '')],
          security: [{ ApplicationPasswords: [] }],
          parameters,
          ...(requestBody ? { requestBody } : {}),
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: RESPONSE_SCHEMAS[route.slug] ?? { type: 'object' },
                },
              },
            },
            '400': {
              description: 'Bad request.',
              content: {
                'application/json': {
                  schema: { type: 'object', properties: { message: { type: 'string' } } },
                  example: { message: 'Bad request.' },
                },
              },
            },
            '401': {
              description: 'Unauthorized.',
              content: {
                'application/json': {
                  schema: { type: 'object', properties: { message: { type: 'string' } } },
                  example: { message: 'Sorry, you are not allowed to do this.' },
                },
              },
            },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        ApplicationPasswords: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'WordPress Application Passwords — use Basic auth with username:application_password.',
        },
      },
    },
  }

  return JSON.stringify(spec, null, 2) + '\n'
}

function buildRestApiIndexDoc(allRoutes) {
  const moduleGroups = {}
  for (const route of allRoutes) {
    if (!moduleGroups[route.module]) moduleGroups[route.module] = []
    moduleGroups[route.module].push(route)
  }

  const lines = [
    '---',
    'title: REST API Overview',
    'description: Source-verified overview for the FluentAffiliate REST API.',
    '---',
    '',
    '# FluentAffiliate REST API',
    '',
    `This reference covers ${allRoutes.length} routes registered in the FluentAffiliate core and Pro route files.`,
    '',
    '## Base URL',
    '',
    '`https://your-site.com/wp-json/fluent-affiliate/v2`',
    '',
    '## Authentication',
    '',
    '- **Admin and settings routes:** use WordPress Application Passwords (`username:application_password` via Basic auth) or a WordPress nonce in the `X-WP-Nonce` header.',
    '- **Portal routes:** browser clients use cookie authentication with an `X-WP-Nonce` header; server-to-server integrations can use Application Passwords.',
    '- **Method override:** the FluentAffiliate frontend sends PUT, PATCH, and DELETE requests as POST requests with an `X-HTTP-Method-Override` header.',
    '',
    '## URL Structure',
    '',
    'All routes share the single base path `/wp-json/fluent-affiliate/v2`. There is no separate Pro URL prefix — Pro modules (Groups, Creatives, Connected Sites, License) register their routes under the `/settings/` segment alongside core settings routes.',
    '',
    '| Pro module | URL prefix |',
    '| --- | --- |',
    '| Groups | `/settings/groups/…` |',
    '| Creatives | `/settings/creatives/…` |',
    '| Connected Sites | `/settings/connected-sites-config/…` |',
    '| License | `/settings/license` |',
    '',
    '## Modules',
    '',
    '| Module | Edition | Route Count | Description |',
    '| --- | --- | --- | --- |',
  ]

  for (const [module, meta] of Object.entries(REST_MODULE_META)) {
    const count = moduleGroups[module]?.length ?? 0
    const isPro = meta.isPro || (moduleGroups[module] ?? []).every(r => r.isPro)
    lines.push(
      `| [${meta.title}](/restapi/${module}) | ${renderSourceLabel(isPro)} | ${count} | ${meta.description} |`,
    )
  }

  lines.push('')
  return lines.join('\n') + '\n'
}


// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('\nParsing PHP source…')

  // ── Migrations ────────────────────────────────────────────────────────────
  const coreMigrationsDir = join(coreRoot, 'database', 'Migrations')
  const coreTables        = parseMigrationsDir(coreMigrationsDir)

  let proTables = {}
  if (hasPro) {
    const proMigrationsDir = join(proRoot, 'database', 'Migrations')
    proTables = parseMigrationsDir(proMigrationsDir)
  }
  const tables = { ...coreTables, ...proTables }

  console.log('  tables found:', Object.keys(tables).join(', '))

  // ── Hooks ─────────────────────────────────────────────────────────────────
  const sourceDirs = [join(coreRoot, 'app')]
  if (hasPro) sourceDirs.push(join(proRoot, 'app'))

  const { actions: rawActions, filters: rawFilters } = extractHooks(sourceDirs)

  // Normalise dynamic hook names where the scanner captures the wrong variable
  // e.g. 'fluent_affiliate/affiliate_status_to_{affiliate}' → '{status}' (scanner
  // sees $affiliate->status and captures 'affiliate', but the meaningful placeholder is 'status')
  const HOOK_NAME_ALIASES = {
    'fluent_affiliate/affiliate_status_to_{affiliate}': 'fluent_affiliate/affiliate_status_to_{status}',
    'fluent_affiliate/provider_reference_{this}':       'fluent_affiliate/provider_reference_{provider}_url',
    'fluent_affiliate/provider_reference_{referral}':   'fluent_affiliate/provider_reference_{provider}_url',
  }
  const normaliseHookMap = (map) => {
    const out = {}
    for (const [k, v] of Object.entries(map)) {
      const canonical = HOOK_NAME_ALIASES[k] ?? k
      if (out[canonical]) {
        // merge file lists
        out[canonical].files = [...new Set([...out[canonical].files, ...v.files])]
      } else {
        out[canonical] = v
      }
    }
    return out
  }
  const actions = normaliseHookMap(rawActions)
  const filters = normaliseHookMap(rawFilters)

  console.log('  action hooks:', Object.keys(actions).length)
  console.log('  filter hooks:', Object.keys(filters).length)

  // ── Routes ────────────────────────────────────────────────────────────────
  const apiFile = join(coreRoot, 'app', 'Http', 'Routes', 'api.php')
  const coreRoutes = parseRoutes(apiFile)

  let proRoutesRaw = []
  if (hasPro) {
    const proApiFile = join(proRoot, 'app', 'Http', 'Routes', 'api.php')
    proRoutesRaw = parseRoutes(proApiFile)
  }

  // Classify and enrich all routes
  const enrichRoutes = (rawRoutes, isPro) =>
    rawRoutes.map((r) => {
      const module = classifyRoute(r)
      const { slug, title, operationId, description } = buildOperationMeta({ ...r, module })
      return { ...r, module, slug, title, operationId, description, isPro }
    })

  const allRoutes = [
    ...enrichRoutes(coreRoutes, false),
    ...enrichRoutes(proRoutesRaw, true),
  ]

  console.log('  routes found:', allRoutes.length)

  // ── Clean output dirs ─────────────────────────────────────────────────────
  console.log('\nCleaning generated directories…')
  cleanDir(join(DOCS_DIR, 'database', 'models'))
  ensureDir(join(DOCS_DIR, 'database'))

  cleanDir(join(DOCS_DIR, 'hooks', 'actions'))
  cleanDir(join(DOCS_DIR, 'hooks', 'filters'))
  ensureDir(join(DOCS_DIR, 'hooks'))

  cleanDir(join(DOCS_DIR, 'restapi'))
  ensureDir(join(DOCS_DIR, 'restapi', 'operations'))

  // Clean and recreate openapi dir
  if (existsSync(openapiRoot)) rmSync(openapiRoot, { recursive: true, force: true })
  mkdirSync(openapiRoot, { recursive: true })

  // Ensure .generated dir exists
  ensureDir(generatedRoot)

  // ── Write database docs ───────────────────────────────────────────────────
  console.log('\nWriting database docs…')

  writeDoc(join(DOCS_DIR, 'database', 'schema.md'), buildSchemaDoc(tables))
  writeDoc(join(DOCS_DIR, 'database', 'models', 'index.md'), buildModelsIndexDoc(tables))

  const modelSlugMap = {
    fa_affiliates:          'affiliate',
    fa_referrals:           'referral',
    fa_payouts:             'payout',
    fa_payout_transactions: 'transaction',
    fa_visits:              'visit',
    fa_customers:           'customer',
    fa_meta:                'meta',
    fa_creatives:           'creative',
  }

  for (const [tableName, columns] of Object.entries(tables)) {
    const meta = MODEL_META[tableName]
    const slug = modelSlugMap[tableName]
    if (!meta || !slug) continue
    const content = buildModelDoc(tableName, columns, meta)
    if (content) writeDoc(join(DOCS_DIR, 'database', 'models', `${slug}.md`), content)
  }

  // AffiliateGroup static doc (stored in fa_meta, not a dedicated table)
  if (hasPro) {
    writeDoc(join(DOCS_DIR, 'database', 'models', 'affiliate-group.md'), [
      '---',
      'title: AffiliateGroup Model (Pro)',
      'description: The AffiliateGroup model organises affiliates into commission tiers. Stored in fa_meta.',
      '---',
      '',
      '# AffiliateGroup <span class="pro-badge">PRO</span>',
      '',
      'Affiliate groups let you assign custom commission rates to sets of affiliates. Groups are stored in the `fa_meta` table with `object_type = \'affiliate_group\'`.',
      '',
      '**Table:** `fa_meta` (polymorphic via `object_type = \'affiliate_group\'`)  ',
      '**Class:** `FluentAffiliate\\App\\Models\\AffiliateGroup`',
      '',
      '## Storage Layout',
      '',
      '| Column | Usage |',
      '|--------|-------|',
      '| `meta_key` | The group name (human-readable label). |',
      '| `value` | Serialized JSON: `{ rate_type, rate, status, notes }` |',
      '| `object_type` | Always `affiliate_group`. |',
      '| `object_id` | Always `0` (not linked to a parent object). |',
      '',
      '## Value Fields',
      '',
      '| Field | Type | Description |',
      '|-------|------|-------------|',
      '| `rate_type` | `string` | Commission type: `percentage`, `flat`, or `default` (inherit global). |',
      '| `rate` | `float` | Commission rate value. |',
      '| `status` | `string` | Group status: `active` or `inactive`. |',
      '| `notes` | `string` | Internal notes about the group. |',
      '',
      '## Relationships',
      '',
      '| Method | Type | Target | Description |',
      '|--------|------|--------|-------------|',
      '| `affiliates()` | `hasMany` | `Affiliate` | Affiliates assigned to this group via `group_id`. |',
      '',
      '## Query Scopes',
      '',
      '| Scope | Description |',
      '|-------|-------------|',
      '| `search($query)` | Full-text search on `meta_key` and `value` content. |',
      '',
      '## Usage Example',
      '',
      '```php',
      'use FluentAffiliate\\App\\Models\\AffiliateGroup;',
      '',
      '// List all active groups',
      '$groups = AffiliateGroup::all()->filter(function($g) {',
      '    return ($g->value[\'status\'] ?? \'\') === \'active\';',
      '});',
      '',
      '// Get all affiliates in a specific group',
      '$group = AffiliateGroup::find($groupId);',
      '$affiliates = $group->affiliates()->ofStatus(\'active\')->get();',
      '',
      '// Assign an affiliate to a group',
      '$affiliate->update([\'group_id\' => $group->id]);',
      '```',
      '',
      '## Commission Override Hierarchy',
      '',
      'When calculating commission for an affiliate in a group, the rate is resolved in this order:',
      '',
      '1. Affiliate\'s individual `rate` and `rate_type` (if set).',
      '2. Group\'s `rate` and `rate_type` (if `rate_type !== \'default\'`).',
      '3. Global referral program defaults.',
      '',
    ].join('\n') + '\n')
  }

  // WordPress User model stub
  writeDoc(join(DOCS_DIR, 'database', 'models', 'user.md'), [
    '---',
    'title: User Model',
    'description: WordPress User model wrapper used in FluentAffiliate.',
    '---',
    '',
    '# User',
    '',
    'FluentAffiliate wraps the WordPress `wp_users` table through a `User` model at `app/Models/User.php`.',
    '',
    '**Table:** `wp_users` (WordPress core)',
    '',
    'This model provides convenience methods for looking up users, creating affiliates from users, and managing affiliate registration.',
    '',
    '## Key Methods',
    '',
    '| Method | Description |',
    '|--------|-------------|',
    '| `createAffiliate($data)` | Create an affiliate record linked to this user. Fires `fluent_affiliate/affiliate_created`. |',
    '| `getAffiliate()` | Return the linked `Affiliate` model, or `null`. |',
    '',
  ].join('\n') + '\n')

  // ── Write hook docs ───────────────────────────────────────────────────────
  console.log('\nWriting hook docs…')

  writeDoc(join(DOCS_DIR, 'hooks', 'index.md'), buildHooksIndexDoc(actions, filters))
  writeDoc(join(DOCS_DIR, 'hooks', 'actions', 'index.md'), buildActionHooksIndexDoc(actions))
  writeDoc(join(DOCS_DIR, 'hooks', 'filters', 'index.md'), buildFilterHooksIndexDoc(filters))

  const ACTION_PAGE_CATEGORIES = {
    integrations: h => /affiliate_created_via_fluent_form|wipe_current_data/.test(h),
    affiliates:   h => /\/affiliate/.test(h) && !/affiliate_group/.test(h) || h === 'fluent_affiliate/admin_app_rendering',
    groups:       h => /affiliate_group/.test(h),
    referrals:    h => /\/referral/.test(h),
    payouts:      h => /\/payout/.test(h),
    portal:       h => /render_login|render_signup|email_head/.test(h),
    creatives:    h => /creative/.test(h),
  }

  const FILTER_PAGE_CATEGORIES = {
    affiliates:   h => /\/affiliate/.test(h) && !/affiliate_group|affiliate_created_via/.test(h) && !/has_all|user_has_affiliate_access/.test(h),
    groups:       h => /affiliate_group/.test(h),
    referrals:    h => /\/referral|data_export_limit|provider_reference|\/commission|ignore_zero|formatted_order|recurring_commission/.test(h),
    permissions:  h => /has_all_|user_has_affiliate_access/.test(h),
    portal:       h => /\/portal|default_share_url|will_load_tracker|smartcode/.test(h),
    settings:     h => /get_email_config|update_email_config|get_referral_config|update_referral_config|get_feature|update_feature|settings_menu|top_menu|right_menu|admin_vars|dashboard_notices|admin_url|portal_page_url|registered_features|max_execution|is_rtl|suggested_colors|payout_form_schema|referral_formats|portal_menu_items|get_currencies|currency_symbols|referral_config_field_types|default_referral_settings|social_media|fluent_affiliate_base_url|fluent_affiliate_tracker_vars|fluent_affiliate_dashboard/.test(h),
    auth:         h => /\/auth\/|terms_policy|reserved_usernames/.test(h),
    integrations: h => /get_integrations|get_integration_config|save_integration_config|user_ip|\/migrators|get_migration|get_current_data|wppayform|advanced_report|woo_menu|product_cat_options/.test(h),
    creatives:    h => /creative/.test(h),
  }

  const actionsByCategory = {}
  for (const [hook] of Object.entries(actions)) {
    for (const [cat, fn] of Object.entries(ACTION_PAGE_CATEGORIES)) {
      if (fn(hook)) {
        if (!actionsByCategory[cat]) actionsByCategory[cat] = []
        actionsByCategory[cat].push(hook)
        break
      }
    }
  }

  const filtersByCategory = {}
  for (const [hook] of Object.entries(filters)) {
    for (const [cat, fn] of Object.entries(FILTER_PAGE_CATEGORIES)) {
      if (fn(hook)) {
        if (!filtersByCategory[cat]) filtersByCategory[cat] = []
        filtersByCategory[cat].push(hook)
        break
      }
    }
  }

  const actionCategoryTitles = {
    affiliates:   'Affiliates',
    groups:       'Groups (Pro)',
    referrals:    'Referrals',
    payouts:      'Payouts',
    portal:       'Portal',
    integrations: 'Integrations',
    creatives:    'Creatives (Pro)',
  }

  const filterCategoryTitles = {
    affiliates:   'Affiliates',
    groups:       'Groups (Pro)',
    referrals:    'Referrals',
    permissions:  'Permissions (Pro)',
    portal:       'Portal',
    settings:     'Settings',
    auth:         'Auth',
    integrations: 'Integrations',
    creatives:    'Creatives (Pro)',
  }

  for (const [cat, title] of Object.entries(actionCategoryTitles)) {
    const hooks = actionsByCategory[cat] ?? []
    const content = buildHookCategoryDoc(title, hooks, actions, 'action')
    if (content) writeDoc(join(DOCS_DIR, 'hooks', 'actions', `${cat}.md`), content)
  }

  for (const [cat, title] of Object.entries(filterCategoryTitles)) {
    const hooks = filtersByCategory[cat] ?? []
    const content = buildHookCategoryDoc(title, hooks, filters, 'filter')
    if (content) writeDoc(join(DOCS_DIR, 'hooks', 'filters', `${cat}.md`), content)
  }

  // ── Write REST API docs ───────────────────────────────────────────────────
  console.log('\nWriting REST API docs…')

  // Group routes by module
  const moduleGroups = {}
  for (const route of allRoutes) {
    if (!moduleGroups[route.module]) moduleGroups[route.module] = []
    moduleGroups[route.module].push(route)
  }

  // Write module-order JSON for sidebar
  const moduleOrder = {}
  for (const [module, moduleRoutes] of Object.entries(moduleGroups)) {
    moduleOrder[module] = moduleRoutes.map((r) => r.slug)
  }
  writeFileSync(join(generatedRoot, 'restapi-module-order.json'), JSON.stringify(moduleOrder, null, 2))
  console.log('  wrote .generated/restapi-module-order.json')

  // Write index
  writeDoc(join(DOCS_DIR, 'restapi', 'index.md'), buildRestApiIndexDoc(allRoutes))

  // Write module pages + individual operation pages + OpenAPI specs
  for (const [module, meta] of Object.entries(REST_MODULE_META)) {
    const moduleRoutes = moduleGroups[module] ?? []

    // Module-level page
    const modulePage = buildRestApiModuleDoc(module, moduleRoutes)
    if (modulePage) writeDoc(join(DOCS_DIR, 'restapi', `${module}.md`), modulePage)

    // Individual operation pages and OpenAPI specs
    for (const route of moduleRoutes) {
      const operationDocPath = join(DOCS_DIR, 'restapi', 'operations', module, `${route.slug}.md`)
      writeDoc(operationDocPath, buildOperationDoc(route))

      const specPath = join(openapiRoot, module, `${route.slug}.json`)
      writeDoc(specPath, buildOpenApiSpec(route))
    }
  }

  const totalRoutes = allRoutes.length
  const totalSpecs = allRoutes.length
  console.log(`\nDone. Generated docs for ${totalRoutes} routes, ${totalSpecs} OpenAPI specs.`)
}

main().catch(err => { console.error(err); process.exit(1) })
