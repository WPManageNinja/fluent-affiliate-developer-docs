---
title: Get Affiliate CRM Contact
description: "Get the FluentCRM contact linked to an affiliate, with its current tags and lists. Requires FluentCRM to be active and the `fcrm_read_contacts` capability."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/affiliates/{id}/crm-contact`
- **Edition:** Core
- **Controller:** `AffiliateController@getCrmContact`
- **Route source:** `app/Http/Routes/api.php`

<OAOperation operationId="getAffiliateCrmContact" specUrl="/openapi/public/affiliates/get-affiliate-crm-contact.json" />
