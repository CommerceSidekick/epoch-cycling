# Saved for Epoch MTB: "Find your edge."

The owner picked this as the mountain bike version of the Epoch Health System
Performance page header (2026-11-16). It stays off the general site, which now
uses a road group ride. It is saved here to reuse on this site. The /mtb page now uses the downhill rider in its "Find your edge." band (2026-11-16).

## The look

| Piece | Value |
|---|---|
| Headline | Find your edge. |
| Eyebrow on the general site | Personalized Health · Performance |
| Photo, first choice | `src/assets/img/mtb-downhill-toward-camera.jpg`, key `mtbDownhillToward`: a downhill rider charging a rocky course straight at the camera. Full-bleed hero, `object-position: 50% 35%` (share image `50% 8%`) |
| Photo, alternate | `src/assets/img/mtb-berm-roost.jpg`, key `mtbBermRoost`: a rider carving a forest berm with dirt flying. Hero `45% 45%` |
| Also saved | `src/assets/img/mtb-trail-toward-camera.jpg`, key `mtbTrailToward`: a trail rider coming down a rocky forest trail straight at the camera. Portrait (1600x2400); it was the fifth tall photo on the Epoch Health System home page, where the woman on the road bike replaced it |
| Share images, for reference | `docs/saved/find-your-edge-share.png` (downhill), `docs/saved/find-your-edge-share-berm.png` (berm) |

Usage: `<PageHero img="mtbDownhillToward" position="center 35%" ... >` or
`<Photo img="mtbBermRoost" ... />`.

## Copy on the general site

> We start with where you are today: an advanced blood panel, your training and
> your recovery. Then a coach and a physician-led team build a plan to optimize
> it, and keep adjusting it as you improve.

That paragraph describes a clinical program. Rewrite it for this site before
using it, because this site keeps clinical terms off its pages (check-copy C3
and C4) and sends health services to epochhealthsystem.com. Keep the headline.

## Where the full page lives

- Epoch Health System repo, branch `performance-photo`, with the downhill rider
  in the header: https://epoch-health-system-git-perfo-17e216-commercesidekicks-projects.vercel.app/personalized-health/performance
- The berm version was live on epoch-health-system.vercel.app until the road
  group ride replaced it. It is in that repo's history at commit `2c21f69`.

Photos are Pexels License stock placeholders (credited in
`public/images/CREDITS.md`). Replace them with owned photography before launch
(L13).
