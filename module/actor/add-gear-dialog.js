import { FOApplication } from "../ui/application.js";

export function showAddGearDialog(actor) {
  const dialog = new AddGearDialog();
  dialog.actor = actor;
  dialog.render(true);
}

export class AddGearDialog extends FOApplication {
  /** @override */
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.id = "add-gear-dialog";
    options.classes = ["fomoria", "dialog"];
    options.title = game.i18n.localize("FO.AddGear");
    options.template =
      "systems/fomoria/templates/dialog/add-gear-dialog.html";
    options.width = 420;
    options.height = "auto";
    return options;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".add-item-button").click(this._onAddItem.bind(this));
  }

  async _onAddItem(event) {
    event.preventDefault();
    const form = $(event.currentTarget).parents(".add-gear-dialog")[0];
    const gearName = form.gearname.value;
    const gearType = form.geartype.value;
    if (!gearName || !gearType) {
      ui.notifications.error(game.i18n.localize('FO.GearNameAndTypeRequired'));
      return;
    }
    const itemData = {
      name: form.gearname.value,
      type: form.geartype.value,
      data: {},
    };
    const docs = await this.actor.createEmbeddedDocuments("Item", [itemData]);
    this.close();
    docs[0].sheet.render(true);  
  }
}
