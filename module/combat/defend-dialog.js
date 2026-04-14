import { rollDefend } from "./defend.js";
import { FOApplication } from "../ui/application.js";

/**
 * Show a defend dialog for the given actor.
 */
 export const showDefendDialog = async (actor) => {
  const attackDialog = new DefendDialog();
  attackDialog.actor = actor;
  attackDialog.render(true);
}

export class DefendDialog extends FOApplication {
  /** @override */
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.id = "defend-dialog";
    options.classes = ["fomoria", "dialog"];
    options.title = game.i18n.localize("FO.Defend");
    options.template =
      "systems/fomoria/templates/dialog/defend-dialog.html";
    options.width = 420;
    options.height = "auto";
    return options;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find("input[name='defense-base-dr']").change(this._onDefenseBaseDRChange.bind(this));
    html.find("input[name='defense-base-dr']").trigger("change");    
    html.find(".defend-button").click(this._onDefend.bind(this));
  }

  /** @override */
  async getData() {
    let defendDR = await this.actor.getFlag(
      CONFIG.FO.flagScope,
      CONFIG.FO.flags.DEFEND_DR
    );
    if (!defendDR) {
      defendDR = 12; // default
    }
    let incomingAttack = await this.actor.getFlag(
      CONFIG.FO.flagScope,
      CONFIG.FO.flags.INCOMING_ATTACK
    );
    if (!incomingAttack) {
      incomingAttack = "1d4"; // default
    }

    const armor = this.actor.equippedArmor();
    const drModifiers = [];
    if (armor) {
      // armor defense adjustment is based on its max tier, not current
      // TODO: maxTier is getting stored as a string
      const maxTier = parseInt(armor.system.tier.max);
      const defenseModifier = CONFIG.FO.armorTiers[maxTier].defenseModifier;
      if (defenseModifier) {
        drModifiers.push(
          `${armor.name}: ${game.i18n.localize("FO.DR")} +${defenseModifier}`
        );
      }
    }
    if (this.actor.isEncumbered) {
      drModifiers.push(
        `${game.i18n.localize("FO.Encumbered")}: ${game.i18n.localize(
          "FO.DR"
        )} +2`
      );
    }

    return {
      defendDR,
      incomingAttack,
      drModifiers
    };
  }

  _onDefenseBaseDRChange(event) {
    event.preventDefault();
    const baseInput = $(event.currentTarget);
    let drModifier = 0;
    const armor = this.actor.equippedArmor();
    if (armor) {
      // TODO: maxTier is getting stored as a string
      const maxTier = parseInt(armor.system.tier.max);
      const defenseModifier = CONFIG.FO.armorTiers[maxTier].defenseModifier;
      if (defenseModifier) {
        drModifier += defenseModifier;
      }
    }
    if (this.actor.isEncumbered) {
      drModifier += 2;
    }
    const modifiedDR = parseInt(baseInput.val()) + drModifier;
    const form = $(baseInput).closest("form.defend-dialog");
    const modifiedInput = $(form).find("input[name=defense-modified-dr]")
    modifiedInput.val(modifiedDR);
  }

  async _onDefend(event) {
    event.preventDefault();
    const form = $(event.currentTarget).closest("form.defend-dialog");
    const baseDR = parseInt($(form).find("input[name=defense-base-dr]").val());
    const modifiedDR = parseInt($(form).find("input[name=defense-modified-dr]").val());
    const incomingAttack = $(form).find("input[name=incoming-attack]").val();

    if (!baseDR || !modifiedDR || !incomingAttack) {
      // TODO: prevent dialog/form submission w/ required field(s)
      return;
    }

    this.close();
    await this.actor.setFlag(
      CONFIG.FO.flagScope,
      CONFIG.FO.flags.DEFEND_DR,
      baseDR
    );
    await this.actor.setFlag(
      CONFIG.FO.flagScope,
      CONFIG.FO.flags.INCOMING_ATTACK,
      incomingAttack
    );
    rollDefend(
      this.actor,
      modifiedDR,
      incomingAttack
    );
  }
}
