import { showAddItemDialog } from "./add-item-dialog.js";
import { showAttackDialog } from "../combat/attack-dialog.js";
import { rollDismalBreakdown } from "../combat/breakdown.js";
import { rollDireInjury } from "../combat/injury.js";
import { showDefendDialog } from "../combat/defend-dialog.js";
import { rollPartyInitiative } from "../combat/initiative.js";
import { showRestDialog } from "../combat/rest-dialog.js";
import { uiWindowClose, uiWindowOpen } from "../sound.js";


/**
 * @extends {ActorSheet}
 */
//  export class FOActorSheet extends foundry.applications.api.ApplicationV2.sheets.ActorSheet {
 export class FOActorSheet extends foundry.appv1.sheets.ActorSheet {

  /** @override */
  render(force=false, options={}) {
    if (!this.rendered && this._state != Application.RENDER_STATES.RENDERING) {
      uiWindowOpen();
    }
    return super.render(force, options);
  }

  /** @override */
  async close(options={}) {
    uiWindowClose();
    return super.close(options);
  }

  /** @override */
  async getData() {
    const superData = await super.getData();
    superData.data.system.description = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      superData.data.system.description
    );
    return superData;
  }
  
  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".add-item-button").on("click", this._addItem.bind(this));
    html.find(".attack-button").on("click", this._attack.bind(this));
    html.find(".defend-button").on("click", this._defend.bind(this));
    html.find(".initiative-button").on("click", this._initiative.bind(this));
    html.find(".item-create").on("click", this._onItemCreate.bind(this));
    html.find(".item-delete").click(this._onItemDelete.bind(this));
    html.find(".item-edit").click(this._onItemEdit.bind(this));
    html.find(".item-equip-armor").click(this._equipArmor.bind(this));
    html.find(".item-equip-main-hand").click(this._equipMainHand.bind(this));
    html.find(".item-equip-off-hand").click(this._equipOffHand.bind(this));
    html.find(".item-qty-minus").click(this._onItemSubtractQuantity.bind(this));
    html.find(".item-qty-plus").click(this._onItemAddQuantity.bind(this));
    html.find(".rest-button").on("click", this._rest.bind(this));
    html.find(".tabs a.item").on("click", this._onTabClick.bind(this));
    html.find(".tier-radio").click(this._onArmorTierRadio.bind(this));
  }  
  
  _onTabClick(event) {
    // uiClick();
  }

  _onItemEdit(event) {
    const row = $(event.currentTarget).parents(".item");
    if (row) {
      const item = this.actor.items.get(row.data("itemId"));
      if (item) {
        item.sheet.render(true);
      }
    }
  }

  async _onItemDelete(event) {
    const row = $(event.currentTarget).parents(".item");
    await this.actor.deleteEmbeddedDocuments("Item", [row.data("itemId")]);
    row.slideUp(200, () => this.render(false));
  }

  _itemFromEvent(event) {
    const anchor = $(event.currentTarget);
    const li = anchor.parents(".item");
    const itemId = li.data("itemId");
    const item = this.actor.items.get(itemId);    
    return item;
  }

  async _onItemCreate(event) {
    const itemType = $(event.currentTarget).data("itemType");
    event.preventDefault();
    const itemData = {
      name: `New ${itemType}`,
      type: itemType,
      data: {},
    };
    await this.actor.createEmbeddedDocuments("Item", [itemData]);
  }

  async _equipMainHand(event) {
    await this._toggleEquipped(event, "equippedMainHand");
  }

  async _equipOffHand(event) {
    await this._toggleEquipped(event, "equippedOffHand");
  }    

  async _equipArmor(event) {
    await this._toggleEquipped(event, "equippedArmor");
  }

  async _toggleEquipped(event, attrib) {
    const item = this._itemFromEvent(event);
    if (!item) {
      return;
    }

    const oldItem = this.actor.items.filter((item) => item.system[attrib]).pop();
    const systemAttrib = "system." + attrib;
    if (!oldItem || item._id === oldItem._id) {
      // toggle      
      await item.update({ [systemAttrib]: !item.system[attrib]});
    } else {
      // swap
      await oldItem.update({ [systemAttrib]: false});
      await item.update({ [systemAttrib]: true});
    }
  }

  async _addItem(event) {
    event.preventDefault();
    showAddItemDialog(this.actor);
  }

  /**
   * Handle adding quantity of an Owned Item within the Actor
   */
   async _onItemAddQuantity(event) {
    event.preventDefault();
    // uiClick();
    const anchor = $(event.currentTarget);
    const li = anchor.parents(".item");
    const itemId = li.data("itemId");
    const item = this.actor.items.get(itemId);
    const attr = "system.quantity";
    const currQuantity = foundry.utils.getProperty(item, attr);
    return item.update({ [attr]: currQuantity + 1 });
  }

  /**
   * Handle subtracting quantity of an Owned Item within the Actor
   */
  async _onItemSubtractQuantity(event) {
    event.preventDefault();
    // uiClick();
    const anchor = $(event.currentTarget);
    const li = anchor.parents(".item");
    const itemId = li.data("itemId");
    const item = this.actor.items.get(itemId);
    const attr = "system.quantity";
    const currQuantity = foundry.utils.getProperty(item, attr);
    // can't reduce quantity below zero
    if (currQuantity > 0) {
      return item.update({ [attr]: currQuantity - 1 });
    }
  }

  _initiative(event) {
    event.preventDefault();
    rollPartyInitiative(this.actor);
  }

  async _defend(event) {
    event.preventDefault();
    showDefendDialog(this.actor);
  }

  _rest(event) {
    event.preventDefault();
    showRestDialog(this.actor);
  }

  _attack(event) {
    event.preventDefault();
    const item = $(event.currentTarget).parents(".item");
    const itemId = item.data("itemId");
    showAttackDialog(this.actor, itemId);
  }
  
  /**
   * Handle a click on the armor current tier radio buttons.
   */
   async _onArmorTierRadio(event) {
    event.preventDefault();
    // uiClick();
    const input = $(event.currentTarget);
    const newTier = parseInt(input[0].value);
    const parent = input.parents(".item");
    const item = this.actor.items.get(parent.data("itemId"));
    await item.update({ ["system.tier.value"]: newTier });
  }
 }
