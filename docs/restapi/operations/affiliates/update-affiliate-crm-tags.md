---
title: Update Affiliate CRM Tags
description: "Attach or detach FluentCRM tags on the affiliate's CRM contact."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/affiliates/{id}/crm-contact/tags`
- **Edition:** Core
- **Controller:** `AffiliateController@updateCrmTags`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AffiliatePolicy` — `manage_options`, or `manage_all_affiliates` or `manage_all_data`.

<OAOperation operationId="updateAffiliateCrmTags" specUrl="/openapi/public/affiliates/update-affiliate-crm-tags.json" />
