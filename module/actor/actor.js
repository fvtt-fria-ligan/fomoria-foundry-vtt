import { FO } from "../config.js";
import { FOItem } from "../item/item.js";
import { trackCarryingCapacity } from "../settings.js";
import { documentFromPack, simpleData } from "../packutils.js";
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
      this.addDefaultFolkAndTradition();
    }
    super._onCreate(data, options, userId);
  }

  /** @override */
  async _onCreateDescendantDocuments(parent, collection, documents, data, options, userId) {
    super._onCreateDescendantDocuments(parent, collection, documents, data, options, userId);
    if (this.type === FO.actorTypes.character) {
      for (const doc of documents) {
        if (doc instanceof FOItem && doc.type === FO.itemTypes.boonPower && !doc.system.infestionId) {
          await doc.createLinkedInfestation();
        }
      }
    }
  }

  async addDefaultFolkAndTradition() {
    const defaultFolk = await fromUuid("Compendium.fomoria.fomoria-items.Item.yWL4ljE4bezK1kRh");
    const defaultTradition = await fromUuid("Compendium.fomoria.fomoria-items.Item.7Z7BhRgQE4bLDZJa");
    await this.createEmbeddedDocuments("Item", [simpleData(defaultFolk), simpleData(defaultTradition)]);
  }

  // ===== encumbrance =====
  
  get carryingCapacity() {
    return this.system.abilities.strength.value + 12;
  }

  get carryingSlots() {
    console.log(this.items);
    return this.items
      .reduce((slots, item) => slots + item.totalCarrySlots, 0);
  }

  get isEncumbered() {
    if (!trackCarryingCapacity()) {
      return false;
    }
    return this.carryingSlots > this.carryingCapacity;
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

  async reboot() {
    showMakeFolkDialog(this);
  }  
 }
