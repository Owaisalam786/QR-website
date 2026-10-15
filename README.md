# WOLK NIGHT — QR Loyalty Website

A responsive premium black-and-gold landing page and **browser-only demo** for a café loyalty experience.

## Included
- Premium responsive landing page and loyalty programme explanation
- Customer registration form with basic phone validation and a consent checkbox
- Personal demo QR generation and PNG download
- Local demo member lookup in the Staff portal
- Mobile layouts and reduced-motion support

## Run locally
Open `index.html` in a browser, or serve this folder with a local static server. QR generation uses a CDN library and needs an internet connection.

## Important production limitations
This is currently a **front-end demo only**. It is not safe for real customer records, reward accounting, or coupon issuance. Browser local storage can be edited by customers and is not a database. The QR contains a demo member identifier, not a signed token. The staff lookup is not authenticated.

Before using this for a real café, implement:
- A server-side database and authenticated staff/admin roles
- Opaque, signed or server-resolved QR tokens; never trust a customer-submitted visit count
- Server-side, single-use coupon issuance and redemption with audit logs
- Rate limiting, input validation, secure secrets, backups, and privacy/data-retention controls
- WhatsApp reminders only after explicit opt-in, using an approved provider and template

## Deploy
This static version can be deployed to GitHub Pages, Netlify, or Vercel. Real loyalty and coupon features require a backend and database configured before launch.
