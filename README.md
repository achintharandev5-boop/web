# Rainmakers

Single-page React and Vite website for Rainmakers, a Sri Lankan sales technology and inbound sales outsourcing company. The production build prerenders the landing page to static HTML and hydrates it in the browser. The hero uses a lightweight animated SVG wave visual that pauses outside the viewport and remains static for reduced-motion users.

## Run locally

Use Node.js 20.17+ or a maintained Node.js LTS release.

```sh
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
npm run preview
```

Serve the generated `dist/` directory from the site root. Copy `.env.example` to `.env.local` for local testing and configure the production build environment separately. Rebuild when changing public configuration.

## Contact endpoint

The form shows an integration-pending message and disables submission when `VITE_CONTACT_ENDPOINT` is empty. WhatsApp remains available. To activate the form, select an approved form service or configure a server endpoint using this contract.

- Accept a JSON POST containing `name`, `business`, `phone`, `email`, `interest`, `message` and the empty honeypot field `website`.
- Validate and bound all input server-side, reject a populated honeypot, and rate-limit requests. Apply a provider-supported spam control if required and keep provider credentials server-side. If the endpoint is cross-origin, allow the confirmed Rainmakers origin in CORS.
- Return a 2xx JSON response with `{"accepted":true}` after delivery or durable acceptance for processing. Return an appropriate error status for rejected requests. The browser times out after 15 seconds and shows a retry message on failure.
- Verify that a real enquiry reaches the approved destination. Test invalid input, spam rejection, temporary failure and successful delivery before enabling the public form.

## Owner inputs and deployment checks

- Supply the approved full brief PDF, visual references and logo files. The current copy follows the supplied development prompt and the site displays the company name as text. Place the approved logo variants in `public/` and set `VITE_LOGO_LIGHT` and `VITE_LOGO_DARK` to their public paths.
- Confirm the production HTTPS origin and set `SITE_ORIGIN` to generate canonical metadata, absolute sharing URLs and the sitemap. Verify that social crawlers can fetch `social.png`.
- Confirm the official email if it should be published. The example environment reserves an unpublished value. Confirm any commercial limitations or service conditions before publishing them.
- Approve the contact service and destination, then run the integration checks above.
- Run the production build and preview. Check widths 320, 375, 768, 1024, 1440 and 1920 px. Test navigation, keyboard focus and Escape in the mobile dialog, the FAQ, all WhatsApp destinations, reduced motion, and the WebGL fallback. Run an automated accessibility audit and Lighthouse against the production preview.
- Apply the supplied `_headers` file on a compatible static host or translate it to the chosen host's configuration. Add a host-specific CSP that allows the approved contact endpoint, then verify security and cache headers on the served URL.

## Verification environment

The managed workspace currently has no package lock or installed dependencies. npm runs in offline mode by default. The offline install reports ENOTCACHED for the registry metadata for @eslint/js. An online probe using a one-command override reports ECONNREFUSED at 127.0.0.1:9. Global npm configuration was preserved. To complete verification, run npm install in an environment with approved registry access or a populated compatible cache, preserve the generated package-lock.json, and run the type check, lint, build and preview commands above. Confirm the preview serves the prerendered page before starting browser checks.
"# web" 
