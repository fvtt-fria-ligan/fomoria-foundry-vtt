import { FO } from "./config.js";

const colorSchemes = {
  fomoria: {
    key: "FO.ColorSchemeFomoria",
    accent: "#656565",
    background: "#FFFBF3", // off white
    buttonBackground: "#251800",
    buttonForeground: "#FFFBF3",    
    disabled: "gray",
    foreground: "#251800", // off black
    highlight: "#656565",
    sheetShadow: "none",
    windowBackground: "#FFFBF3", // off white
  },  
};

export const colorChoices = Object.keys(colorSchemes).reduce((accum, curr) => {
  accum[curr] = colorSchemes[curr].key;
  return accum;
}, {});

export const applyFontsAndColors = () => {
  const colorSchemeSetting = game.settings.get(FO.system, "colorScheme");
  const colorScheme = colorSchemes[colorSchemeSetting];
  const r = document.querySelector(":root");
  // FO css variables
  r.style.setProperty("--fo-accent-color", colorScheme.accent);
  r.style.setProperty("--fo-background-color", colorScheme.background);
  r.style.setProperty("--fo-button-background-color", colorScheme.buttonBackground);
  r.style.setProperty("--fo-button-foreground-color", colorScheme.buttonForeground);
  r.style.setProperty("--fo-disabled-color", colorScheme.disabled);
  r.style.setProperty("--fo-foreground-color", colorScheme.foreground);
  r.style.setProperty("--fo-highlight-color", colorScheme.highlight);
  r.style.setProperty("--fo-sheet-shadow", colorScheme.sheetShadow);
  r.style.setProperty("--fo-window-background-color", colorScheme.windowBackground);
  // Foundry css variables
  r.style.setProperty("--color-text-hyperlink", colorScheme.highlight);
  r.style.setProperty("--color-shadow-primary", colorScheme.highlight);
  r.style.setProperty("--color-shadow-highlight", colorScheme.highlight);
  r.style.setProperty("--color-border-highlight", colorScheme.highlight);
  r.style.setProperty("--color-border-highlight-alt", colorScheme.highlight);

  // TODO: fonts
  // --font-primary: 'Perfect DOS VGA 437';                
};
