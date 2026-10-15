---
title: "Neofollower/Neofollower-SMM-Reseller-API-for-Woocommerce"
owner: "Neofollower"
name: "Neofollower-SMM-Reseller-API-for-Woocommerce"
fullName: "Neofollower/Neofollower-SMM-Reseller-API-for-Woocommerce"
description: "Official NeoFollower WordPress plugin for selling SMM reseller services through WooCommerce with automated API order fulfillment, service sync, status tracking and balance monitoring."
sourceUrl: "https://github.com/Neofollower/Neofollower-SMM-Reseller-API-for-Woocommerce"
stars: 108
forks: 0
language: "PHP"
topics: ["api-integration", "automation", "ecommerce", "marketing-automation", "neofollower", "open-source", "order-fulfillment", "php"]
license: "GPL-2.0"
homepage: "https://wordpress.org/plugins/neofollower-smm-reseller-api-for-woocommerce/"
defaultBranch: "main"
snapshotDate: "2026-08-23"
pushedAt: "2026-08-20T08:14:00Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Neofollower – SMM Reseller API for WooCommerce

**Official source repository for the Neofollower WordPress plugin that connects WooCommerce products to the NeoFollower SMM panel reseller API and automates paid order fulfillment.**

This free, GPL-licensed plugin is designed for agencies, social media service resellers, and WooCommerce store owners who want to sell selected NeoFollower services through a normal WordPress + WooCommerce storefront instead of operating a separate SMM panel interface.

**Official plugin:** https://wordpress.org/plugins/neofollower-smm-reseller-api-for-woocommerce/  
**NeoFollower:** https://neofollower.com  
**Reseller API endpoint:** `https://panel.neofollower.com/api/v1`  
**NeoFollower API documentation:** https://panel.neofollower.com/api/docs

> WordPress.org is the canonical distribution channel for stable plugin releases. This GitHub repository provides the source code, technical documentation, issue tracking, and development history.

## What does this WordPress SMM reseller plugin do?

Neofollower – SMM Reseller API for WooCommerce turns selected WooCommerce products into API-fulfilled social media service products.

A store administrator can synchronize the NeoFollower service catalog, connect a WooCommerce product to a service, collect the public target information required for fulfillment, and automatically submit an eligible paid WooCommerce order to NeoFollower. The plugin stores the external order ID and can synchronize fulfillment status back into WooCommerce.

Typical use cases include:

- WooCommerce-based SMM reseller stores
- Social media marketing agencies selling services through WordPress
- Existing WooCommerce stores adding selected reseller services
- Stores that want WooCommerce checkout and payment gateways with API-based fulfillment
- Resellers who prefer a normal e-commerce storefront over a dedicated SMM panel UI

## Features

- Connect individual WooCommerce products to synchronized NeoFollower services.
- Synchronize the NeoFollower service catalog from the reseller API.
- Collect a public profile, post, page, channel, username, or other configured target field.
- Support fixed quantity and customer-selected quantity products.
- Support custom-comment services.
- Support package services that do not require quantity.
- Support drip-feed orders with runs and interval values.
- Automatically submit eligible paid WooCommerce orders.
- Store the NeoFollower order ID on the WooCommerce order item.
- Prevent duplicate external submissions with per-order-item locking.
- Synchronize active external order statuses automatically or manually.
- Display fulfillment status with WooCommerce order information.
- Monitor NeoFollower account balance.
- Send optional low-balance and failed-fulfillment email alerts.
- Optionally pause new fulfillment below a configured balance threshold.
- Maintain configurable diagnostic logs.
- Optionally remove plugin data during uninstall.
- Support WooCommerce High-Performance Order Storage (HPOS).
- Declare compatibility with WooCommerce cart and checkout blocks.

## Requirements

| Requirement | Minimum |
|---|---:|
| WordPress | 6.2 |
| WooCommerce | 6.0 |
| PHP | 7.4 |
| NeoFollower account | Required |
| NeoFollower API key | Required |

