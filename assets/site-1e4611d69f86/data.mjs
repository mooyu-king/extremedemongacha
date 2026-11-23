export const domain = 'https://extremedemongacha.games';
export const gameUrl = 'https://gdgacha.com/embed/extreme-demon-gacha';
export const snapshotDate = 'November 23, 2026';
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
  ['Apex', '1', 1, '0.00426%', '10,000'],
  ['Mythic', '2–10', 9, '0.06898%', '3,000–3,800'],
  ['Legendary', '11–35', 25, '0.29743%', '1,000–1,300'],
  ['Epic', '36–100', 65, '1.21212%', '300–380'],
  ['Rare', '101–260', 160, '4.68831%', '100–130'],
  ['Uncommon', '261–640', 380, '17.79714%', '30–38'],
  ['Common', '641–1,630', 990, '75.93175%', '10–13'],
];

export const referenceCards = [
  [1, 'GRIEF', 'Apex', 10000, 0.00004264532699576505],
  [2, 'Artemis 13', 'Mythic', 3800, 0.00007000084682272454],
  [3, 'Society', 'Mythic', 3700, 0.00007173335264668357],
  [5, 'Amethyst', 'Mythic', 3500, 0.00007509963463969111],
  [6, 'Flamewall', 'Mythic', 3400, 0.00007673723750101459],
  [7, 'Tidal Wave', 'Mythic', 3300, 0.00007834673268484944],
  [11, 'Nullscapes', 'Legendary', 1300, 0.0000950981948925036],
  [27, 'Acheron', 'Legendary', 1100, 0.0001328417702167525],
  [36, 'cognitohazard', 'Epic', 380, 0.000146279762739001],
  [101, 'Coalescence', 'Rare', 130, 0.00022346668476506707],
  [261, 'BarbarosFinaleFinale', 'Uncommon', 38, 0.00035519701577357913],
  [641, 'Hatred', 'Common', 13, 0.0005685800732574553],
  [1630, 'DOUBLE DYNAMO (2P)', 'Common', 10, 0.0009403661805674784],
];

const referenceVideos = {
  "GRIEF": ["gB8slBPlOjc", "Doggie", 149992717],
  "Artemis 13": ["FgjOM0ef1N8", "Zoink", 148598469],
  "Society": ["3CoEaH1CM7o", "wPopoff", 127323087],
  "Amethyst": ["4lfkzz1VCbA", "wPopoff", 119550490],
  "Flamewall": ["x4Io4zkWVRw", "400", 126242564],
  "Tidal Wave": ["9fsZ014qB3s", "Zoink", 86407629],
  "Nullscapes": ["EztneTPp5CU", "Zoink", 109780665],
  "Acheron": ["sBKR6aUorzA", "Zoink", 73667628],
  "cognitohazard": ["T5g0r16X_ZA", "Whizkid05", 130891319],
  "Coalescence": ["do-a2EzZ4R8", "Amplitron", 108708033],
  "BarbarosFinaleFinale": ["F32ekXnS3a4", "aeonair", 102712028],
  "Hatred": ["mq5-I5UXZrQ", "guillester", 27580467],
  "DOUBLE DYNAMO (2P)": ["5gf38BGDjpE", "Hypno", 144845980],
};

export const referenceEntries = referenceCards.map(([rank, name, tier, score, probability]) => {
  const [verificationId, verifier, levelId] = referenceVideos[name];
  return {
    id: 'reference-' + rank, rank, name, tier, score, probability, verificationId, verifier, levelId,
    path: '/cards/' + slug(name) + '/', cover: '/assets/cards/reference/' + slug(name) + '.webp',
  };
});

export function probabilityInPacks(probability, slots, packs) {
  if (probability === 0) return 0;
  return -Math.expm1(slots * packs * Math.log1p(-probability));
}
