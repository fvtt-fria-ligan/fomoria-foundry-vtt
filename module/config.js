export const FO = {};

FO.system = "fomoria";

FO.packs = {
  actors: "fomoria.fomoria-actors",
  items: "fomoria.fomoria-items",
  macros: "fomoria.fomoria-macros",
  tables: "fomoria.fomoria-tables"
};

FO.actorTypes = {
  character: "character",
  creature: "creature",
};

FO.itemTypes = {
  armor: "armor",
  boon: "boon",
  clan: "clan",
  condition: "condition",
  equipment: "equipment",
  expertise: "expertise",
  feat: "feat",
  folk: "folk",
  shield: "shield",
  tradition: "tradition",
  weapon: "weapon",
  weaponfeat: "weaponfeat",
};

FO.attackTypes = {
  melee: "melee",
  ranged: "ranged",
}

FO.attackTypeKeys = {
  melee: "FO.AttackTypeMelee",
  ranged: "FO.AttackTypeRanged",
}

FO.weaponTypes = {
  battleaxes: "battleaxes",
  maces: "maces",
  shortswords: "shortswords",
  daggers: "daggers",
  bows: "bows",
};

FO.featTypes = {
  expert: "expert",
  folk: "folk",
}

FO.armorTiers = {
  0: {
    tier: 0,
    key: "FO.ArmorTierNone",
    damageReductionDie: "1d0",
    agilityModifier: 0,
    defenseModifier: 0,
    strengthModifier: 0,
    toughnessModifier: 0,
    label: "-0",
  },
  1: {
    tier: 1,
    key: "FO.ArmorTierLight",
    damageReductionDie: "1d2",
    agilityModifier: 0,
    defenseModifier: 0,
    strengthModifier: 0,
    toughnessModifier: 0,
    label: "-d2",
  },
  2: {
    tier: 2,
    key: "FO.ArmorTierMedium",
    damageReductionDie: "1d4",
    agilityModifier: 0,
    defenseModifier: 0,
    strengthModifier: 0,
    toughnessModifier: 0,
    label: "-d4",
  },
  3: {
    tier: 3,
    key: "FO.ArmorTierHeavy",
    damageReductionDie: "1d6",
    agilityModifier: 2,
    defenseModifier: 2,
    strengthModifier: 0,
    toughnessModifier: 0,
    label: "-d6",
  },
};

// TODO: use this in combat-tab.html
FO.armorTiersList = [FO.armorTiers[0], FO.armorTiers[1], 
  FO.armorTiers[2], FO.armorTiers[3]];

FO.flagScope = FO.system;
FO.flags = {
  ATTACK_DR: "attackDR",
  DAMAGE_DEALT_TO: "damageDealtTo",
  DEFEND_DR: "defendDR",
  INCOMING_ATTACK: "incomingAttack",
  TARGET_ARMOR: "targetArmor",
};

