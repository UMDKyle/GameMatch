import { Game } from "@/types/game";

/**
 * Central game catalog used by the recommendation engine.
 * Images use placehold.co so the UI renders without real assets.
 * Swap in real cover art paths later by updating the `image` field.
 */
export const games: Game[] = [
  // ── Difficult / Souls-like ────────────────────────────────────────────────
  {
    id: "sekiro",
    name: "Sekiro: Shadows Die Twice",
    description:
      "A brutal, precise action game set in late Sengoku-era Japan. You play as a shinobi seeking revenge, mastering posture-breaking sword combat against relentless enemies.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Sekiro",
    tags: ["samurai", "difficult", "action", "single-player", "souls-like", "japanese", "stealth"],
    genres: ["Action"],
  },
  {
    id: "dark-souls-3",
    name: "Dark Souls III",
    description:
      "The pinnacle of the Soulsborne formula — a dark fantasy action RPG where every death teaches you something. Demanding combat, cryptic lore, and haunting level design.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Dark+Souls+III",
    tags: ["difficult", "souls-like", "dark-fantasy", "action", "rpg", "single-player", "atmospheric"],
    genres: ["Action RPG"],
  },
  {
    id: "elden-ring",
    name: "Elden Ring",
    description:
      "FromSoftware's open-world RPG masterpiece. Explore a vast, interconnected world filled with fearsome bosses, deep lore written by George R.R. Martin, and near-infinite build options.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Elden+Ring",
    tags: ["difficult", "open-world", "souls-like", "dark-fantasy", "rpg", "exploration", "single-player"],
    genres: ["Action RPG", "Open World"],
  },
  {
    id: "cuphead",
    name: "Cuphead",
    description:
      "A run-and-gun platformer styled after 1930s cartoons. Relentlessly difficult boss fights wrapped in stunning hand-drawn animation.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Cuphead",
    tags: ["difficult", "action", "platformer", "fast-paced", "single-player", "co-op"],
    genres: ["Platformer", "Run and Gun"],
  },

  // ── Samurai / Japanese-style ─────────────────────────────────────────────
  {
    id: "ghost-of-tsushima",
    name: "Ghost of Tsushima",
    description:
      "An open-world action adventure on Tsushima Island. Fluid katana combat, breathtaking landscapes, and an epic story of resistance against a Mongol invasion.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Ghost+of+Tsushima",
    tags: ["samurai", "open-world", "action", "single-player", "japanese", "stealth", "exploration"],
    genres: ["Action Adventure", "Open World"],
  },
  {
    id: "nioh-2",
    name: "Nioh 2",
    description:
      "A dark action RPG set in a supernatural feudal Japan. Deep combat stances and Yokai abilities combine with punishing Souls-like design and deep character builds.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Nioh+2",
    tags: ["samurai", "difficult", "souls-like", "action", "rpg", "japanese", "dark-fantasy", "single-player"],
    genres: ["Action RPG"],
  },
  {
    id: "katana-zero",
    name: "Katana ZERO",
    description:
      "A stylish neo-noir action platformer. Play as a samurai assassin who can slow time and deflect bullets, unraveling a conspiracy one level at a time.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Katana+ZERO",
    tags: ["samurai", "action", "fast-paced", "stealth", "platformer", "story-rich", "single-player"],
    genres: ["Action Platformer"],
  },
  {
    id: "trek-to-yomi",
    name: "Trek to Yomi",
    description:
      "A cinematic samurai tale rendered in stunning black-and-white. A swordsman journeys through the land of the dead to fulfill his duty in this atmospheric side-scroller.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Trek+to+Yomi",
    tags: ["samurai", "atmospheric", "action", "story-rich", "single-player", "japanese"],
    genres: ["Action Adventure"],
  },

  // ── Cozy / Farming ───────────────────────────────────────────────────────
  {
    id: "stardew-valley",
    name: "Stardew Valley",
    description:
      "Inherit your grandfather's old farm and build it into something wonderful. Farm, fish, mine, and forge relationships with the townspeople of Pelican Town.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Stardew+Valley",
    tags: ["farming", "relaxing", "co-op", "crafting", "exploration", "single-player"],
    genres: ["Simulation", "RPG"],
  },
  {
    id: "coral-island",
    name: "Coral Island",
    description:
      "A tropical farming sim where you restore a coral reef and build your dream island life. Diverse cast, beautiful art, and deep relationship systems.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Coral+Island",
    tags: ["farming", "relaxing", "co-op", "crafting", "single-player", "exploration"],
    genres: ["Simulation"],
  },
  {
    id: "spiritfarer",
    name: "Spiritfarer",
    description:
      "A cozy management game about dying. You play as Stella, a ferrymaster guiding spirits to the afterlife, forging heartfelt bonds along the way.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Spiritfarer",
    tags: ["relaxing", "story-rich", "co-op", "crafting", "atmospheric", "single-player"],
    genres: ["Simulation", "Adventure"],
  },
  {
    id: "garden-story",
    name: "Garden Story",
    description:
      "Play as Concord, a young grape protecting a village from The Rot. A gentle adventure game with light combat, crafting, and a warm community to nurture.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Garden+Story",
    tags: ["relaxing", "farming", "crafting", "action", "story-rich", "single-player"],
    genres: ["Adventure", "RPG"],
  },

  // ── Co-op ────────────────────────────────────────────────────────────────
  {
    id: "it-takes-two",
    name: "It Takes Two",
    description:
      "An inventive co-op platformer about a couple on the brink of divorce, magically shrunken into toy-sized versions of themselves. Every level introduces a completely new mechanic.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=It+Takes+Two",
    tags: ["co-op", "platformer", "story-rich", "action", "fast-paced"],
    genres: ["Platformer", "Action Adventure"],
  },
  {
    id: "deep-rock-galactic",
    name: "Deep Rock Galactic",
    description:
      "Space dwarves mine alien planets for profit. A beloved PvE co-op shooter with procedurally generated caves, bug hordes, and an iconic company salute.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Deep+Rock+Galactic",
    tags: ["co-op", "shooter", "sci-fi", "fast-paced", "exploration", "replayable"],
    genres: ["Shooter", "Co-op"],
  },
  {
    id: "a-way-out",
    name: "A Way Out",
    description:
      "A co-op only prison break story. Two players work together in a constantly split-screen experience, making choices that shape the outcome.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=A+Way+Out",
    tags: ["co-op", "story-rich", "action", "stealth"],
    genres: ["Action Adventure"],
  },
  {
    id: "valheim",
    name: "Valheim",
    description:
      "Build, explore, and survive in a procedurally generated Norse mythology world. Play solo or with friends to slay legendary beasts and earn Odin's favor.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Valheim",
    tags: ["survival", "crafting", "co-op", "exploration", "open-world", "fantasy", "single-player"],
    genres: ["Survival", "Open World"],
  },

  // ── Horror ───────────────────────────────────────────────────────────────
  {
    id: "phasmophobia",
    name: "Phasmophobia",
    description:
      "A cooperative paranormal investigation game. Use ghost-hunting equipment to identify the type of ghost haunting a location — before it hunts you.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Phasmophobia",
    tags: ["horror", "co-op", "atmospheric", "single-player", "stealth"],
    genres: ["Horror", "Co-op"],
  },
  {
    id: "alien-isolation",
    name: "Alien: Isolation",
    description:
      "A first-person survival horror game set fifteen years after the original Alien film. One near-perfect Xenomorph hunts you through a decaying space station.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Alien+Isolation",
    tags: ["horror", "sci-fi", "atmospheric", "stealth", "survival", "single-player"],
    genres: ["Survival Horror"],
  },
  {
    id: "resident-evil-village",
    name: "Resident Evil Village",
    description:
      "Ethan Winters searches for his kidnapped daughter through a dark European village. A tense mix of action and classic survival horror, with one of gaming's most iconic villains.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=RE+Village",
    tags: ["horror", "action", "atmospheric", "story-rich", "survival", "single-player"],
    genres: ["Survival Horror", "Action"],
  },
  {
    id: "dead-space-2023",
    name: "Dead Space (2023)",
    description:
      "A masterful remake of the sci-fi horror classic. Engineer Isaac Clarke fights through a nightmarish space station overrun by grotesque Necromorphs.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Dead+Space",
    tags: ["horror", "sci-fi", "atmospheric", "action", "survival", "single-player"],
    genres: ["Survival Horror", "Action"],
  },

  // ── Open World ───────────────────────────────────────────────────────────
  {
    id: "the-witcher-3",
    name: "The Witcher 3: Wild Hunt",
    description:
      "One of the greatest RPGs ever made. Play as Geralt of Rivia, a monster hunter navigating a war-ravaged open world filled with morally complex choices and unforgettable characters.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Witcher+3",
    tags: ["open-world", "fantasy", "rpg", "story-rich", "exploration", "action", "single-player"],
    genres: ["RPG", "Open World"],
  },
  {
    id: "red-dead-redemption-2",
    name: "Red Dead Redemption 2",
    description:
      "An epic tale of outlaw life in the twilight of the American Wild West. Stunning open world, deep story, and unmatched attention to detail.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=RDR2",
    tags: ["open-world", "story-rich", "action", "exploration", "atmospheric", "single-player"],
    genres: ["Action Adventure", "Open World"],
  },

  // ── Story-rich ───────────────────────────────────────────────────────────
  {
    id: "disco-elysium",
    name: "Disco Elysium",
    description:
      "An unprecedented RPG where every skill is a voice in your head. Play a failed detective piecing himself back together in a deeply political, literary city.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Disco+Elysium",
    tags: ["story-rich", "rpg", "atmospheric", "single-player", "exploration"],
    genres: ["RPG", "Point and Click"],
  },
  {
    id: "outer-wilds",
    name: "Outer Wilds",
    description:
      "A mystery box that rewards pure curiosity. Explore a handcrafted solar system trapped in a 22-minute time loop, uncovering an ancient civilization's fate.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Outer+Wilds",
    tags: ["story-rich", "exploration", "atmospheric", "sci-fi", "single-player", "puzzle"],
    genres: ["Adventure", "Mystery"],
  },
  {
    id: "celeste",
    name: "Celeste",
    description:
      "A platformer about climbing a mountain and confronting your inner demons. Precise controls, satisfying difficulty, and a deeply personal story about mental health.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Celeste",
    tags: ["platformer", "difficult", "story-rich", "fast-paced", "single-player"],
    genres: ["Platformer"],
  },

  // ── Roguelikes ───────────────────────────────────────────────────────────
  {
    id: "hades",
    name: "Hades",
    description:
      "Battle out of the Underworld in this rogue-like dungeon crawler. Each run builds on the last through a rich narrative and a god-tier upgrade system.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Hades",
    tags: ["roguelike", "action", "fast-paced", "replayable", "story-rich", "dark-fantasy", "single-player"],
    genres: ["Roguelike", "Action"],
  },
  {
    id: "dead-cells",
    name: "Dead Cells",
    description:
      "A brutally fast roguelite action-platformer set in a sprawling castle. No two runs are the same thanks to procedural levels and a massive arsenal of weapons.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Dead+Cells",
    tags: ["roguelike", "action", "difficult", "fast-paced", "replayable", "platformer", "single-player"],
    genres: ["Roguelite", "Platformer"],
  },
  {
    id: "slay-the-spire",
    name: "Slay the Spire",
    description:
      "A deck-building roguelike with endless strategic depth. Craft a powerful card deck, fight through procedural floors, and face a final boss that changes each run.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Slay+the+Spire",
    tags: ["roguelike", "replayable", "single-player", "fantasy", "puzzle"],
    genres: ["Roguelike", "Card Game"],
  },

  // ── Shooters ─────────────────────────────────────────────────────────────
  {
    id: "doom-eternal",
    name: "DOOM Eternal",
    description:
      "The Doom Slayer returns to rip and tear through demonic hordes at breakneck speed. A demanding combat puzzle disguised as an FPS — resource management has never been this violent.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=DOOM+Eternal",
    tags: ["shooter", "fast-paced", "difficult", "action", "single-player"],
    genres: ["FPS"],
  },
  {
    id: "titanfall-2",
    name: "Titanfall 2",
    description:
      "The most underrated FPS of its generation. Wall-running, mech-piloting gameplay with an unexpectedly great single-player campaign and silky-smooth multiplayer.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Titanfall+2",
    tags: ["shooter", "fast-paced", "action", "sci-fi", "story-rich", "single-player"],
    genres: ["FPS"],
  },
  {
    id: "borderlands-3",
    name: "Borderlands 3",
    description:
      "A looter-shooter on the wild frontier of space. Billions of procedurally generated guns, irreverent humor, and best enjoyed alongside friends.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Borderlands+3",
    tags: ["shooter", "co-op", "replayable", "sci-fi", "fast-paced", "exploration"],
    genres: ["Looter Shooter", "RPG"],
  },

  // ── Survival / Crafting ──────────────────────────────────────────────────
  {
    id: "subnautica",
    name: "Subnautica",
    description:
      "Survive and explore a stunning alien ocean after crash-landing on a water world. Build your base, discover strange creatures, and unravel the planet's dark secret.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=Subnautica",
    tags: ["survival", "crafting", "exploration", "atmospheric", "sci-fi", "single-player", "open-world"],
    genres: ["Survival", "Open World"],
  },
  {
    id: "the-forest",
    name: "The Forest",
    description:
      "Crash-land on a mysterious peninsula and build a shelter to survive cannibal attacks. A tense open-world survival horror with a gripping mystery underground.",
    image: "https://placehold.co/400x225/1c1917/f5f5f4?text=The+Forest",
    tags: ["survival", "crafting", "horror", "co-op", "open-world", "exploration", "single-player"],
    genres: ["Survival Horror", "Open World"],
  },
];

export default games;
