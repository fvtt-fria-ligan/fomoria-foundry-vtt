import { colorChoices } from "./colors.js";
import { FO } from "./config.js";
import { AllowedScvmClassesDialog } from "./generator/allowed-scvm-classes-dialog.js";

// TODO: DRY out below with this
const Settings = {
  allowedScvmClasses: "allowedScvmClasses",
  additionalAbilities: "additionalAbilities",
  colorScheme: "colorScheme",
  deleteZeroQuantity: "deleteZeroQuantity",
  hitAutomation: "hitAutomation",
  fontScheme: "fontScheme",
  lastScvmfactorySelection: "lastScvmfactorySelection",
  systemMigrationVersion: "systemMigrationVersion",
  trackAmmo: "trackAmmo",
  trackCarryingCapacity: "trackCarryingCapacity",
};

export const registerSystemSettings = () => {
  /** UI Color scheme */
  game.settings.register(FO.system, "colorScheme", {
    name: "FO.SettingsColorScheme",
    hint: "FO.SettingsColorSchemeHint",
    scope: "client",
    config: true,
    default: "fomoria",
    type: String,
    choices: colorChoices,
    onChange: () => {
      location.reload();
    },
  });

  /** Whether to keep track of carrying capacity */
  game.settings.register(FO.system, "trackCarryingCapacity", {
    name: "FO.SettingsApplyOvercapacityPenalty",
    hint: "FO.SettingsApplyOvercapacityPenaltyHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  /** Whether to show chat message ads */
  game.settings.register(FO.system, "showChatAds", {
    name: "FO.SettingsShowChatAds",
    hint: "FO.SettingsShowChatAdsHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => {
      location.reload();
    },
  });

  /** Delay between showing chat ads */
  game.settings.register(FO.system, "chatAdDelay", {
    name: "FO.SettingsChatAdDelay",
    hint: "FO.SettingsChatAdDelay",
    scope: "world",
    config: true,
    type: Number,
    default: 20,
    onChange: () => {
      location.reload();
    },
  });

  /** Whether to show popup ads */
  game.settings.register(FO.system, "showPopupAds", {
    name: "FO.SettingsShowPopupAds",
    hint: "FO.SettingsShowPopupAdsHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  /** Chance to show a popup ad */
  game.settings.register(FO.system, "popupAdChance", {
    name: "FO.SettingsPopupAdChance",
    hint: "FO.SettingsPopupAdChanceHint",
    scope: "world",
    config: true,
    type: Number,
    default: 50,
  });

  /** Whether to show popup ad instead of intended function (vs. in addition to) */
  game.settings.register(FO.system, "popupAdInstead", {
    name: "FO.SettingsPopupAdInstead",
    hint: "FO.SettingsPopupAdInsteadHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  /** Whether to play sound effects */
  game.settings.register(FO.system, "soundEffects", {
    name: "FO.SettingsSoundEffects",
    hint: "FO.SettingsSoundEffectsHint",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
  });

  /** The allowed classes menu */
  game.settings.registerMenu(FO.system, "EditAllowedScvmClassesMenu", {
    name: "FO.EditAllowedScvmClassesMenu",
    hint: "FO.EditAllowedScvmClassesMenuHint",
    label: "FO.EditAllowedScvmClassesMenuButtonLabel",
    icon: "fas fa-cog",
    type: AllowedScvmClassesDialog,
    restricted: true,
  });

  /** The allowed classes menu for folkfactory */
  game.settings.register(FO.system, "allowedScvmClasses", {
    name: "",
    default: {},
    type: Object,
    scope: "world",
    config: false,
  });

  /** The client folkfactory selected classes  */
  game.settings.register(FO.system, "lastScvmfactorySelection", {
    name: "",
    default: [],
    type: Array,
    scope: "client",
    config: false,
  });
};

const getSetting = (setting) => {
  return game.settings.get(CONFIG.FO.system, setting);
};

const setSetting = (setting, value) => {
  return game.settings.set(CONFIG.FO.system, setting, value);
};

export const showChatAds = () => {
  return game.settings.get(FO.system, "showChatAds");
};

export const chatAdDelay = () => {
  return game.settings.get(FO.system, "chatAdDelay");
};

export const showPopupAds = () => {
  return game.settings.get(FO.system, "showPopupAds");
};

export const popupAdChance = () => {
  return game.settings.get(FO.system, "popupAdChance");
};

export const popupAdInstead = () => {
  return game.settings.get(FO.system, "popupAdInstead");
};

export const soundEffects = () => {
  return game.settings.get(FO.system, "soundEffects");
};

export const trackCarryingCapacity = () => {
  return game.settings.get(FO.system, "trackCarryingCapacity");
};

export const isScvmClassAllowed = (classPack) => {
  const allowedScvmClasses = game.settings.get(FO.system, "allowedScvmClasses");
  return typeof allowedScvmClasses[classPack] === "undefined"
    ? true
    : !!allowedScvmClasses[classPack];
};

export const getAllowedScvmClasses = () => {
  return getSetting(Settings.allowedScvmClasses);
};

export const setAllowedScvmClasses = (allowedScvmClasses) => {
  return game.settings.set(FO.system, "allowedScvmClasses", allowedScvmClasses);
};

export const getLastScvmfactorySelection = () => {
  return game.settings.get(FO.system, "lastScvmfactorySelection");
};

export const setLastScvmfactorySelection = (lastScvmfactorySelection) => {
  return game.settings.set(
    FO.system,
    "lastScvmfactorySelection",
    lastScvmfactorySelection
  );
};
