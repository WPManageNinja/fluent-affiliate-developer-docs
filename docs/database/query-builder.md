---
title: Query Builder
description: Common query builder patterns and available model scopes in FluentAffiliate.
---

# Query Builder

FluentAffiliate models inherit the WPFluent query builder — a Laravel Eloquent-inspired layer on top of `$wpdb`. All models expose chainable scope methods and a fluent query API.

## Scope Inventory

| Model | Scope | Parameters |
| --- | --- | --- |
| [`Affiliate`](/database/models/affiliate) | `OfStatus` | `$query, $status` |
| [`Affiliate`](/database/models/affiliate) | `ByStatus` | `$query, $status` |
| [`Affiliate`](/database/models/affiliate) | `SearchBy` | `$query, $search` |
| [`Affiliate`](/database/models/affiliate) | `ApplyCustomFilters` | `$query, $filters` |
| [`Referral`](/database/models/referral) | `SearchBy` | `$query, $search` |
| [`Referral`](/database/models/referral) | `ByStatus` | `$query, $status` |
| [`Referral`](/database/models/referral) | `ApplyCustomFilters` | `$query, $filters` |
| [`Referral`](/database/models/referral) | `Paid` | `$query` |
| [`Referral`](/database/models/referral) | `UnPaid` | `$query` |
| [`Payout`](/database/models/payout) | `SearchBy` | `$query, $search` |
| [`Payout`](/database/models/payout) | `ByStatus` | `$query, $status` |
| [`Payout`](/database/models/payout) | `ApplyCustomFilters` | `$query, $filters` |
| [`Visit`](/database/models/visit) | `SearchBy` | `$query, $search` |
| [`Visit`](/database/models/visit) | `ByConvertedStatus` | `$query, $convertedStatus` |
| [`Visit`](/database/models/visit) | `ApplyCustomFilters` | `$query, $filters` |
| [`Transaction`](/database/models/transaction) | `SearchBy` | `$query, $search` |
| [`Transaction`](/database/models/transaction) | `ByStatus` | `$query, $status` |
| [`Transaction`](/database/models/transaction) | `ApplyCustomFilters` | `$query, $filters` |
| [`Meta`](/database/models/meta) | `Ref` | `$query, $objectId` |
| [`Meta`](/database/models/meta) | `ReferralSetting` | `$query` |
| [`AffiliateGroup`](/database/models/affiliate-group) | `Search` | `$query, $search` |
| [`User`](/database/models/user) | `SearchBy` | `$query, $search` |

## Common Patterns

```php
use FluentAffiliate\App\Models\Affiliate;
use FluentAffiliate\App\Models\Referral;
use FluentAffiliate\App\Models\Payout;
use FluentAffiliate\App\Models\Visit;

// Active affiliates matching a search term
$affiliates = Affiliate::query()
    ->byStatus('active')
    ->searchBy('john')
    ->orderBy('created_at', 'DESC')
    ->paginate();

// Unpaid referrals for a specific affiliate
$referrals = Referral::query()
    ->where('affiliate_id', $affiliateId)
    ->unPaid()
    ->get();

// Pending payouts above a threshold
$payouts = Payout::query()
    ->byStatus('pending')
    ->where('amount', '>=', 50)
    ->orderBy('created_at', 'ASC')
    ->get();

// Unconverted visits in a date range
$visits = Visit::query()
    ->byConvertedStatus(0)
    ->where('created_at', '>=', '2025-01-01')
    ->count();
```

## Query Builder Methods

The WPFluent query builder exposes standard methods you'd expect from an Eloquent-style ORM:

```php
// Filtering
->where('column', 'value')
->where('column', 'operator', 'value')   // e.g. '>=', 'LIKE', '!='
->orWhere('column', 'value')
->whereIn('column', [1, 2, 3])
->whereNotIn('column', [4, 5])
->whereNull('column')
->whereNotNull('column')

// Date filtering
->where('created_at', '>=', '2025-01-01 00:00:00')

// Ordering and limiting
->orderBy('created_at', 'DESC')
->orderBy('amount', 'ASC')
->limit(10)
->offset(20)

// Eager loading relationships
->with('affiliate')
->with(['affiliate', 'referrals'])

// Aggregates
->count()
->sum('amount')
->avg('rate')

// Retrieval
->get()           // Collection
->first()         // Single model or null
->find($id)       // By primary key
->paginate()      // Paginated result
```

## Conditional Queries with `when()`

Use `when()` to apply constraints only when a condition is true — useful for optional filters:

```php
$referrals = Referral::query()
    ->when($affiliateId, function ($query) use ($affiliateId) {
        $query->where('affiliate_id', $affiliateId);
    })
    ->when($status, function ($query) use ($status) {
        $query->byStatus($status);
    })
    ->when($search, function ($query) use ($search) {
        $query->searchBy($search);
    })
    ->get();
```

## Working with Relationships

```php
// Affiliate with its referrals and payout transactions
$affiliate = Affiliate::with(['referrals', 'payouts'])->find($id);

foreach ($affiliate->referrals as $referral) {
    echo $referral->amount;
}

// Referral with its affiliate and customer
$referral = Referral::with(['affiliate', 'customer'])->first();
echo $referral->affiliate->user_id;
echo $referral->customer->email;
```

## Raw Expressions

When you need database-level expressions not covered by the fluent API:

```php
use FluentAffiliate\Framework\Database\Orm\Builder;

$totals = Referral::query()
    ->select(\FluentAffiliate\Framework\Support\Facades\DB::raw('affiliate_id, SUM(amount) as total'))
    ->where('status', 'paid')
    ->groupBy('affiliate_id')
    ->get();
```
