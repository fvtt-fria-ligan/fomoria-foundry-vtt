import { rollAttack } from "./attack.js";
import { FOApplication } from "../ui/application.js";


export const showAttackDialog = async (actor, itemId) => {
  const item = actor.items.get(itemId);
  if (!item) {
    return;
  }
  const attackDialog = new AttackDialog();
  attackDialog.actor = actor;
  attackDialog.item = item;
  attackDialog.render(true);
}

export class AttackDialog extends FOApplication {
  /** @override */
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.id = "attack-dialog";
    options.classes = ["fomoria", "dialog"];
    options.title = game.i18n.localize("FO.Attack");
    options.template =
      "systems/fomoria/templates/dialog/attack-dialog.html";
    options.width = 420;
    options.height = "auto";
    return options;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".attack-button").click(this._onAttack.bind(this));
  }

  /** @override */
  async getData() {
    let attackDR = await this.actor.getFlag(
      CONFIG.FO.flagScope,
      CONFIG.FO.flags.ATTACK_DR
    );
    if (!attackDR) {
      attackDR = 12; // default
    }
    const targetArmor = await this.actor.getFlag(
      CONFIG.FO.flagScope,
      CONFIG.FO.flags.TARGET_ARMOR
    );
    return {
      attackDR,
      targetArmor,
    };
  }

  async _onAttack(event) {
    event.preventDefault();
    const form = $(event.currentTarget).parents(".attack-dialog")[0];
    const attackDRStr = $(form).find("input[name=attack-dr]").val();
    const attackDR = parseInt(attackDRStr);
    const targetArmor = $(form).find("input[name=target-armor]").val();
    this.close();
    await this.actor.setFlag(
      CONFIG.FO.flagScope,
      CONFIG.FO.flags.ATTACK_DR,
      attackDR
    );
    await this.actor.setFlag(
      CONFIG.FO.flagScope,
      CONFIG.FO.flags.TARGET_ARMOR,
      targetArmor
    );

    rollAttack(
      this.actor,
      this.item._id,
      attackDR,
      targetArmor,
    );
  }
}
