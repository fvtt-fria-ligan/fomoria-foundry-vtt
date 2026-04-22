export const registerHandlebarsPartials = async () => {
  await foundry.applications.handlebars.loadTemplates([
    "systems/fomoria/templates/actor/abilities.html",
    "systems/fomoria/templates/actor/background-tab.html",
    "systems/fomoria/templates/actor/boons-tab.html",
    "systems/fomoria/templates/actor/combat-tab.html",
    "systems/fomoria/templates/actor/conditions-tab.html",
    "systems/fomoria/templates/actor/gear-tab.html",
    "systems/fomoria/templates/actor/feats-tab.html",
    "systems/fomoria/templates/actor/hit-points.html",
    "systems/fomoria/templates/actor/special-tab.html",
    "systems/fomoria/templates/item/item-base-fields.html",
    "systems/fomoria/templates/item/item-description-tab.html",
    "systems/fomoria/templates/item/item-sheet-header.html",
    "systems/fomoria/templates/item/item-sheet-tabs.html",
    "systems/fomoria/templates/actor/stability-points.html",
  ]);
}

export const registerHandlebarsHelpers = () => {
  /**
   * Formats a Roll as either the total or x + y + z = total if the roll has multiple terms.
   */
   Handlebars.registerHelper("xtotal", (roll) => {
    // collapse addition of negatives into just subtractions
    // e.g., 15 +  - 1 => 15 - 1
    // Also: apparently roll.result uses 2 spaces as separators?
    // We replace both 2- and 1-space varieties
    const result = roll.result.replace("+  -", "-").replace("+ -", "-");
    // roll.result is a string of terms. E.g., "16" or "1 + 15".
    if (result !== roll.total.toString()) {
      return `${result} = ${roll.total}`;
    } else {
      return result;
    }
  });  

  Handlebars.registerHelper("ifEq", function (arg1, arg2, options) {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper("ifLt", function (arg1, arg2, options) {
    return arg1 < arg2 ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper("ceil", function (num) {
    return Math.ceil(num);
  });
}
