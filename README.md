# Devananth & Madhumithra

A Tamil wedding invitation built with React, TypeScript, and Vite. The supplied gopuram photograph opens with layered tree foliage. Scrolling moves the temple and foliage at different speeds while a stone-courtyard invitation panel rises into view. The celebration venue, calendar controls, and menu card appear immediately over the supplied courtyard photograph in a cream-and-gold section with normal scrolling, followed by guest photo sharing. The standalone wedding, "Meet us here" map, and final quote/closing sections have been removed.

The supplied images are copied into `public/images/` as `gopuram.jpg`, `temple-trees.avif`, and `temple-courtyard.jpg`; the original attachments are unchanged. These replace the generated temple, trees, and ornamental arch. The tree image's white sky blends into the scene using multiply compositing, not a transparent-background cutout. The landscape courtyard image is cropped responsively around a readable cream invitation panel. The recording guides the visual sequence and scroll choreography rather than serving as an embedded video. The previous `public/wedding-film.mp4` is no longer loaded by the page.

Reduced-motion users see the temple, invitation, and event details in normal document flow without parallax or pinned scrolling. The additional tree layer is hidden in that mode. Keyboard users can skip directly to the invitation details. Background imagery is decorative; names, headings, dates, links, and venue details remain selectable, accessible HTML.

The pinned opening scene fills the dynamic viewport as mobile browser controls expand or collapse. The invitation arch fills that scene, with a cream background behind the scroll journey to avoid exposed blue strips.

The page loads locally processed `-smooth.jpg` versions of all three images: gopuram at 1620 × 2448, courtyard at 2160 × 1440, and trees at 1972 × 2960. Each uses noise reduction and gentle smoothing before a 4× Lanczos upscale, with a soft finishing pass and JPEG quality 95. No sharpening is applied; originals remain unchanged. Dotted texture overlays on the invitation and celebration backgrounds have also been removed. Smoothing reduces grain and harsh edges but cannot reconstruct missing photographic detail, and can soften fine sculpture details. Higher-resolution originals are still recommended for truly sharp large-screen imagery.

## Run

```sh
npm install
npm run dev
```

Run `npm run build` for a production build and `npm run lint` for lint checks.

## Invitation Details

Content follows the supplied invitation: S. Devananth and A. Madhumithra, reception on 15 November 2026 from 7 p.m., wedding on 16 November from 6 to 7:30 a.m., at Ananda Thirumana Maligai, Chrompet, Chennai, opposite Chrompet Railway Station. The map and QR use the same venue query; verify the Google Maps result before sharing.

The scratch-date screen uses cream, gold, and muted green to complement the preceding courtyard. When the revealed countdown reaches zero, a non-interactive screen-wide fireworks display runs once for nine seconds; guests revealing the date after the start also see the celebration. Reduced-motion users receive a static celebration message instead. Existing calendar event UIDs are intentionally preserved so corrected names do not create new event identities on re-import.

The scratch card uses a compact landscape proportion with tighter spacing between labels, dates, and times. Its content determines the minimum height on narrow screens so neither event is clipped.

Each date has a decorative illustration beneath the scratch coating: glasses for the reception and a kalash, coconut, and garland for the wedding. Local PNG copies preserve the supplied originals; the wedding copy trims and cleans the curtain edge, and both copies receive gentle sharpening. Each illustration sits between the event heading and date, with multiply blending and feathered edges to merge into the card background. The illustrations reveal with the dates, and the card grows with its content while retaining the two-column partition.

The second-page invitation arch fills most of the screen, with 4% top and bottom margins and a wider panel capped at 900px. The blessing, calligraphic names, and invitation copy are distributed evenly down the arch, with minimum gaps preserved on shorter screens. Reduced-motion users get the same spacious arch in normal document flow.

The supplied wedding-couple illustration fills the background of the "We invite you" page, behind a soft cream overlay and a 90%-opaque cream arch panel with dark lettering for text contrast. It is not repeated beneath the names. The original attachment is unchanged, and the local image path stays in `src/App.tsx`. Other sections retain their courtyard backgrounds.

Four selected quotes appear throughout the invitation: the playful "Shit just got real..." announcement above the family blessing, "We arrived as two stories..." above the scratch card, "Before we knew each other..." above the celebration venue, and an attributed excerpt from Shakespeare's *Sonnet 116* beneath the photo-sharing heading. The first three are original invitation wording, without literary attribution; only the Shakespeare excerpt carries an author and work credit. All quote content stays in `src/App.tsx`.

The standalone date-discovery screen follows the opening temple and "We invite you" arch, then leads directly to the reception. The separate "A joyful beginning" family invitation and "THE PROMISE" divider have been removed; the promise wording remains inside the invitation arch. Its gold scratch card reveals reception and wedding dates and times side by side, separated by a vertical gold partition, using the same event data as the calendars. Both dates and the countdown reveal immediately when at least 40% of the coating is erased, even during an active stroke. Mouse, pen, and touch are supported; a visible reveal button provides a keyboard and non-scratching alternative. The countdown appears only after revealing, targets 15 November 2026 at 7 p.m. IST using the same start timestamp as the calendar, and stops at zero when the reception begins. Reveal state resets on reload. Earlier sections omit dates and times; reception, wedding, and calendar details remain available afterward.

