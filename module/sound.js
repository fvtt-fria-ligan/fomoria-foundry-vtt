import { soundEffects } from "./settings.js";

export const playSound = (src, volume=0.8) => {
  if (src && soundEffects()) {
    const pushToOtherClients = false;
    foundry.audio.AudioHelper.play({src, volume, loop: false}, pushToOtherClients);
  }
};

export const uiClick = () => {
  // playSound("systems/fomoria/assets/audio/sfx/ui-click-1.ogg");
};

export const uiWindowClose = () => {
  // playSound("systems/fomoria/assets/audio/sfx/ui-click-1.ogg");
};

export const uiWindowOpen = () => {
  // playSound("systems/fomoria/assets/audio/sfx/ui-click-1.ogg");
};
