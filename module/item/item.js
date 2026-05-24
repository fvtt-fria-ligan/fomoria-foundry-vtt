import { FO } from "../config.js";

/**
 * @extends {Item}
 */
 export class FOItem extends Item {

  get totalCarrySlots() {
    if (this.type === FO.itemTypes.container) {
      // make sure we don't count containers
      return 0;
    }
    if (this.type === FO.itemTypes.armor && this.system.equippedArmor) {
      // equipped armor doesn't count
      return 0;
    }
    if (this.system.carrySlots) {
      return this.system.carrySlots * this.system.quantity;
    }
    return 0;
  }

  get isMelee() {
    return this.type == FO.itemTypes.weapon && this.system.usesAbility === "strength";
  }

  get isRanged() {
    return this.type == FO.itemTypes.weapon && this.system.usesAbility === "presence";
  }

  /** @override */
  async _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
    // run create macro, if any
    if (data.system.createMacro) {
      const [packName, macroName] = data.system.createMacro.split(",");
      const pack = game.packs.get(packName);
      if (pack) {
        const content = await pack.getDocuments();
        const macro = content.find(x => x.name === macroName);
        if (macro) {
          console.log(`Executing macro ${macroName} from pack ${packName}`);
          macro.execute({actor: this.actor});
        } else {
          console.error(`Could not find macro named ${macroName}.`);
        }  
      } else {
        console.error(`Could not find pack named ${packName}.`);
      }
    }  
  }

  /** @override */
  async _onDelete(options, userId) {
    super._onDelete(options, userId);
  }
  
  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();
  }
}