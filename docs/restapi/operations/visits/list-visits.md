---
title: List Visits
description: "List affiliate visits."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/visits`
- **Edition:** Core
- **Controller:** `VisitController@index`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `VisitPolicy` — `manage_options`, or `read_all_visits` or `manage_all_data`.

<OAOperation operationId="listVisits" specUrl="/openapi/public/visits/list-visits.json" />
