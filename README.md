# BigHammer.ai · Email sequences (Gmail iOS preview)

Static review site: cold email sequences A and B, the v1 invite, reminder emails and post-masterclass follow-ups, rendered as the prospect sees them in the Gmail iOS app.

**Live:** https://adisuja.github.io/bighammer-email-sequences/ · **Scorecard:** https://adisuja.github.io/bighammer-email-sequences/scorecard.html

## Files
- `index.html` — shell: top bar (controls), side-nav, grid, toast
- `data.js` — ALL copy + sample merge data + link checks. **Edit this file to change copy.** Tokens use `{{token}}`; `SEP` is the one switch for what renders where the source had an em dash.
- `app.js` — channel renderer (maps a cell to a screen)
- `core.js` / `core.css` — shared shell + iPhone frame (identical across the five BigHammer preview repos)
- `gmail.js` / `gmail.css` — platform chrome
- `scorecard.html` + `scorecard.js` / `scorecard.css` — benchmark scorecard computed live from `data.js`
- `assets/` — images used by the copy

## Data model
campaigns → columns (steps, left → right in send order) → rows (complete paths / variations) → cells (one screen each).
Every cell in a row continues from that row's earlier messages.

Bump the `?v=` query in `index.html` and `scorecard.html` on every push (GitHub Pages caching).
Source of truth for the copy: the BigHammer Google Doc, tab "UPDATED Cold Email (+ Reminder Emails, Follow up Emails)" (read 19 Sep 2026).
