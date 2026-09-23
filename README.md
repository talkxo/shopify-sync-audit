<div align="center">
  <h1>Shopify Sync Audit 🛒</h1>
  <p><strong>The ultimate CLI for enforcing 2026 Shopify Catalog Standards.</strong></p>
</div>

## Overview

[![Built by TalkXO](https://img.shields.io/badge/Built_by-TalkXO-magenta.svg)](https://hello.talkxo.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

`shopify-sync-audit` is a powerful, terminal-based Consistency Engine developed by the **TalkXO Agency**. It automatically merges your product CSVs with your local image assets and runs a strict, comprehensive audit against the latest e-commerce standards before you ever import them to Shopify.

Stop finding out about bad data *after* you upload. Catch it locally.

---

## Quick Start

You don't need to install this globally. You can run it instantly using `npx`:

`npx shopify-sync-audit audit`

The CLI will launch a beautiful **Interactive Mode** (complete with an ASCII animation) where it will prompt you for your CSV file and Images folder.

---

## The Standards Engine

Shopify Sync Audit enforces extremely strict standards designed to maximize **SEO**, **Conversion**, and **Inventory Tracking**.

- **SEO Compliance:** 
  - Validates that Title lengths are perfectly optimized for Google (20-70 characters).
  - Ensures Product Handles (URL slugs) are strictly web-safe.
- **Conversion / Media:** 
  - Enforces the modern 4-image minimum rule (e.g., Front, Back, Detail, Lifestyle).
- **Content & Copywriting:** 
  - Rejects short descriptions (<150 chars).
  - *Dynamically reads your copy* to ensure it contains at least two mandatory sections (e.g., "Materials/Fabric", "Care Instructions", or "Size Guide").
- **Inventory Integrity:** 
  - Validates pricing rules (Price > 0).
  - Enforces strict, standardized sizing schemas (XS, S, M, L, XL, XXL, OS).
  - Prevents missing SKUs or negative inventory values.

---

## Beautiful, Actionable Reporting

If a product fails the audit, the CLI won't just crash. It does two things:

1. **Syntax-Highlighted Dashboard:** Renders a gorgeous, color-coded table right in your terminal, explicitly identifying the exact row, product handle, and field that failed.
2. **Automated Punch-List:** Automatically generates a `TalkXO_Audit_Report.txt` file in your directory. You can hand this file directly to your data-entry team to resolve issues in Excel before re-running the tool.

---

## Advanced Usage

If you prefer to skip the interactive prompts, you can pass your files directly via flags:

`npx shopify-sync-audit audit -c ./my-catalog.csv -i ./product-images/`

### Expected CSV Format
Ensure your CSV contains standard Shopify headers (e.g., `Handle`, `Title`, `Description`, `SKU`, `Size`, `Price`, `Inventory`). Images in your folder should simply start with the `Handle` of the product they belong to (e.g., `cool-shirt_front.jpg`).

---

## About TalkXO
This tool is proudly maintained and open-sourced by **[TalkXO](https://hello.talkxo.com)**, a premier agency specializing in elite Shopify builds, migrations, and technical e-commerce operations.
