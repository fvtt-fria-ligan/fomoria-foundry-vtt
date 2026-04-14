import { showDice } from "../dice.js";
import { d20Formula, showOutcomeRollCard } from "../utils.js";


/**
 * Roll for actor to use a boon.
 */
export async function rollUseBoon(actor, itemId) {
  const boon = actor.items.get(itemId);
  if (!boon) {
    return;
  }

  const useFormula = d20Formula(actor.system.abilities.presence.value);
  const useRoll = new Roll(useFormula);
  await useRoll.evaluate();
  await showDice(useRoll);

  const d20Result = useRoll.terms[0].results[0].result;
  const isFumble = d20Result <= actor.system.boonFumbleOn;
  const useDR = 12;

  let useOutcome = null;
  let damageRoll;
  let takeDamage;    

  if (isFumble) {    
    useOutcome = game.i18n.localize("FO.UseBoonFumble");
  } else if (useRoll.total < useDR) {
    // failure
    useOutcome = game.i18n.localize("FO.Failure");
  } else {
    // success
    useOutcome = game.i18n.localize("FO.Success");
  }

  if (isFumble || useRoll.total < useDR) {
    // take 1d2 damage
    damageRoll = new Roll("1d2", actor.getRollData());
    damageRoll.evaluate({ async: false });
    await showDice(damageRoll);
    takeDamage = `${game.i18n.localize("FO.Take")} ${damageRoll.total} ${game.i18n.localize("FO.Damage")}`;
  }

  const rollResult = {
    cardCssClass: "use-boon-roll-card",
    cardTitle: game.i18n.localize("FO.UseBoon"),
    damageRoll,
    dr: useDR,
    formula: `1d20 + ${game.i18n.localize("FO.PresenceAbbrev")}`,
    outcome: useOutcome,
    roll: useRoll,
    takeDamage,
  };
  await showOutcomeRollCard(actor, rollResult);
};
