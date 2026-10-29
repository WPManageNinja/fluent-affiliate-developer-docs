---
title: Export Visits
description: "Export visits as CSV."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/visits/export`
- **Edition:** Core
- **Controller:** `VisitController@export`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `VisitPolicy` — `manage_options`, or `read_all_visits` or `manage_all_data`.

<OAOperation operationId="exportVisits" specUrl="/openapi/public/visits/export-visits.json" />
