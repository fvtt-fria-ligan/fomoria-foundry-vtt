import { FO } from "../config.js";
import { FOItem } from "../item/item.js";
import { trackCarryingCapacity } from "../settings.js";
import { documentsFromDraw, documentFromPack, drawFromTableUuid, drawDocumentFromTableUuid, simpleData } from "../packutils.js";
import { showMakeFolkDialog } from "../generator/make-folk-dialog.js";

const byCurrentTierDesc = (a, b) => (a.system.tier.value < b.system.tier.value ? 1 : b.system.tier.value < a.system.tier.value ? -1 : 0);

/**
 * @extends {Actor}
 */
 export class FOActor extends Actor {

  /** @override */
  static async create(data, options = {}) {
    data.prototypeToken = data.prototypeToken || {};
    let defaults = {};
    if (data.type === FO.actorTypes.character) {
      defaults = {
        actorLink: true,
        disposition: 1,
        vision: true,
      };
    } else if (data.type === FO.actorTypes.creature) {
      defaults = {
        actorLink: false,
        disposition: -1,
        vision: false,
      };
    }
    foundry.utils.mergeObject(data.prototypeToken, defaults, { overwrite: false });
    return super.create(data, options);
  }

  /** @override */
  async _onCreate(data, options, userId) {
    if (data.type === FO.actorTypes.character) {
      // give Characters a default Folk and Tradition
      await this.addDefaultFolkAndTradition();
    }
    super._onCreate(data, options, userId);
  }

  async addDefaultFolkAndTradition() {
    const defaultFolk = await fromUuid(FO.defaultFolk);
    const defaultTradition = await fromUuid(FO.defaultTradition);
    await this.createEmbeddedDocuments("Item", [simpleData(defaultFolk), simpleData(defaultTradition)]);
  }

  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();

    if (this.type === FO.actorTypes.character) {
      this.system.abilities.strength.modified = this.system.abilities.strength.value;
      this.system.abilities.agility.modified = this.system.abilities.agility.value;
      this.system.abilities.presence.modified = this.system.abilities.presence.value;
      this.system.abilities.toughness.modified = this.system.abilities.toughness.value;
      this.system.abilities.occult.modified = this.system.abilities.occult.value;

      this.items.forEach(item => {
        if (item.type == FO.itemTypes.condition) {
          this.system.abilities.strength.modified += item.system.abilityModifiers.strength;
          this.system.abilities.agility.modified += item.system.abilityModifiers.agility;
          this.system.abilities.presence.modified += item.system.abilityModifiers.presence;
          this.system.abilities.toughness.modified += item.system.abilityModifiers.toughness;
          this.system.abilities.occult.modified += item.system.abilityModifiers.occult;
        }
      });
    }
  }
  
  // ===== encumbrance =====
  
  get carryingCapacity() {
    return this.system.abilities.strength.value + 12;
  }

  get carryingSlots() {
    return this.items
      .reduce((slots, item) => slots + item.totalCarrySlots, 0);
  }

  get isEncumbered() {
    if (!trackCarryingCapacity()) {
      return false;
    }
    return this.carryingSlots > this.carryingCapacity;
  }

  condition(conditionName) {
    return this.items.find((item) => 
      item.type === FO.itemTypes.condition && 
      item.name.toLowerCase() == conditionName.toLowerCase());
  }

  hasCondition(conditionName) {
    return this.condition(conditionName) !== undefined;
  }

  equippedArmor() {
    this.items.filter((item) => item.system.equippedArmor && item.type === FO.itemTypes.armor).pop();
  }

  offHandWeapon() {
    this.items.filter((item) => item.system.equippedOffHand && item.type === FO.itemTypes.weapon).pop();
  }

  offHandShield() {
    this.items.filter((item) => item.system.equippedOffHand && item.type === FO.itemTypes.shield).pop();    
  }

  _first(itemType) {
    return this.items.filter(x => x.type === itemType).shift();
  }

  findItem(itemType, itemName) {
    return this.items.filter(x => x.type === itemType && x.name === itemName).shift();
  }

  async reroll() {
    showMakeFolkDialog(this);
  }  

  async becomeDizzy() {
    if (this.hasCondition("dizzy")) {
      // already dizzy
      return;
    }

    const dizzy = await fromUuid(FO.dizzyCondition);
    await this.createEmbeddedDocuments("Item", [simpleData(dizzy)]);
  }

  async loseHitPoints(dmg) {
    const newHP = Math.max(actor.system.hitPoints.value - dmg, 0);
    await this.update({ ["system.hitPoints.value"]: newSP });
    if (newHP === 0) {
      await this.rollDireInjury();
    }
  }

  async loseStabilityPoints(dmg) {
    const newSP = Math.max(this.system.stabilityPoints.value - dmg, 0);
    await this.update({ ["system.stabilityPoints.value"]: newSP });
    if (newSP === 0) {
      await this.rollBreakdown();
    }
  }
 }
