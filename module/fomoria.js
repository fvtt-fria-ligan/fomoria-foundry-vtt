import { FOActor } from "./actor/actor.js";
import { FO } from "./config.js";
import { FOCharacterSheet } from "./actor/character-sheet.js";
import { FONpcSheet } from "./actor/npc-sheet.js";
import { FOItem } from "./item/item.js";
import { FOItemSheet } from "./item/item-sheet.js";
import { FOCombat, FOCombatModel } from "./combat/combat.js";
import { registerSystemSettings } from "./settings.js";
import { showMakeFolkDialog } from "./generator/make-folk-dialog.js";
import { createNpc } from "./generator/folkfactory.js";
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
    "%c===========================================================",
    consoleOptions,
  );
  console.log("FORMORIA");
  console.log(
    "%c===========================================================",
    consoleOptions,
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
  foundry.documents.collections.Actors.registerSheet(FO.system, FONpcSheet, {
    types: ["npc"],
    makeDefault: true,
    label: "FO.NpcSheet",
  });
  foundry.documents.collections.Items.unregisterSheet("core", foundry.appv1.sheets.ItemSheet);
  foundry.documents.collections.Items.registerSheet(FO.system, FOItemSheet, {
    makeDefault: true,
    label: "FO.ItemSheet",
  });
};

const modifyFoundryUI = () => {
  Hooks.on("renderActorDirectory", (tab, html, context, options) => {
    // only show the Create Punk button to users who can create actors
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

      const npcHeader = document.createElement("header");
      npcHeader.classList.add("make-npc");
      npcHeader.classList.add("directory-header");
      dirHeader.parentNode.insertBefore(npcHeader, dirHeader);
      npcHeader.insertAdjacentHTML(
        "afterbegin",
        `
        <div class="header-actions action-buttons flexrow">
          <button type="button" class="make-npc-button"><i class="fas fa-user"></i> ${game.i18n.localize("FO.MakeNpc")}</button>
        </div>
        `,
      );
      npcHeader
        .querySelector(".make-npc-button")
        .addEventListener("click", () => {
          createNpc();
        });
    }
  });
};
