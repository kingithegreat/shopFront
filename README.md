# FreshFold Tauranga Laundry MVP

This is a modern, mobile-first MVP web application for a laundry pickup and delivery business operating in Tauranga, New Zealand. It has been transformed into a fully UI-configurable business platform.

## First-Run Setup & Initialization

After deployment, the business owner can configure the platform without writing any code.

**Step 1: Become the Owner**
Because Admin Access (`owner` role) restricts the panel to authorized users, you must manually set the very first admin in the database.
1. Authenticate / create your account on the app normally.
2. Go to the Firebase Console -> Firestore Database -> `users` collection.
3. Find your user document (match by `email`).
4. Update the `role` field from `customer` to `owner`.
5. Refresh the app. The app will detect you are the owner and that setup is not complete.

**Step 2: Onboarding Wizard**
You will be redirected to the Setup Wizard automatically. The wizard will walk you through:
1. Business Profile (Name, Address, Email, Phone)
2. Service Area Rules (Radius limits, free delivery constraints)
3. Booking Settings (Notice periods, max advance days)
4. Payments & Integrations (Payment mode: Stripe or Manual)

Once complete, default core services, add-ons, and homepage layout data are automatically seeded into your Firestore database.

## Config-Driven Architecture

FreshFold is no longer a hardcoded template. Every aspect of the customer experience pulls dynamically from Firestore:
- **Pricing & Forms:** The Booking form fetches real-time `services` and `addons` from Firestore.
- **Website Content:** The landing page dynamically renders sections and content driven by the `siteSettings` documents (homepageLayout, homepageContent, mediaAssets).
- **Service Area:** Free vs Paid delivery rules and the 20km boundary checks are derived from `serviceArea` settings.

## Integrating Core Services

The platform provides a dedicated "Integrations" section in the Admin Panel to set public settings, but secret credentials must remain secure.

**Security Rule:** Never store secret keys (e.g. Stripe Secret Key, Mailgun Secret) in the client-readable Firestore `siteSettings`. Use backend configurations or Cloud Secret Manager.

### 1. Connecting Stripe (Payments)
You can choose "Manual Payment" to run a cash-on-delivery model while starting out. When ready for online processing:
1. Set the Payment Mode to "Stripe" in Admin Integrations.
2. Enter your Public Stripe Publishable Key (`pk_live_...` or `pk_test_...`) in the Admin Integrations dashboard.
3. Add your `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` to your backend Cloud Functions or Node server environment variables.

### 2. Connecting Email & SMS (Notifications)
1. Turn on Email or SMS from the Admin Integrations dashboard.
2. Configure **Firebase Extensions** (e.g., Trigger Email from Firestore) or deploy a backend function using SendGrid, Resend, or Twilio using secure environment variables.

## Scripts
- `npm run dev` - Start development server (Port 3000)
- `npm run build` - Build for production
- `npm run lint` - Run TypeScript checks

