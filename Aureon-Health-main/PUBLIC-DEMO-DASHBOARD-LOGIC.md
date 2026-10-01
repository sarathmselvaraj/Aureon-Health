# Aureon Health Public Demo Dashboard Logic

- Login/Register never auto-redirect to Profile or Dashboard.
- Successful Login keeps the browser-local member session and shows popup feedback only.
- Sign Up saves the account and stays on Register with popup feedback.
- Google/Apple sign-in stays on the auth page with popup feedback.
- dashboard.html is a public demo hub.
- member-dashboard.html and admin-dashboard.html are direct aliases to the public demo dashboards.
- Client dashboard uses Arjun Mehta sample data when no member session exists.
- Admin dashboard uses Meera Krishnan as the demo operations profile.
- Dashboard/Admin pages do not require authentication.
- Dashboard Sign Out/Logout controls were replaced with Website/Back to Website actions.
