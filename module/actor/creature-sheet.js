import { FOActorSheet } from "./actor-sheet.js";
import { rollMorale } from "./morale.js";
import { rollReaction } from "./reaction.js";

export class FOCreatureSheet extends FOActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["fomoria", "sheet", "actor", "creature"],
      template: "systems/fomoria/templates/actor/creature-sheet.html",
      width: 720,
      height: 500,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "data",
        },
      ],
    });
  }

  /** @override */
  async getData() {
    const superData = await super.getData();
    return superData;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".reaction-button").on("click", this._onReactionClick.bind(this));
    html.find(".morale-button").on("click", this._onMoraleClick.bind(this));
  }

  async _onReactionClick(event) {
    event.preventDefault();
    await rollReaction(this.actor);
  }

  async _onMoraleClick(event) {
    event.preventDefault();
    await rollMorale(this.actor);
  }
 }