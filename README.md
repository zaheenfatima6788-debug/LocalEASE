# LocalEASE — Experimental Animated Edition

A responsive, motion-led LocalEASE concept with an original editorial neighborhood illustration, floating service markers, a constellation-style service selector, animated provider cards, searchable/filterable directory, Google Maps directions links, and a demo booking request modal.

## Files
- `index.html` — page structure and content
- `style.css` — visual design, responsive layout, transitions and keyframe animations
- `script.js` — provider directory, search/filter behavior, service navigation, and demo booking interactions

## Run locally
1. Extract the ZIP.
2. Open the folder in VS Code.
3. Open `index.html` using the Live Server extension, or open the HTML file in a browser.
4. Keep all three files in the same folder.

Internet is needed for Google Fonts and Maps links. The core layout and animations are local.

## Important prototype notes
- Provider names, phone numbers, addresses and rating/review counts are listing snapshots and may change. Verify all details before publishing. The site intentionally links to Google Maps search rather than claiming live Google Places integration.
- Decorative service glyphs are original CSS/text illustration, not real provider photographs.
- Booking is a front-end demo. It does not contact a provider or save requests to a database. The request is logged in the browser console for demonstration.
- No real authentication or payment processing is included.
- Before production, integrate a backend/database, real authentication, booking notifications, and a supported payment provider. If using Google Maps Platform content, follow its current attribution, caching and photo/review policies.