The plugin code is free. NeoFollower is a separate service, and API orders use the balance, service catalog, prices, and fulfillment terms of the connected NeoFollower account.

## Installation

### From WordPress.org

The recommended installation method is the official WordPress Plugin Directory:

https://wordpress.org/plugins/neofollower-smm-reseller-api-for-woocommerce/

In WordPress:

1. Go to **Plugins → Add New Plugin**.
2. Search for **Neofollower SMM Reseller API for WooCommerce**.
3. Install and activate the plugin.
4. Open **WooCommerce → Neofollower**.
5. Add your NeoFollower API key.
6. Test the connection and synchronize services.
7. Edit a WooCommerce product and enable **Neofollower Fulfillment**.
8. Select the service and configure the product's fulfillment fields.
9. Place a complete test order before accepting live orders.

### WP-CLI

```bash
wp plugin install neofollower-smm-reseller-api-for-woocommerce --activate
```

### Manual ZIP installation

Download a stable release ZIP from WordPress.org, then use:

**Plugins → Add New Plugin → Upload Plugin**

See the full installation guide.

## Basic setup

After activation, go to:

```text
WooCommerce → Neofollower
```

The administration area provides controls for:

- API configuration
- connection testing
- service synchronization
- balance monitoring
- external order records
- status synchronization
- logs
- support / bug reporting

Then edit a WooCommerce product and enable NeoFollower fulfillment for that product.

See configuration.

## How order fulfillment works

At a high level:

```text
Customer selects configured WooCommerce product
                  ↓
Customer enters target / quantity / comments when required
                  ↓
WooCommerce checkout and payment
                  ↓
Plugin detects eligible paid order
                  ↓
Plugin locks the order item against duplicate submission
                  ↓
POST request to NeoFollower reseller API
                  ↓
NeoFollower order ID saved to WooCommerce
                  ↓
Scheduled or manual status synchronization
                  ↓
Updated fulfillment status shown in WooCommerce
```

The plugin listens to eligible WooCommerce payment/order events and submits only products that have NeoFollower fulfillment enabled.

Read how fulfillment works.

## Supported fulfillment types

The current plugin supports these integration modes:

| Type | Description |
|---|---|
| Standard | Target + quantity |
| Customer quantity | Customer selects quantity within configured limits |
| Custom comments | Target + comment lines |
| Package | Target without quantity |
| Drip feed | Target + quantity + runs + interval |

Actual service availability and field requirements depend on the live NeoFollower service catalog.

## NeoFollower API integration

The plugin communicates with:

```text
https://panel.neofollower.com/api/v1
```

using WordPress `wp_remote_post()`.

Core API actions used by the plugin include:

```text
services
balance
add
status
```

The API key and request payload are sent server-side. The plugin does not expose the NeoFollower API key to normal storefront visitors.

For the API itself, see:

- https://panel.neofollower.com/api/docs
- the official NeoFollower API GitHub repository when published

## Repository structure

```text
.
├── neofollower-smm-reseller-api-for-woocommerce.php
├── readme.txt
├── uninstall.php
├── LICENSE
│
├── includes/
│   ├── class-nfwc-plugin.php
│   ├── class-nfwc-api.php
│   ├── class-nfwc-admin.php
│   ├── class-nfwc-product.php
│   ├── class-nfwc-order.php
│   └── class-nfwc-db.php
│
├── assets/
│   ├── css/
│   └── js/
│
├── docs/
│   ├── installation.md
│   ├── configuration.md
│   ├── how-it-works.md
│   ├── developer-guide.md
│   ├── privacy-security.md
│   └── faq.md
│
└── .github/
    ├── ISSUE_TEMPLATE/
    └── workflows/
```

## Architecture

The plugin is deliberately small and uses WordPress/WooCommerce APIs directly.

### `NFWC_Plugin`

Initializes the plugin, declares WooCommerce compatibility, schedules recurring tasks, adds privacy-policy text, and manages balance monitoring.

