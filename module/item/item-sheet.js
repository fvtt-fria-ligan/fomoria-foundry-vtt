import { uiClick, uiWindowClose, uiWindowOpen } from "../sound.js";

export class FOItemSheet extends foundry.appv1.sheets.ItemSheet {  
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["fomoria", "sheet", "item"],
      width: 600,
      height: 600,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "details",
        },
      ],
    });
  }

  /** @override */
  render(force=false, options={}) {
    uiWindowOpen();
    return super.render(force, options);
  }

  /** @override */
  async close(options={}) {
    uiWindowClose();
    return super.close(options);
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".tabs a.item").on("click", this._onTabClick.bind(this));  
  }

  /** @inheritdoc */
  get template() {
    const path = "systems/fomoria/templates/item/";
    return `${path}/${this.item.type}-sheet.html`;
  }

  /** @override */
  async getData() {
    const superData = await super.getData();
    superData.data.system.description = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      superData.data.system.description);
    return superData;
  }

  _onTabClick(event) {
  }  
}