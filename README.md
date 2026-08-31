# Bright & Kind Cleaning Co. website template

A responsive two-page UK cleaning-business website built with HTML, CSS and vanilla JavaScript. The design uses a calm sage-and-off-white palette, an all-sans type system, soft rounded surfaces, and reduced-motion support.

## Run locally

Open `index.html` directly, or serve the folder with any static server (for example VS Code Live Server or `python -m http.server 8080`). The second page is `work.html`.

## Customise the business

Edit `assets/js/config.js` to change the business name, UK/US regional settings, currency, phone number, WhatsApp number, contact details and service area. Repeated contact links are populated from this file.

## Adjust quote pricing

All quote values are grouped in `assets/js/config.js` under `pricing`: service base prices, bedroom and bathroom increments, property adjustments, commercial sizes, add-ons and recurring-service discounts.

## Replace photography

Replace files in `assets/images/` while keeping the same filenames, or update the relevant `src` values in `index.html` and `work.html`. For genuine client use, replace every demonstration before/after pair on `work.html` with real paired photographs taken from the same angle.

## Connect the quote form

The form intentionally does not send personal data. The integration point is marked in `index.html` near `quote-success`. Connect it to Netlify Forms, Formspree, EmailJS, Supabase, Firebase or a custom CRM/API. Stripe and Calendly should be added only after the estimate step if the client needs payment or appointment booking.

## Deploy to Netlify

Push this folder to a GitHub repository. In Netlify, choose **Import an existing project**, connect the repository and publish the repository root. No build command is required; the publish directory is `.`.

## Launch checklist

- Replace placeholder company details and social links.
- Replace demonstration reviews and before/after images with genuine client content.
- Add the production domain to canonical and Open Graph metadata.
- Connect and test the quote form.
- Add a real privacy policy and consent wording.
