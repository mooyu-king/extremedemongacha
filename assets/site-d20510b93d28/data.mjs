export const domain = 'https://extremedemongacha.games';
export const gameUrl = 'https://gdgacha.com/embed/extreme-demon-gacha';
export const snapshotDate = 'November 26, 2026';
export const labRules = { slots: 3, foil: 0.08 };
export const videoIds = ['k9Z5jFv1To0', 'syJakw4GhK4'];
const slug = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');

export const tiers = [
  { name: 'Common', slots: 24, weight: 60, score: 10 },
  { name: 'Rare', slots: 12, weight: 27, score: 30 },
  { name: 'Epic', slots: 8, weight: 10, score: 80 },
  { name: 'Legendary', slots: 4, weight: 3, score: 200 },
];

const themes = [
  ['Prism', [
    ['Glass Shard', 'A clear first discovery for the Prism shelf.'],
    ['Lightspill', 'Pairs with Cloudglass in the bright half of the Prism set.'],
    ['Cloudglass', 'An opaque foil is easy to compare against the matte print.'],
    ['Spectral Dust', 'A common that helps verify the missing-only filter.'],
    ['Quiet Lens', 'One of six common prints in the Prism theme.'],
    ['Color Drift', 'Its foil counts toward both the Prism theme and the foil checklist.'],
    ['Split Ray', 'One of three Prism rares needed for a full theme.'],
    ['Mirror Node', 'A good rarity to track when Prism commons are already complete.'],
    ['Window of Ice', 'Check both versions before counting this rare as fully collected.'],
    ['Iris Chamber', 'One of two Prism epics and a separate discovery from Deep Spectrum.'],
    ['Deep Spectrum', 'The dark counterpart to Iris Chamber on the Prism shelf.'],
    ['Apex Prism', 'The rarest tier in this theme and the inspiration for the Lab emblem.'],
  ]],
  ['Ember', [
    ['Cinder Thread', 'Start an Ember checklist with this card or any of the other five Ember commons.'],
    ['Sparks Below', 'This card can check off both your first Ember entry and one foil if its first draw is a foil.'],
    ['Hearthstone', 'The warm center of the six Ember commons.'],
    ['Coal Bloom', 'Shares its palette with Hearthstone while remaining a separate discovery.'],
    ['Ash Signal', 'Check its copy count if it appears twice in the same pack.'],
    ['Fired Clay', 'A late missing common can finish the Ember theme as decisively as a Legendary.'],
    ['Copper Flare', 'Pursue this rare after the six common Ember slots are filled.'],
    ['Kiln Echo', 'Add it separately from Copper Flare and Brass Engine when tracking the three Ember rares.'],
    ['Brass Engine', 'The third Ember rare, distinct from Copper Flare and Kiln Echo.'],
    ['Crucible Light', 'One of two Ember epics. Use the either-finish setting when it is still missing.'],
    ['Solar Cinder', 'Completes the Ember epic pair when Crucible Light is already owned.'],
    ['Last Furnace', 'The Legendary anchor for a complete Ember theme.'],
  ]],
  ['Tide', [
    ['Blue Current', 'An early Tide discovery when pursuing a distinct-card completion goal.'],
    ['Salt Pearl', 'Start at the Tide filter to distinguish it from the Prism cards with similar names.'],
    ['Kelp Trace', 'Part of the common Tide group, even when found as a foil.'],
    ['Low Water', 'A first print contributes to both collection and Tide progress.'],
    ['Tideglass', 'Track Tideglass in the Tide theme and Quiet Lens as a separate Prism card.'],
    ['Anchor Mark', 'A late missing common can still be the final card in your set.'],
    ['Storm Pool', 'One of three Tide rares to track once the commons are filled.'],
    ['Sounding Line', 'Sounding Line is a separate Tide rare from Storm Pool and Moonwake.'],
    ['Moonwake', 'A rarer follow-up to Salt Pearl when filling the full Tide theme.'],
    ['Deep Meridian', 'One of two Tide epics and a separate target from Abyss Bloom.'],
    ['Abyss Bloom', 'Check it off separately from Deep Meridian in the Tide guide.'],
    ['Drowned Crown', 'The Legendary Tide print. Use the foil switch for the rarer finish.'],
  ]],
  ['Iron', [
    ['Forged Seed', 'A lower-rarity target for the first stages of an Iron theme run.'],
    ['Rivet Chain', 'A repeated Rivet Chain still counts once toward the Iron completion total.'],
    ['Ore Window', 'One of the six easy discoveries in the Iron theme.'],
    ['Grain of Steel', 'Switch to Foil Only to see the odds of upgrading this Iron common.'],
    ['Rail Token', 'A separate Iron entry alongside Rivet Chain.'],
    ['Slate Shield', 'Check Slate Shield alongside the other five Iron commons on the theme checklist.'],
    ['Cold Foundry', 'A separate checklist entry from the other Iron rares Bridge Torch and Piston Seal.'],
    ['Bridge Torch', 'A rare finish example for collectors following the Iron checklist.'],
    ['Piston Seal', 'One of three distinct Iron rares.'],
    ['Core Plate', 'An Iron epic with a larger first-copy score than the Iron rares.'],
    ['Clockwork Gate', 'Clockwork Gate finishes the Iron epic pair if Core Plate is already owned.'],
    ['Midnight Alloy', 'The Legendary finish for the Iron shelf and a long-term foil target.'],
  ]],
];