Directions, the QR code, and calendar event URLs use the supplied [Google Maps venue link](https://maps.app.goo.gl/nuSJ6EEz5AziMPAh7?g_st=ac). The reception retains its address, directions link, and QR code; there is no embedded map. The calendar controls retain both reception and wedding dates.

The Google and Apple calendar controls sit below the venue directions and map QR in the celebration section. The navigation's "Save the date" link points directly to these controls. The "Add both dates to Google Calendar" button expands an accessible, keyboard-operable panel with separate reception and wedding event links. Guests must open and save each draft; one Google template link cannot create two events. The Apple-compatible `.ics` includes both events, each with alerts one day and two hours before. Vite generates this real calendar file from the exported calendar content in `src/App.tsx` during the build and serves it dynamically in development. The Apple link opens the file normally instead of using a `data:` URL or forcing a download, allowing Safari to hand it to Calendar. Guests must confirm/import the events (Add All); if Safari downloads the file, open it from Downloads to import. Guests must also enable calendar notifications. Google uses the guest's calendar reminder settings; a template URL cannot prescribe them. Mobile calendar imports and notification delivery require real-device testing.

The celebration menu card below the calendar controls contains a horizontal, swipeable carousel: reception dinner, morning tiffin, and afternoon lunch. Previous/next buttons also navigate the three images, with a visible slide counter and no autoplay. Tapping an image opens a modal viewer with 100–300% zoom controls and scrollable detail. Two-finger pinching zooms continuously within those limits, anchored to the fingers' midpoint. A single-finger swipe or mouse/pen drag pans the image in both directions using pointer capture. Native touch gestures are replaced only within the image viewport, including at 100% so pinching can start there; the rest of the page retains its normal behavior. Zoom buttons, arrow keys, and scrollbars remain available; Escape or the close button dismisses the viewer and returns focus. Reduced-motion users navigate without smooth scrolling. Supplied menu images are copied unchanged into `public/images/menu-*.jpeg`, retaining the catering credits; menu labels, event dates, and image paths live in `src/App.tsx`. The menu placeholder QR has been removed; venue and photo-sharing QRs are unchanged.

The invitation does not specify a reception end time. The calendar uses 10 p.m. as an assumed end; adjust the reception entry in `src/App.tsx` if needed. Calendar timestamps use UTC, with Google links displaying Asia/Kolkata time.

The three supplied images have no author or license metadata provided with the attachments. Confirm permission to publish them and add any required credits before sharing the invitation publicly. The previously attributed Vinayaraj photograph was removed with the family-details section, so its footer credit is no longer displayed.

The celebration card shows only the shared venue, directions, and QR code, without dates or times. Its heading and venue are always visible; it has no pinned scroll reveal or hidden-content transition. Reception and wedding dates remain side by side in the scratch card and available in the calendar section. The scratch-date, celebration, and calendar sections use coordinated cream-and-gold backgrounds with muted-green accents; the opening retains its supplied temple and foliage photographs.

## Guest photos and videos

The "Little moments. Forever memories." section follows the celebration details and is now the final section. It uses the supplied courtyard photograph beneath a softened cream-and-gold overlay, matching the other pages while preserving readable text and QR contrast. Its gold-framed QR code, clickable QR frame, and "Share your moments" button use the same `momentsUrl` in `src/App.tsx`, pointing to the supplied Google Drive folder. The invitation does not upload or access photos itself.

Before sharing publicly, verify the folder's sharing permissions with a separate guest account and test an upload on a phone. A folder link alone does not grant upload access; guests may need to sign in and have editor permission. Google Drive editor access can also allow changes or deletion of shared content. Review access and keep backups; use a dedicated upload-collection service if upload-only access is required.

## Design files

The invitation arch uses the supplied `public/images/lord-ganesha.png` above the family blessing. Its visible stock-image watermarks are preserved. Confirm licensing and supply an authorized watermark-free image before public distribution.
- `src/App.tsx` contains the invitation content, supplied image paths, and scroll-progress behavior.
- `src/App.css` contains page layout, responsive rules, and visual animation.
- `src/index.css` contains palette, typography, and global accessibility styles.

## Deploying to GitHub Pages

The site is published at https://devaccountdn.github.io/Devananth_Madhumithra_Invitation/.

- `vite.config.ts` sets `base: '/Devananth_Madhumithra_Invitation/'`; image paths in `src/App.tsx` use `import.meta.env.BASE_URL`. Update both if the repository is renamed.
- `.github/workflows/deploy.yml` runs `npm ci`, lint, and build on every push to `main` (or a manual run), then publishes `dist/`.
- One-time setup: in the repository's **Settings → Pages**, set **Source** to **GitHub Actions**.
- Check locally with `npm run build && npm run preview`, then open `http://localhost:4173/Devananth_Madhumithra_Invitation/`.
