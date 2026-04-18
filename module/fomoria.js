import { FOActor } from "./actor/actor.js";
import { FO } from "./config.js";
import { FOCharacterSheet } from "./actor/character-sheet.js";
import { FOCreatureSheet } from "./actor/creature-sheet.js";
import { FOItem } from "./item/item.js";
import { FOItemSheet } from "./item/item-sheet.js";
import { FOCombat, FOCombatModel } from "./combat/combat.js";
import { registerSystemSettings } from "./settings.js";
import { showMakeFolkDialog } from "./generator/make-folk-dialog.js";
import { registerHooks } from "./hooks.js";
import {
  registerHandlebarsHelpers,
  registerHandlebarsPartials,
} from "./handlebars.js";

import { enrichTextEditors } from "./enricher.js";

Hooks.once("init", async () => {
  consoleBanner();
  CONFIG.FO = FO;
  registerSystemSettings();
  registerDocumentClasses();
  registerSheets();
  enrichTextEditors();
  registerHandlebarsHelpers();
  await registerHandlebarsPartials();
  modifyFoundryUI();
  registerHooks();
});

Hooks.once("ready", async () => {
});

const consoleBanner = () => {
  const consoleOptions = "background: #ffffff; color: #000000";
  console.log(
    "==================================================================",
  );
  console.log("'||''''|  ..|''||   '||    ||'  ..|''||   '||''|.   '||'     |     ");
  console.log(" ||  .   .|'    ||   |||  |||  .|'    ||   ||   ||   ||     |||    ");
  console.log(" ||''|   ||      ||  |'|..'||  ||      ||  ||''|'    ||    |  ||   ");
  console.log(" ||      '|.     ||  | '|' ||  '|.     ||  ||   |.   ||   .''''|.  ");
  console.log(".||.      ''|...|'  .|. | .||.  ''|...|'  .||.  '|' .||. .|.  .||. ");
  console.log(
    "==================================================================",
  );
};

const registerDocumentClasses = () => {
  CONFIG.Actor.documentClass = FOActor;
  CONFIG.Item.documentClass = FOItem;
  CONFIG.Combat.documentClass = FOCombat;
  CONFIG.Combat.dataModels.cy = FOCombatModel;
};

const registerSheets = () => {
  foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
  foundry.documents.collections.Actors.registerSheet(FO.system, FOCharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "FO.CharacterSheet",
  });
  foundry.documents.collections.Actors.registerSheet(FO.system, FOCreatureSheet, {
    types: ["creature"],
    makeDefault: true,
    label: "FO.CreatureSheet",
  });
  foundry.documents.collections.Items.unregisterSheet("core", foundry.appv1.sheets.ItemSheet);
  foundry.documents.collections.Items.registerSheet(FO.system, FOItemSheet, {
    makeDefault: true,
    label: "FO.ItemSheet",
  });
};

const modifyFoundryUI = () => {

  // Don't expose the generator(s) until we have rules & implementation
  /*
  Hooks.on("renderActorDirectory", (tab, html, context, options) => {
    // only show the Create Folk button to users who can create actors
    if (options.isFirstRender && game.user.can("ACTOR_CREATE")) {
      // Add buttons before directory header
      const dirHeader = $(html)[0].querySelector(".directory-header");

      const folkHeader = document.createElement("header");
      folkHeader.classList.add("make-folk");
      folkHeader.classList.add("directory-header");
      dirHeader.parentNode.insertBefore(folkHeader, dirHeader);
      folkHeader.insertAdjacentHTML(
        "afterbegin",
        `
        <div class="header-actions action-buttons flexrow">
          <button type="button" class="make-folk-button"><i class="fas fa-skull"></i> ${game.i18n.localize("FO.MakeFolk")}</button>
        </div>
        `,
      );
      folkHeader
        .querySelector(".make-folk-button")
        .addEventListener("click", () => {
          showMakeFolkDialog();
        });

      const creatureHeader = document.createElement("header");
      creatureHeader.classList.add("make-creature");
      creatureHeader.classList.add("directory-header");
      dirHeader.parentNode.insertBefore(creatureHeader, dirHeader);
      creatureHeader.insertAdjacentHTML(
        "afterbegin",
        `
        <div class="header-actions action-buttons flexrow">
          <button type="button" class="make-creature-button"><i class="fas fa-user"></i> ${game.i18n.localize("FO.MakeNpc")}</button>
        </div>
        `,
      );
      creatureHeader
        .querySelector(".make-creature-button")
        .addEventListener("click", () => {
          createNpc();
        });
    }
  });
  */
};