export const practiceCards = themes.flatMap(([theme, entries]) =>
  entries.map(([name, tip], index) => {
    const tier = tiers[index < 6 ? 0 : index < 9 ? 1 : index < 11 ? 2 : 3];
    const label = name.trim();
    return {
      id: slug(label),
      name: label,
      path: '/cards/' + slug(label) + '/',
      cover: '/assets/cards/lab/' + slug(label) + '.webp',
      clip: '/assets/cards/previews/' + slug(label) + '.mp4',
      theme,
      tier: tier.name,
      score: tier.score,
      probability: tier.weight / 100 / tier.slots,
      tip,
    };
  }),
);

export const originalTiers = [
  ["Apex","1",1,"0.00423%","10,000"],
  ["Mythic","2–10",9,"0.06846%","3,000–3,800"],
  ["Legendary","11–35",25,"0.29521%","1,000–1,300"],
  ["Epic","36–100",65,"1.20306%","300–380"],
  ["Rare","101–260",160,"4.65325%","100–130"],
  ["Uncommon","261–640",380,"17.66406%","30–38"],
  ["Common","641–1,638",998,"76.11173%","10–13"],
];

import { scheduledRows, releaseDay } from './release-state.mjs';

export { releaseDay };
const referenceRows = [
  ["reference-1","GRIEF","Apex",1,10000,0.00004232643098210776,"gB8slBPlOjc","Doggie",149992717,["High CPS","Nerve Control","Wave"],"matched"],
  ["reference-2","Artemis 13","Mythic",2,3800,0.00006947738991485234,"FgjOM0ef1N8","Zoink",148598469,["NONG","Timings","Overall"],"matched"],
  ["reference-3","Society","Mythic",3,3700,0.00007119694029351831,"3CoEaH1CM7o","wPopoff",127323087,["Nerve Control","Ship","Wave"],"matched"],
  ["reference-level-119544028","Thinking Space II","Mythic",4,3600,0.00007288316153501403,"CELNmHwln_c","Zoink",119544028,["Nerve Control","Ship","Wave"],"matched"],
  ["reference-5","Amethyst","Mythic",5,3500,0.00007453804968300653,"4lfkzz1VCbA","wPopoff",119550490,["Timings","Chokepoints","Wave"],"matched"],
  ["reference-6","Flamewall","Mythic",6,3400,0.00007616340677061414,"x4Io4zkWVRw","400",126242564,["Fast-Paced","Nerve Control","Overall"],"matched"],
  ["reference-7","Tidal Wave","Mythic",7,3300,0.00007776086636616102,"9fsZ014qB3s","Zoink",86407629,["Timings","Nerve Control","Wave"],"matched"],
  ["reference-level-142896409","Green Bullet","Mythic",8,3200,0.00007933191493906885,"JG-qcvVkZFw","Nickname",142896409,["Cube","Ship","Wave"],"matched"],
  ["reference-level-133175713","ORBIT","Mythic",9,3100,0.00008087790985392045,"QKcv8DkNPd0","Zoink",133175713,["Gimmicky","Nerve Control","Cube"],"matched"],
  ["reference-level-144988390","Antarctic Lights","Mythic",10,3000,0.00008240009462216882,"Uue4ZRhVf-I","Axinity",144988390,["Circles","High CPS","Wave"],"matched"],
  ["reference-11","Nullscapes","Legendary",11,1300,0.0000943870633947844,"EztneTPp5CU","Zoink",109780665,["Learny","Slow-Paced","Robot"],"matched"],
  ["reference-level-117692518","Quanteuse processing","Legendary",12,1200,0.00009604970400408741,"j5NC0u1Q91Q","Zoink",117692518,["Gimmicky","Slow-Paced","Wave"],"official"],
  ["reference-level-110816181","BOOBAWAMBA","Legendary",13,1200,0.00009768912276004469,"20fYiqLAo_E","EastShark",110816181,["Gimmicky","Nerve Control","Ship"],"matched"],
  ["reference-level-135661111","The Bloop","Legendary",14,1200,0.00009930633340423667,"ROuXHSKEhHA","Zoink",135661111,["Chokepoints","Nerve Control","Wave"],"matched"],
  ["reference-level-62912799","Ashley Wave Trials","Legendary",16,1200,0.00010247782945012614,"aTxt76U3e2Q","Zoink",62912799,["High CPS","Nerve Control","Wave"],"matched"],
  ["reference-level-4125776","Silent clubstep","Legendary",17,1200,0.00010403380692847102,"GR4OMkS3SN8","paqoe",4125776,["Mirror","Cube","Ship"],"matched"],
  ["reference-27","Acheron","Legendary",27,1100,0.00013184839734442096,"sBKR6aUorzA","Zoink",73667628,["Chokepoints","Unbalanced","Ship"],"matched"],
  ["reference-36","cognitohazard","Epic",36,380,0.00014518590236783222,"T5g0r16X_ZA","Whizkid05",130891319,["Gimmicky","Duals","Overall"],"official"],
  ["reference-level-93917076","The Lightning Rod","Epic",37,370,0.00014660615505669266,"nQDTi077O6M","lavatrex",93917076,["Gimmicky","Ship","Overall"],"official"],
  ["reference-level-48991380","Maniacal Chains","Epic",38,370,0.00014801523866888084,"TzeMJeIu6bY","spcreat",48991380,["Wave","Old Swing","Duals"],"official"],
  ["reference-level-27690100","Slaughterhouse","Epic",39,370,0.0001494134313785904,"kpcF1-QAHQc","Doggie",27690100,["Nerve Control","Cube","Wave"],"matched"],
  ["reference-level-113599729","Subterminal Point","Epic",40,370,0.0001508009998511043,"h2wmRMgACH4","PoCle",113599729,["Slow-Paced","Ship","Wave"],"official"],
  ["reference-level-87665224","KOCMOC","Epic",41,370,0.00015217819990219264,"2CxE-UWCIG4","Zoink",87665224,["Nerve Control","Cube","Wave"],"official"],
  ["reference-101","Coalescence","Rare",101,130,0.00022179563098316342,"do-a2EzZ4R8","Amplitron",108708033,["Flow","Wave","Overall"],"official"],
  ["reference-level-96083028","Midnight","Rare",102,120,0.00022280192571155424,"NhkN_a9cNi8","nei",96083028,["Fast-Paced","Chokepoints","High CPS"],"official"],
  ["reference-level-133489881","Doppler (Solo)","Rare",103,120,0.00022380451548338428,"xSP43i61SLM","Danieljgd",133489881,["Ship","Wave","Overall"],"official"],
  ["reference-level-93340783","Cimmerian Shade","Rare",104,120,0.0002248034438961349,"lUNvV1k19HA","spcreat",93340783,["Timings","Chokepoints","Wave"],"official"],
  ["reference-level-103925676","PSYCHOPATH (DeniPol)","Rare",105,120,0.00022579875368742075,"1luL7tTE8p8","BONN GD",103925676,["Chokepoints","High CPS","Overall"],"official"],
  ["reference-level-125788781","TrakineS","Rare",106,120,0.00022679048675868033,"oKuoI-_JzKU","mariner",125788781,["Cube","Wave","Overall"],"official"],
  ["reference-261","BarbarosFinaleFinale","Uncommon",261,38,0.0003525409003121029,"F32ekXnS3a4","aeonair",102712028,["Bossfight","Ship","Wave"],"official"],
  ["reference-level-112351854","Sank","Uncommon",262,37,0.0003532303754211322,"6ZuEWp1dJ0c","Water",112351854,["Chokepoints","Gimmicky","Cube"],"official"],
  ["reference-level-60870688","Asterios","Uncommon",263,37,0.0003539187511784767,"YG3taML8WjA","Atomic",60870688,["Learny","Duals","Overall"],"official"],
  ["reference-level-42584142","Bloodlust","Uncommon",264,37,0.0003546060332124047,"5SzKetF2btw","knobbelboy",42584142,["Nerve Control","Ship","Overall"],"matched"],
  ["reference-level-90420966","Escape Room","Uncommon",265,37,0.00035529222710266886,"2Z-7Yscs62c","MiniShoey",90420966,["Overall","Cube","Nerve Control"],"official"],
  ["reference-level-99692910","Moving Forward","Uncommon",266,37,0.00035597733838109295,"nd6pOSWqS2g","-",99692910,["Gimmicky","Nerve Control","Overall"],"official"],
  ["reference-level-81548163","The Sulphur Sea","Common",641,13,0.0005643283080212601,"wz8XcDMDKhY","YoReid",81548163,["Cube","Ship","Overall"],"official"],
  ["reference-level-127868119","Bordon Factory","Common",642,12,0.0005647977104344437,"1C8WLzwWnwY","Bordonn",127868119,["Gimmicky","Bossfight","Nerve Control"],"official"],
  ["reference-641","Hatred","Common",643,12,0.0005652667938757128,"mq5-I5UXZrQ","guillester",27580467,["Cube","Ball","Wave"],"official"],
  ["reference-level-48329084","Breakout Redux","Common",644,12,0.0005657355590424316,"05f7fa5Myqk","Waivve",48329084,["Ship","Duals","Overall"],"official"],
  ["reference-level-106481162","GREAT FURY OF HEAVEN","Common",645,12,0.0005662040066293928,"meoW_VVPtco","androgyny",106481162,["High CPS","Wave","Overall"],"official"],
  ["reference-level-59829005","Galactic Shift","Common",646,12,0.0005666721373288297,"dLNWdSG3_o0","jbmoon",59829005,["Chokepoints","Learny","Overall"],"official"],
  ["reference-1630","DOUBLE DYNAMO (2P)","Common",1638,10,0.0009358204313969071,"5gf38BGDjpE","Hypno",144845980,["Unbalanced","Ship","New Swing"],"official"],
  ["reference-level-115370944","ANNIHILATED","Limited",null,null,0,"L4HnvBgPFyc","Zyraa",115370944,["Clicksync","Timings","Duals"],"official"],
];

export const referenceEntries = [...referenceRows, ...scheduledRows].map(([id, name, tier, rank, score, probability, verificationId, verifier, levelId, tags, videoSource, routeSlug = slug(name), clip]) => ({
  id, name, tier, rank, score, probability, verificationId, verifier, levelId, tags, videoSource, clip,
  path: '/cards/' + routeSlug + '/', cover: '/assets/cards/reference/' + routeSlug + '.webp',
})).sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity));

export const referenceCards = referenceEntries.filter(card => card.rank !== null)
  .map(({ rank, name, tier, score, probability }) => [rank, name, tier, score, probability]);

export function probabilityInPacks(probability, slots, packs) {
  if (probability === 0) return 0;
  return -Math.expm1(slots * packs * Math.log1p(-probability));
}
