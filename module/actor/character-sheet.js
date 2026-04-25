import { testAgility, testOccult, testPresence, testStrength, testToughness } from "./ability-tests.js";
import { FOActorSheet } from "./actor-sheet.js";
import { showThreadsHelp } from "./threads.js";
import { rollLevelUp } from "./level-up.js";
// import { rollUseBoon } from "./boons.js";
import { byName } from "../utils.js";


export class FOCharacterSheet extends FOActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["fomoria", "sheet", "actor", "character"],
      template: "systems/fomoria/templates/actor/character-sheet.html",
      width: 750,
      height: 690,     
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "combat",
        },
      ],
      dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }],
    });
  }

  /** @override */
  async getData() {
    const superData = await super.getData();
    // TODO: move this to prepareItems?
    superData.data.items.forEach(item => {
      item.system.equippable = (
        item.type == CONFIG.FO.itemTypes.armor || 
        item.type == CONFIG.FO.itemTypes.shield || 
        item.type == CONFIG.FO.itemTypes.weapon);
      item.system.equippedClass = item.system.equipped ? "equipped" : "unequipped";
      });
    superData.data.system.armor = superData.data.items
      .filter(item => item.type === CONFIG.FO.itemTypes.armor && item.system.equipped)
      .sort(byName);
    superData.data.system.boons = superData.data.items
      .filter(item => item.type === CONFIG.FO.itemTypes.boon)
      .sort(byName);
    superData.data.system.clan = superData.data.items
      .filter(item => item.type === CONFIG.FO.itemTypes.clan)
      .pop();
    superData.data.system.conditions = superData.data.items
      .filter(item => item.type === CONFIG.FO.itemTypes.condition)
      .sort(byName);
    superData.data.system.equipment = superData.data.items
      .filter(item => {
        return (
          (item.type === CONFIG.FO.itemTypes.equipment && !item.system.equipped) ||
          (item.type === CONFIG.FO.itemTypes.armor && !item.system.equipped) || 
          (item.type === CONFIG.FO.itemTypes.shield && !item.system.equipped) || 
          (item.type === CONFIG.FO.itemTypes.weapon && !item.system.equipped)
          );
      })
      .sort(byName);      
    superData.data.system.expertise = superData.data.items
      .filter(item => item.type === CONFIG.FO.itemTypes.expertise)
      .sort(byName);
    superData.data.system.folk = superData.data.items
      .filter(item => item.type === CONFIG.FO.itemTypes.folk)
      .pop();
    superData.data.system.feats = superData.data.items
      .filter(item => item.type === CONFIG.FO.itemTypes.feat)
      .sort(byName);
    superData.data.system.tradition = superData.data.items
      .filter(item => item.type === CONFIG.FO.itemTypes.tradition)
      .pop();
    superData.data.system.shield = superData.data.items
      .filter((item) => item.type === CONFIG.FO.itemTypes.shield && item.system.equipped)
      .pop();
    superData.data.system.weapons = superData.data.items
      .filter((item) => item.type === CONFIG.FO.itemTypes.weapon && item.system.equipped)
      .sort(byName);
    superData.data.system.weaponfeats = superData.data.items
      .filter((item) => item.type === CONFIG.FO.itemTypes.weaponfeat)
      .sort(byName);
    console.log(superData.data.items);
    superData.data.system.encumberedClass = this.actor.isEncumbered ? "encumbered": "";
    return superData;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html
      .find(".ability-link")
      .on("click", this._testAbility.bind(this));
    html.find(".level-up-button").on("click", this._levelUp.bind(this));
    html.find(".reroll-button").on("click", this._reroll.bind(this));
    // html.find(".use-boon-button").on("click", this._useBoon.bind(this));
    // html.find(".use-feat-button").on("click", this._useFeat.bind(this));
  }

  /** @override */
  async _onDropItem(event, itemData) {
  }

  _testAbility(event) {
    event.preventDefault();
    // uiClick();
    const ability = event.currentTarget.dataset.ability;
    switch(ability) {
      case "agility":
        testAgility(this.actor);
        break;
      case "occult":
        testOccult(this.actor);
        break;
      case "presence":
        testPresence(this.actor);
        break;
      case "strength":
        testStrength(this.actor);
        break;
      case "threads":
        showThreadsHelp(this.actor);
        break;
      case "toughness":
        testToughness(this.actor);
        break;
    }
  }

  _levelUp(event) {
    event.preventDefault();
    // confirm before leveling
    const d = new Dialog({
      title: game.i18n.localize("FO.LevelUp"),
      content: `<p>${game.i18n.localize("FO.LevelUpHelp")}</p>`,
      buttons: {
        cancel: {
          label: game.i18n.localize("FO.Cancel"),
        },
        getbetter: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize("FO.LevelUp"),
          callback: () => rollLevelUp(this.actor),
        },
      },
      default: "cancel",
    });
    d.render(true);
  }

  _reroll(event) {
    event.preventDefault();
    this.actor.reroll();
  }

  _useBoon(event) {
    event.preventDefault();
    const item = $(event.currentTarget).parents(".item");
    const itemId = item.data("itemId");
    //rollUseBoon(this.actor, itemId);
  }
 }