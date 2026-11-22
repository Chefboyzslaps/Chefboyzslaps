# CHEFBOYZ® Beat Store

A mobile-first storefront foundation for CHEFBOYZ, an independent music production duo. This phase establishes the brand experience and reusable catalog, collection, preview-player, licensing, and cart foundations. Beats, audio, and prices are sample data; there is no live checkout or message delivery.

## Stack

- Next.js App Router with TypeScript and React
- Tailwind CSS 4 (PostCSS pipeline) and a small set of brand styles
- Lucide icons
- HTML audio preview architecture; preview files are not yet supplied
- Firebase Authentication, Firestore, and Storage for sign-in and admin song uploads
- Future integration targets: Stripe and Google Cloud Run

## Local development

Requirements: Node.js 22 or newer and pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3000`.

## Commands

```sh
pnpm lint
pnpm typecheck
pnpm build
pnpm start
```

## Routes

- `/` brand homepage
- `/beats` searchable, filterable, sortable mock catalog
- `/beats/[slug]` beat details and data-driven license selection
- `/collections` and `/collections/[slug]`
- `/licensing`, `/about`, `/contact`, `/cart`
- `/sign-in` Firebase email/password sign-in
- `/admin` admin-only drag-and-drop song uploads
- `/robots.txt` and `/sitemap.xml`

## Project layout

```text
src/app/             App Router pages, metadata, global styles
src/components/      Shared layout, cards, player, cart, licensing UI
src/data/store.ts    Mock beats, collections, and license products
src/types/store.ts   Catalog and cart types
```

## Environment

Copy `.env.example` to `.env.local` for local configuration. It contains names only. Never commit `.env*` files or credentials. `NEXT_PUBLIC_SITE_URL` should be set to the deployed public origin before launch.

## Current behavior and limits

- Mock beat data is centralized in `src/data/store.ts`; cover art is generated CSS artwork and is not final CHEFBOYZ art.
- No real audio files are bundled. Player controls communicate that preview is coming soon until `previewAudio` is set to an approved public preview asset.
- The browser cart stores beat and license IDs in local storage. It does not treat browser prices as authoritative.
- Checkout is intentionally disabled. No payments, orders, delivery, email, or downloads are processed.
- The contact form is a non-sending design preview and explains this after submission.
- Admin upload access uses Firebase Authentication and a configured UID allowlist. Firestore and Storage rules also enforce that allowlist; configure and publish the rules before enabling uploads.
- Example license details and prices are placeholders, not legal advice or binding terms.

## Firebase sign-in and song uploads

The `/sign-in` page uses Firebase Authentication email/password accounts. Create accounts in Firebase Authentication (Email/Password provider), then set the admin account UID in `NEXT_PUBLIC_FIREBASE_ADMIN_UIDS`. The `/admin` route only renders upload tools for a signed-in UID in that allowlist.

Set the Firebase web app values from `.env.example` in your local environment and deployment. Replace `REPLACE_WITH_ADMIN_UID` in both `firestore.rules` and `storage.rules` with the Firebase Authentication UID (add every admin UID to both rule lists if you have more than one), and set the same UID or UIDs in `NEXT_PUBLIC_FIREBASE_ADMIN_UIDS`. Then publish the rules with `firebase deploy --only firestore:rules,storage`. The rules restrict song upload and draft records to those admin accounts; the browser allowlist only controls which interface appears.

Admin uploads accept audio files up to 200 MB. Files go to Firebase Storage under `songs/{adminUid}/`; their title, storage path, size, and upload details are saved as draft documents in the `songs` Firestore collection. The app does not create Firebase download URLs for private audio. Draft records and uploaded files are admin-only. A public publishing/catalog flow is not included yet. Enable Firebase Authentication, Firestore, and Storage in the Firebase project before using the feature.

## Stripe roadmap

Create Checkout Sessions on a trusted server after looking up current product and license prices. Verify availability and price from server-owned data. Verify webhook signatures, and grant order/download access only after a verified payment event. The success redirect alone must never unlock files. Add idempotent order handling, refunds, receipts, and test-mode coverage before production.

## Google Cloud Run roadmap

The included Dockerfile builds the Next.js app into a standalone Node server on port 8080. Configure secrets through a managed secret store, set `NEXT_PUBLIC_SITE_URL`, health monitoring, and least-privilege service accounts. Provision no cloud resources until deployment has been reviewed and approved.

## Security notes

No secrets are included. Public preview assets must be separate from private purchased files. Use short-lived authorized download links or an equivalent server-checked flow. Revalidate all cart line items, prices, licenses, and availability server-side when checkout is added.
