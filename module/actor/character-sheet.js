import { testAgility, testOccult, testPresence, testStrength, testToughness } from "./ability-tests.js";
import { FOActorSheet } from "./actor-sheet.js";
import { useBoon } from "./boons.js";
import { useFeat } from "./feats.js";
import { showThreadsHelp } from "./threads.js";
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
    superData.data.items.forEach(item => {
      // TODO: think through
      // item.system.equippedClass = item.system.equippedArmor ? "equippedArmor" : "unequipped";
      item.system.equippableArmor = item.type == CONFIG.FO.itemTypes.armor;
      item.system.equippableMainHand = item.type == CONFIG.FO.itemTypes.weapon;
      item.system.equippableOffHand = (item.type == (CONFIG.FO.itemTypes.weapon && ! item.system.twoHanded) ||
        item.type == CONFIG.FO.itemTypes.shield);
      });
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
          item.type === CONFIG.FO.itemTypes.equipment ||
          (item.type === CONFIG.FO.itemTypes.armor && !item.system.equippedArmor) || 
          (item.type === CONFIG.FO.itemTypes.shield && !item.system.equippedOffHand) || 
          (item.type === CONFIG.FO.itemTypes.weapon && !item.system.equippedMainHand && !item.system.equippedOffHand)
          );
      })
      .sort(byName);
    superData.data.system.equippedArmor = superData.data.items
      .filter(item => item.system.equippedArmor)
      .pop();
    superData.data.system.equippedMainHand = superData.data.items
      .filter(item => item.system.equippedMainHand)
      .pop();
    superData.data.system.equippedOffHand = superData.data.items
      .filter(item => item.system.equippedOffHand)
      .pop();
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
    superData.data.system.weaponfeats = superData.data.items
      .filter((item) => item.type === CONFIG.FO.itemTypes.weaponfeat)
      .sort(byName);
    superData.data.system.encumberedClass = this.actor.isEncumbered ? "encumbered": "";
    console.log(this.actor, this.actor.items, superData);
    return superData;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html
      .find(".ability-link")
      .on("click", this._testAbility.bind(this));
    html.find(".use-boon-button").on("click", this._useBoon.bind(this));
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

  _useBoon(event) {
    event.preventDefault();
    useBoon(this.actor, itemId);
  }

  _onFeatRoll(event) {
    event.preventDefault();
    const button = $(event.currentTarget);
    const li = button.parents(".item");
    const itemId = li.data("itemId");
    useFeat(this.actor, itemId);
  }
 }