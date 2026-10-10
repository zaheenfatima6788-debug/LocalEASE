# LocalEASE login and professional listing demo

## Added pages
- `login.html` — choose customer or professional login.
- `customer-signup.html` — create a customer demo account.
- `professional-register.html` — professionals add business details, service category, area, experience, starting price, and a description.
- `dashboard.html` — signed-in professionals can preview their saved listing and its review status.
- `auth.css` and `auth.js` — shared styling and demo interactions.

## Run it
1. Keep all files in the same folder as `index.html`, `style.css`, and `script.js`.
2. Open the folder in VS Code.
3. Run `index.html` with the Live Server extension (recommended), or open it in a browser.
4. Click **For professionals** to register a provider, then use the dashboard. To test login, log out and use the email/password you registered with.

## Important limitation
This is a front-end prototype only. It stores demo accounts and professional profiles in browser `localStorage`; the active session is in `sessionStorage`. Passwords are not securely hashed, and profiles are not shared across browsers/devices. Do not use real passwords or sensitive personal data. For production, use a backend such as Supabase Auth with database row-level security, server-side validation, secure file storage, and an admin verification workflow. Real bookings, customer-to-provider messaging, and published directory listings still need backend integration.


## Language option
A language selector is available in the page header. English and Hindi (हिन्दी) are supported, and the selected language is saved in this browser. This is a front-end demo; some dynamic or less-common text may remain in English.
