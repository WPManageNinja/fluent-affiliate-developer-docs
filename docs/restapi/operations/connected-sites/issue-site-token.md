---
title: Issue Site Token
description: "Validate and issue a token for a new site."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/settings/connected-sites-config/issue`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `DomainController@validateAndIssueNewSiteToken`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="issueSiteToken" specUrl="/openapi/public/connected-sites/issue-site-token.json" />