// Config variables for the Scvmfactory character generator
FO.scvmFactory = {
  // Directory under Foundry data to pull character portraits from.
  characterPortraitPath: "systems/fomoria/assets/images/portraits/characters/",
  // Directory under Foundry data to pull Creature portraits from.
  creaturePortraitPath: "systems/fomoria/assets/images/portraits/characters/",
  // Character Names
  namesTable: "Compendium.fomoria.fomoria-tables.RollTable.lWQNFZ99gjXNuElZ",
  // Boons
  boonsTable: "Compendium.fomoria.fomoria-tables.RollTable.NwthVwRcvLnnCtZ",
  startingItems: [
    // Cheap clothes
    "Compendium.fomoria.fomoria-items.Item.OYLg8DatbzysitFk",
    // Retinal Com Device
    "Compendium.fomoria.fomoria-items.Item.TYj1kPvCOsDmhuCA"
  ],
  startingEquipmentTables: [
    // Cash & Gear
    "Compendium.fomoria.fomoria-tables.RollTable.bnwWwzR5NSK10Khu",
    // Cash & Gear 2
    "Compendium.fomoria.fomoria-tables.RollTable.dto4J2Q64xPO9KUN",
    // Cash & Gear 3
    "Compendium.fomoria.fomoria-tables.RollTable.3IkCqQQq9dUxbOoQ",
  ],
  // Weapons
  startingWeaponTable: "Compendium.fomoria.fomoria-tables.RollTable.2ozvRk5I5vaUrMmc",
  // Armor
  startingArmorTable: "Compendium.fomoria.fomoria-tables.RollTable.SdPk5JLewSWsOQrU",
  descriptionTables: [
    {
      // Styles
      uuid: "Compendium.fomoria.fomoria-tables.RollTable.ynpJKCDgdCGSdLJU",
      formatKey: "FO.StyleFormat"
    },
    {
      // Features
      uuid: "Compendium.fomoria.fomoria-tables.RollTable.3PsUdFRUIe8Mm70T",
      formatKey: "FO.FeatureFormat"
    },
    {
      // Wants
      uuid: "Compendium.fomoria.fomoria-tables.RollTable.3tl4PxzDaQA4k7Uh",
      formatKey: "FO.WantFormat"
    },
    {
      // Quirks
      uuid: "Compendium.fomoria.fomoria-tables.RollTable.vGxWLOiH33ocmGrm",
      formatKey: "FO.QuirkFormat"
    },
    {
      // Obsessions
      uuid: "Compendium.fomoria.fomoria-tables.RollTable.QfLYSLzrDod9g6zq",
      formatKey: "FO.ObsessionFormat"
    },
  ],
  creatureDescriptionTables: [
    {
      // Roles
      uuid: "Compendium.fomoria.fomoria-tables.RollTable.wGLCXzoaFFYNy8Y4",
      formatKey: "FO.RoleFormat"
    },
    {
      // Styles
      uuid: "Compendium.fomoria.fomoria-tables.RollTable.ynpJKCDgdCGSdLJU",
      formatKey: "FO.StyleFormat"
    },
    {
      // Features
      uuid: "Compendium.fomoria.fomoria-tables.RollTable.3PsUdFRUIe8Mm70T",
      formatKey: "FO.FeatureFormat"
    },
    {
      // Obsessions
      uuid: "Compendium.fomoria.fomoria-tables.RollTable.QfLYSLzrDod9g6zq",
      formatKey: "FO.ObsessionFormat"
    },    
    {
      // Quirks
      uuid: "Compendium.fomoria.fomoria-tables.RollTable.vGxWLOiH33ocmGrm",
      formatKey: "FO.QuirkFormat"
    },
    {
      // "Wants
      uuid: "Compendium.fomoria.fomoria-tables.RollTable.3tl4PxzDaQA4k7Uh",
      formatKey: "FO.WantFormat"
    },
    {
      // Trinkets
      uuid: "Compendium.fomoria.fomoria-tables.RollTable.mLrq098IuxxbIbqP",
      formatKey: "FO.CarriesFormat",
      articalize: true
    },
  ],
  // modules wanting to add more character classes to the generator should append uuids to this list
  classUuids: [
    // Burned Hacker
    "Compendium.fomoria.fomoria-items.Item.hTC8FruS6zC1hQKs",
    // Classless Punk
    "Compendium.fomoria.fomoria-items.Item.mOR4y0KD1LElPUx7",
    // Discharged CorpKiller
    "Compendium.fomoria.fomoria-items.Item.buxwe4sUYRRC72dR",
    // Forsaken Gang-Goon
    "Compendium.fomoria.fomoria-items.Item.QBxOyQ9J8wVr9Wdj",
    // {Orphaned Gearhead
    "Compendium.fomoria.fomoria-items.Item.pWM7IpNXYXawvO5Y",
    // Renegade Cyberslasher
    "Compendium.fomoria.fomoria-items.Item.raLprLcqryAWsSkk",
    // Shunned Nanomancer
    "Compendium.fomoria.fomoria-items.Item.wE4c4OAHuQygwcFn"
  ],
};

FO.colorSchemes = {
  fomoria: {
    accent: "#656565",
    background: "#2E2E2E",
    cyberText: "#F8F800",
    disabled: "gray",
    foreground: "#D4D4D4",
    highlight: "#656565",
    windowBackground: "#2E2E2E",
  },  
}

FO.useBoonFumbleOn = 1;
FO.useBoonCritOn = 20;

FO.defaultFolk = "Compendium.fomoria.fomoria-items.Item.yWL4ljE4bezK1kRh";
FO.defaultTradition = "Compendium.fomoria.fomoria-items.Item.7Z7BhRgQE4bLDZJa";
FO.dizzyCondition = "Compendium.fomoria.fomoria-items.Item.s2uDlX2iI7chmOY9";
FO.direInjuriesTable = "Compendium.fomoria.fomoria-rollable-tables.RollTable.NtilgUYkLBSkrjWb";
FO.dismalBreakdownsTable = "Compendium.fomoria.fomoria-rollable-tables.RollTable.tkw733wQ0qnXHxL1";
FO.dreadCondition = "Compendium.fomoria.fomoria-items.Item.ZT9e0NPMuOUeb5cZ";
FO.deathCondition = "Compendium.fomoria.fomoria-items.Item.QtAO1o9e5H4YePPe";