### `NFWC_API`

Handles server-side communication with the NeoFollower reseller API using `wp_remote_post()`.

### `NFWC_Admin`

Provides the **WooCommerce → Neofollower** administration interface and administrator actions such as testing the API, synchronizing services, checking balance, retrying orders, and viewing logs.

### `NFWC_Product`

Adds NeoFollower fulfillment settings to WooCommerce products and collects the service-specific customer input used for fulfillment.

### `NFWC_Order`

Submits eligible paid order items, applies duplicate-submission locking, stores external order IDs, synchronizes statuses, and manages failure notifications.

### `NFWC_DB`

Creates and manages the plugin's service, fulfillment-order, and log tables plus plugin settings.

More detail is available in the developer guide.

## Data stored by the plugin

Depending on configuration and order type, the plugin can store:

- NeoFollower service IDs
- NeoFollower external order IDs
- public target links or usernames
- quantities
- custom comments
- drip-feed settings
- fulfillment statuses
- API response information
- diagnostic logs

The plugin also stores the API key in WordPress settings for server-side API communication.

See privacy and security.

## External service disclosure

NeoFollower provides the remote service required for catalog synchronization, balance checks, external order placement, and fulfillment status synchronization.

Depending on the action and service type, requests can include the NeoFollower API key, service ID, public target, username, quantity, comments, drip-feed data, or NeoFollower order ID.

The plugin does not include advertising telemetry.

## FAQ

### Is this an SMM panel plugin for WordPress?

It is a WooCommerce reseller integration for NeoFollower. It lets a WordPress store sell selected services through WooCommerce and send eligible paid orders to the NeoFollower API. It is not intended to reproduce every feature of a dedicated SMM panel script.

### Is WooCommerce required?

Yes. WooCommerce is a required plugin.

### Is a NeoFollower account required?

Yes. A valid NeoFollower account and API key are required for service synchronization, balance checks, order placement, and status synchronization.

### Is the WordPress plugin free?

Yes. The plugin source code is GPL-licensed and available free of charge. Orders placed through the API use the connected NeoFollower account balance.

### Can it automatically fulfill WooCommerce orders?

Yes. Products with NeoFollower fulfillment enabled can be submitted automatically after eligible WooCommerce payment/order events.

### Does it support custom comments?

Yes. The plugin includes a custom-comment fulfillment mode.

### Does it support drip-feed services?

Yes. The plugin can collect and submit quantity, runs, and interval values for configured drip-feed products.

### Does it work with variable WooCommerce products?

Variations can inherit settings from an enabled parent product. Test the exact configuration before selling live.

### Does the plugin send social media passwords?

No. Normal supported workflows use public targets, public usernames, quantities, comments, or other service-specific public information. Do not request customer social media passwords through this plugin.

See the complete FAQ.

## WordPress.org and GitHub

The stable user-facing plugin is published here:

https://wordpress.org/plugins/neofollower-smm-reseller-api-for-woocommerce/

WordPress.org remains the canonical installation and update channel.

GitHub is used for:

- source visibility
- technical documentation
- issue tracking
- development history
- code review
- release notes

When reporting an issue, never publish your NeoFollower API key or customer information.

## Contributing

Documentation corrections and reproducible plugin bugs are welcome.

Read CONTRIBUTING.md before opening a pull request.

## Security

Do not publish API credentials, private site diagnostics, or customer/order data in GitHub issues.

See SECURITY.md.

## Support

For plugin usage questions, use the official WordPress.org plugin support forum or the support tools provided inside **WooCommerce → Neofollower**.

For NeoFollower account, balance, service, pricing, or order questions, use the official NeoFollower support channels.

## License

This plugin is licensed under **GPL-2.0-or-later**.

See LICENSE.

---

**Neofollower – SMM Reseller API for WooCommerce** is the official NeoFollower WooCommerce reseller integration for connecting WordPress products and payments to API-based SMM service fulfillment.
