import { testAgility, testOccult, testPresence, testStrength, testToughness } from "./ability-tests.js";
import { FOActorSheet } from "./actor-sheet.js";
import { learnBoon, useBoon } from "./boons.js";
import { rollBreakdown } from "../combat/breakdown.js";
import { useFeat } from "./feats.js";
import { rollInjury } from "../combat/injury.js";
import { showThreadsHelp } from "./threads.js";
import { byName } from "../utils.js";

export class FOCharacterSheet extends FOActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["fomoria", "sheet", "actor", "character"],
      template: "systems/fomoria/templates/actor/character-sheet.html",
      width: 770,
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
      item.system.equippedArmorClass = item.system.equippedArmor ? "equipped" : "unequipped";
      item.system.equippedMainHandClass = item.system.equippedMainHand ? "equipped" : "unequipped";
      item.system.equippedOffHandClass = item.system.equippedOffHand ? "equipped" : "unequipped";
      item.system.equippableArmor = item.type == CONFIG.FO.itemTypes.armor;
      item.system.equippableMainHand = item.type == CONFIG.FO.itemTypes.weapon;
      item.system.equippableOffHand = (item.type == CONFIG.FO.itemTypes.weapon && !item.system.twoHanded) ||
        item.type == CONFIG.FO.itemTypes.shield;
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
          item.type === CONFIG.FO.itemTypes.armor ||
          item.type === CONFIG.FO.itemTypes.shield ||
          item.type === CONFIG.FO.itemTypes.weapon
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
    return superData;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html
      .find(".ability-link")
      .on("click", this._testAbility.bind(this));
    html.find(".breakdown-button").on("click", this._rollBreakdown.bind(this));
    html.find(".injury-button").on("click", this._rollInjury.bind(this));
    html.find(".learn-boon-button").on("click", this._learnBoon.bind(this));
    html.find(".use-boon-button").on("click", this._useBoon.bind(this));
    // html.find(".use-feat-button").on("click", this._useFeat.bind(this));
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

  _useFeat(event) {
    event.preventDefault();
    const button = $(event.currentTarget);
    const li = button.parents(".item");
    const itemId = li.data("itemId");
    useFeat(this.actor, itemId);
  }

  async _learnBoon(event) {
    event.preventDefault();
    await learnBoon(this.actor);
  }  

  async _useBoon(event) {
    event.preventDefault();
    await useBoon(this.actor);
  }

  async _rollBreakdown(event) {
    event.preventDefault();
    await rollBreakdown(this.actor);
  }

  async _rollInjury(event) {
    event.preventDefault();
    await rollInjury(this.actor);
  }

 }