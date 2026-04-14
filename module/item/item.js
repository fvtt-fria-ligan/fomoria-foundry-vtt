import { FO } from "../config.js";

/**
 * @extends {Item}
 */
 export class FOItem extends Item {

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
  
  get totalCarrySlots() {
    if (this.type === FO.itemTypes.app && this.system.cyberdeckId) {
      // slotted apps don't count
      return 0;
    }
    if (this.system.equipped) {
      // equipped items don't count
      return 0;
    }
    if (this.system.carrySlots) {
      return this.system.carrySlots * this.system.quantity;
    }
    return 0;
  }


  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();
  }
}