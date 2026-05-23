import { FO } from "../config.js";
import { FOItem } from "../item/item.js";
import { trackCarryingCapacity } from "../settings.js";
import { documentFromDraw, simpleData } from "../packutils.js";
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
      // give Characters a default Clan, Folk, and Tradition
      await this.addDefaultItems();
    }
    super._onCreate(data, options, userId);
  }

  async addDefaultItems() {
    const defaultClan = await fromUuid(FO.defaultClan);
    const defaultFolk = await fromUuid(FO.defaultFolk);
    const defaultTradition = await fromUuid(FO.defaultTradition);
    await this.createEmbeddedDocuments("Item", [
      simpleData(defaultClan), 
      simpleData(defaultFolk), 
      simpleData(defaultTradition)
    ]);
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

  async gainCondition(name, uuid) {
    if (this.hasCondition(name)) {
      return;
    }
    const condition = await fromUuid(uuid);
    await this.createEmbeddedDocuments("Item", [simpleData(condition)]);
  }

  equippedArmor() {
    return this.items.filter((item) => item.system.equippedArmor && item.type === FO.itemTypes.armor).pop();
  }

  offHandWeapon() {
    return this.items.filter((item) => item.system.equippedOffHand && item.type === FO.itemTypes.weapon).pop();
  }

  offHandShield() {
    return this.items.filter((item) => item.system.equippedOffHand && item.type === FO.itemTypes.shield).pop();    
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
    await this.gainCondition("dizzy", FO.dizzyCondition);
  }

  async sufferDread() {
    await this.gainCondition("dread", FO.dreadCondition);
  }

  // losing hit points may cause injury or may cause death depending on what's doing it...
  // so let callers decide that themselves
  async loseHitPoints(dmg) {
    if (dmg === 0) {
      return;
    }
    const newHP = Math.max(this.system.hitPoints.value - dmg, 0);
    await this.update({ ["system.hitPoints.value"]: newHP });
  }

  async loseStabilityPoints(dmg) {
    if (dmg === 0) {
      return;
    }
    const newSP = Math.max(this.system.stabilityPoints.value - dmg, 0);
    await this.update({ ["system.stabilityPoints.value"]: newSP });
    if (newSP === 0) {
      await this.rollBreakdown();
    }
    if (this.system.abilities.occult.modified < -6) {
      await this.die();
    }
  }

  isDead() {
    return this.hasCondition("death");
  }

  async die() {
    if (this.isDead()) {
      // already dead
      return;
    }
    await this.gainCondition("death", FO.deathCondition);
    const html = `<div style="margin-top: 20px; margin-bottom: 20px; text-align: center;">💀💀💀 ${game.i18n.localize("FO.YouAreDead")} 💀💀💀</div>`;
    ChatMessage.create({
      content: html,
      sound: CONFIG.sounds.combat,
      speaker: ChatMessage.getSpeaker({ actor: this }),
    });    
  }

  async rollInjury() {
    await this.drawNewCondition(FO.direInjuriesTable);
  }

  async rollBreakdown() {
    await this.drawNewCondition(FO.dismalBreakdownsTable);
  }

  async drawNewCondition(tableUuid) {
    const table = await fromUuid(tableUuid);
    if (!table) {
      console.log(`Could not find table ${uuid}`);
      return;
    }
    while (true) {
      // const tableDraw = await table.draw({ displayChat: false });
      const tableDraw = await table.draw();
      const condition = await documentFromDraw(tableDraw);
      if (!this.hasCondition(condition.name)) {
        // await table.toMessage([tableDraw.results[0]], {roll: tableDraw.roll});
        // await table.toMessage([tableDraw.results[0]], {roll: tableDraw.roll});
        // await table.toMessage(tableDraw.results[0]);
        await this.createEmbeddedDocuments("Item", [simpleData(condition)]);
        return;
      }
    }
  }  
 }
