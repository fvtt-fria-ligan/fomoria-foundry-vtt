export const registerHandlebarsPartials = async () => {
  await foundry.applications.handlebars.loadTemplates([
    "systems/fomoria/templates/actor/abilities.hbs",
    "systems/fomoria/templates/actor/background-tab.hbs",
    "systems/fomoria/templates/actor/expertise-level.hbs",
    "systems/fomoria/templates/actor/gear-tab.hbs",
    "systems/fomoria/templates/actor/hours-of-light.hbs",
    "systems/fomoria/templates/actor/hit-points.hbs",
    "systems/fomoria/templates/actor/special-tab.hbs",
    "systems/fomoria/templates/actor/violence-tab.hbs",
    "systems/fomoria/templates/item/item-base-fields.hbs",
    "systems/fomoria/templates/item/item-description-tab.hbs",
    "systems/fomoria/templates/item/item-sheet-header.hbs",
    "systems/fomoria/templates/item/item-sheet-tabs.hbs",
    "systems/fomoria/templates/actor/stability-points.hbs",
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

  Handlebars.registerHelper("ifGt", function (arg1, arg2, options) {
    return arg1 > arg2 ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper("ceil", function (num) {
    return Math.ceil(num);
  });

  Handlebars.registerHelper("times", function (n, block) {
    let accum = "";
    for (let i = 0; i < n; i++) {
      accum += block.fn(i);
    }
    return accum;
  });

}
