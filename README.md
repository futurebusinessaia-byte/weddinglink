# WeddingLink

**A premium, mobile-first digital wedding invitation + website + RSVP + live stream + online gifts system.**

🌐 Live demo: https://weddinglink-564.pages.dev
💰 Sales page: https://weddinglink-564.pages.dev/sales.html
💌 Invitation: https://weddinglink-564.pages.dev/invite.html

---

## What It Is

WeddingLink is a complete digital wedding invitation system — not a template, not a PDF. Couples get one beautiful link that includes:

- 💌 Digital wedding invitation
- 🌐 Personal wedding website
- 📅 Multi-event schedule
- 📍 Google Maps directions
- 📸 Photo gallery
- ⏳ Live countdown
- 📝 RSVP
- 🎥 Live stream
- 💰 Online gifts (UPI, card, PayPal)
- 📱 WhatsApp / SMS / iMessage sharing
- 🔳 QR code
- 💍 Couple story

Guests open it in any mobile browser — no app download required.

---

## Live Sites

| Page | URL |
|------|-----|
| Wedding site | https://weddinglink-564.pages.dev/ |
| Invitation | https://weddinglink-564.pages.dev/invite.html |
| Sales page | https://weddinglink-564.pages.dev/sales.html |
| Thank you | https://weddinglink-564.pages.dev/thank-you.html |
| 404 | https://weddinglink-564.pages.dev/404.html |

---

## Pricing

| Tier | USD | INR |
|------|-----|-----|
| Essential | $19 | ₹1,599 |
| Premium ⭐ | $39 | ₹3,299 |
| Done-For-You | $149 | ₹12,499 |
| Planner Pro | $49/mo | ₹4,099/mo |

All tiers include 1 year hosting. Payments by Dodo Payments.

---

## Repository Structure

weddinglink/
├── index.html
├── invite.html
├── sales.html
├── thank-you.html
├── 404.html
├── manifest.json
├── robots.txt
├── sitemap.xml
├── _redirects
├── css/
│   └── style.css
├── js/
│   ├── wedding.js
│   └── sales.js
└── data/
    └── wedding-data.js

---

## Tech Stack

- Pure HTML + CSS + JavaScript — no frameworks, no build step
- Hosting: Cloudflare Pages (free, auto-deploy from GitHub)
- Fonts: Google Fonts (Cormorant Garamond + Inter)
- QR codes: qrcodejs (client-side)
- Image export: html2canvas (lazy-loaded)
- Payments: Dodo Payments (Merchant of Record)
- Analytics: GA4 events pre-wired

Page weight: under 300 KB. Loads in under 2 seconds on 4G.

---

## Onboarding a New Customer

1. Duplicate `data/wedding-data.js` → `data/customer-name.js`
2. Edit couple names, date, venue, events, gallery, WhatsApp number, live stream URL, gifts link
3. In `index.html` and `invite.html`, change:
   `<script src="data/wedding-data.js">` → `<script src="data/customer-name.js">`
4. Commit → Cloudflare deploys in 30 seconds
5. Share the live URL + QR code

No HTML or CSS edits required per customer.

---

## RSVP Integration

Leave `rsvp_endpoint` empty for demo mode. To enable real RSVPs:

### Formspree
1. Sign up at formspree.io
2. Create a form → copy URL
3. Paste into `rsvp_endpoint`

### Google Sheets
1. Create a Sheet with headers: Timestamp | Name | Guests | Attendance | Message | Wedding
2. Extensions → Apps Script → paste a doPost function
3. Deploy as Web app → Anyone → copy URL
4. Paste into `rsvp_endpoint`

---

## Payments (Dodo)

| Product | Product ID |
|---------|------------|
| Essential | pdt_0NnP96lvClSjzNPwiDoJv |
| Premium | pdt_0NnPAOBNDPPDDhc7ss5A0 |
| Done-For-You | pdt_0NnPAUdRcjvi5hMOQgx90 |
| Planner Pro | pdt_0NnPApFEnUOiDzOeXMA3y |

Set Success URL in Dodo dashboard to:
https://weddinglink-564.pages.dev/thank-you.html

---

## Conversion Events

| Event | Trigger |
|-------|---------|
| demo_view | Wedding site loaded |
| pricing_view | Pricing section scrolled into view |
| pricing_interaction | Any plan CTA clicked |
| cta_click | Any [data-cta] element |
| whatsapp_click | WhatsApp share button |
| start_order | Checkout CTA clicked |
| purchase | Thank-you page loaded |
| rsvp_submit | RSVP form submitted |
| currency_switch | Currency toggle changed |
| faq_open | FAQ item expanded |

Import from GA4 to Google Ads to track conversions.

---

## Deployment

Hosted on Cloudflare Pages, connected to this GitHub repo.

- Production branch: main
- Framework preset: None
- Build command: (empty)
- Build output directory: (empty)

Every push auto-deploys in ~30 seconds.

---

## Design System

| Token | Value | Use |
|-------|-------|-----|
| ivory | #FBF7F0 | Background |
| gold | #C7A667 | Accents |
| rose-deep | #8E5F5F | Emphasis |
| ink | #2E211B | Text, buttons |
| serif | Cormorant Garamond | Headings |
| sans | Inter | Body |

---

## Template Roadmap

- Template 01 — Heritage (current)
- Template 02 — Minimal Ivory
- Template 03 — Botanical
- Template 04 — Luxe
- Template 05 — Southern
- Template 06 — Global

---

## Brand

Product: WeddingLink
Parent: InfraAgentAI
Voice: Premium, warm, editorial

InfraAgentAI appears only as a subtle footer signature.

---

## Version

v1.0 — Global launch
