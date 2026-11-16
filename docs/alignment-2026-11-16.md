# Epoch Cycling aligned with Epoch Health System (2026-11-16)

Owner direction. Both sites are concepts and should move together.

## The family

| Site | Role |
|---|---|
| Epoch Health System | The hub: the app, the program, Personalized Health (physician-led), supplements. Live concept: https://epoch-health-system.vercel.app |
| EpochMD | Clinical entity. Stays off marketing pages on every site. |
| Epoch Cycling (this site) | The umbrella for riders: Ride, Fuel, Optimize. |
| Epoch MTB | Gets its own dedicated site, with riding video and MTB-specific training. Until then it is /mtb here. |

All four domains are owned. epochcycling.com and epochhealthsystem.com still show parking pages, so `SITE.masterUrl` points at the live concept site until the domains move.

## Positioning

- Ride: cycling-specific, meaning the Riders Club, kit, events and the race deal.
- Fuel: the supplements. Same line as Epoch Health System: Epoch Endurance (a custom endurance mix of potassium, magnesium and OKG, not an electrolyte drink), Epoch Fuel (performance and recovery support) and Epoch Edge (focus and mental performance). There is no Salt, and none are on sale yet.
- Optimize: the Epoch program. That is The Health System (the free app), fitness and lifestyle coaching, and Personalized Health on Epoch Health System. For riders it starts with Performance Health and Optimization, "Find your edge."
- Brand look: performance athletes looking for an edge. Deep, dark, high-energy photography. No casual or commuter imagery.
- Accent: Summit blue, chosen to stay clear of Strava orange. No neon anywhere.

## What changed

- Products: Salt removed. Endurance, Fuel and Edge use Epoch Health System's descriptions, and all three are marked coming soon. Old Salt URLs redirect to Endurance.
- The EpochEdge service, "Epoch Total Health" and the peptide line are removed. The handoff now goes to Personalized Health at `/personalized-health/performance`.
- Coaching: "Fitness and lifestyle coaching" everywhere. No AI-coach line.
- Founders: CMO (credentials, name hidden), Errol and Lisle on /about, matching Epoch Health System.
- The announcement strip and both marquees are removed. The home stats use real counts. Empty events sections stay hidden.
- MTB: a "Mountain biking isn't road riding on dirt" section from `docs/research/mtb-vs-road.md`, a "Find your edge." band, and a route to the dedicated Epoch MTB site (`SITE.mtbSiteUrl`).
- Photos: casual crew and overlook shots are replaced with deeper performance shots (berm, downhill, trail rider). The jersey cuff stripe changed from lime to Summit.

## Next: the dedicated Epoch MTB site

1. Repo `epoch-mtb` (the owner creates it) and its own Vercel project on epochmtb.com.
2. Remove the epochmtb.com to /mtb redirect in `scripts/vercel-postbuild.mjs`, and set `SITE.mtbSiteUrl`.
3. Build it around video (licensed riding footage, then owned footage), the research brief, MTB training blocks, the crew and events.
