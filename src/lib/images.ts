// Launch photography (Unsplash or Pexels License, see public/images/CREDITS.md). These are stock placeholders,
// not Epoch riders: alt text describes the scene only. Replace with owned photography (L13).
import mtbBlur from "../assets/img/mtb-blur.jpg";
import mtbCharge from "../assets/img/mtb-charge.jpg";
import mtbEnduroRocks from "../assets/img/mtb-enduro-rocks.jpg";
import mtbForestCharge from "../assets/img/mtb-forest-charge.jpg";
import mtbJumpSun from "../assets/img/mtb-jump-sun.jpg";
import mtbRidge from "../assets/img/mtb-ridge-silhouette.jpg";
import crewSilhouette from "../assets/img/crew-silhouette.jpg";
import crewRegroup from "../assets/img/crew-regroup.jpg";
import crewSingletrack from "../assets/img/crew-singletrack.jpg";
import crewRest from "../assets/img/crew-rest.jpg";
import mtbFogJump from "../assets/img/mtb-fog-jump.jpg";
import mtbBlurJump from "../assets/img/mtb-blur-jump.jpg";
import mtbDustyRace from "../assets/img/mtb-dusty-race.jpg";
import mtbMountain from "../assets/img/mtb-mountain-trail.jpg";
import gravelRoad from "../assets/img/gravel-road.jpg";
import gravelDescent from "../assets/img/gravel-descent.jpg";
import gravelMotion from "../assets/img/gravel-motion.jpg";
import gravelDawn from "../assets/img/gravel-dawn.jpg";
import roadPeloton from "../assets/img/road-peloton.jpg";
import roadCrit from "../assets/img/road-crit-blur.jpg";
import roadSprint from "../assets/img/road-sprint.jpg";
import roadDawn from "../assets/img/road-dawn-group.jpg";
import fuelTrail from "../assets/img/fuel-bottle-trail.jpg";
import fuelCage from "../assets/img/fuel-bottle-cage.jpg";
import trailheadSunset from "../assets/img/trailhead-sunset.jpg";
import mtbChargeWide from "../assets/img/mtb-charge-wide.jpg";
import gravelDescentWide from "../assets/img/gravel-descent-wide.jpg";
// Saved from Epoch Health System for Epoch MTB ("Find your edge.", see docs/saved/find-your-edge.md).
import mtbDownhillToward from "../assets/img/mtb-downhill-toward-camera.jpg";
import mtbBermRoost from "../assets/img/mtb-berm-roost.jpg";

export const IMG = {
  mtbBlur: { src: mtbBlur, alt: "Black-and-white panning shot of a mountain biker at speed, the forest a blur behind" },
  mtbCharge: { src: mtbCharge, alt: "Two downhill riders in full-face helmets charging down a forest trail toward the camera" },
  mtbEnduroRocks: { src: mtbEnduroRocks, alt: "Enduro rider picking a line through rocks and roots on a steep descent" },
  mtbForestCharge: { src: mtbForestCharge, alt: "Rider standing on the pedals through a sunlit pine forest" },
  mtbJumpSun: { src: mtbJumpSun, alt: "Mountain biker in the air off a forest jump, sun flaring through the trees" },
  mtbRidge: { src: mtbRidge, alt: "Silhouette of a mountain biker on a ridge under a big sky" },
  crewSilhouette: { src: crewSilhouette, alt: "A line of riders carrying bikes across a hilltop, silhouetted against storm clouds" },
  crewRegroup: { src: crewRegroup, alt: "Three riders stopped at a trail overlook in the mountains" },
  crewSingletrack: { src: crewSingletrack, alt: "A group of riders strung out along a narrow forest singletrack" },
  crewRest: { src: crewRest, alt: "Riders paused on a grassy trail with their bikes" },
  mtbFogJump: { src: mtbFogJump, alt: "Rider jumping through fog in a dark forest, in black and white" },
  mtbBlurJump: { src: mtbBlurJump, alt: "Black-and-white motion blur of a rider airborne off a jump" },
  mtbDustyRace: { src: mtbDustyRace, alt: "Cross-country racer with a number plate on a dusty dirt course" },
  mtbMountain: { src: mtbMountain, alt: "Rider on a ridgeline trail below a snowy peak" },
  gravelRoad: { src: gravelRoad, alt: "Two riders on a long, straight gravel road through dry grass" },
  gravelDescent: { src: gravelDescent, alt: "Rider descending a winding dirt road on a mountainside" },
  gravelMotion: { src: gravelMotion, alt: "Gravel rider leaning into a dirt corner with motion blur" },
  gravelDawn: { src: gravelDawn, alt: "Lone rider on a misty road at dawn beside tall pines" },
  roadPeloton: { src: roadPeloton, alt: "A tight road race peloton leaning through a corner" },
  roadCrit: { src: roadCrit, alt: "Road racers streaking through a corner in a motion blur" },
  roadSprint: { src: roadSprint, alt: "Road racers sprinting down a city street lined with fans" },
  roadDawn: { src: roadDawn, alt: "Three road riders on a quiet road at sunrise" },
  fuelTrail: { src: fuelTrail, alt: "A bottle and helmet resting on a dirt trail in the shade" },
  fuelCage: { src: fuelCage, alt: "Close-up of a rider's hands on the bars with a bottle in the cage" },
  mtbChargeWide: { src: mtbChargeWide, alt: "Two downhill riders in full-face helmets charging down a forest trail toward the camera" },
  gravelDescentWide: { src: gravelDescentWide, alt: "Rider descending a winding dirt road on a mountainside" },
  trailheadSunset: { src: trailheadSunset, alt: "Rider silhouetted with a bike against a sunset sky" },
  mtbDownhillToward: { src: mtbDownhillToward, alt: "Downhill rider in a full-face helmet charging down a rocky course toward the camera" },
  mtbBermRoost: { src: mtbBermRoost, alt: "Mountain biker carving a forest berm, throwing up a spray of dirt" },
} as const;
export type ImgKey = keyof typeof IMG;
