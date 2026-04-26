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
    html
      .find("input[name='attack-base-dr']")
      .on("change", this._onAttackBaseDRChange.bind(this));
    html.find("input[name='attack-base-dr']").trigger("change");
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
      itemId: this.item._id,
      targetArmor,
    };
  }

  _onAttackBaseDRChange(event) {
    event.preventDefault();
    const baseInput = $(event.currentTarget);
    const form = $(event.currentTarget.form);

    let drModifier = 0;
    const itemId = form.find("input[name='item-id']")[0].value;
    const item = this.actor.items.get(itemId);
    if (item.system.weaponType === "melee" && this.actor.isEncumbered) {
      drModifier += 2;
    }

    const modifiedDr = parseInt(baseInput[0].value) + drModifier;
    const modifiedInput = form.find("input[name='attack-modified-dr']");
    modifiedInput.val(modifiedDr.toString());
  }

  async _onAttack(event) {
    event.preventDefault();
    const form = $(event.currentTarget).parents(".attack-dialog")[0];
    const attackDRStr = $(form).find("input[name=attack-modified-dr]").val();
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
