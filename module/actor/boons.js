import { FO } from "../config.js";
import { diceSound, showDice } from "../dice.js";
import { d20Formula, showOutcomeRollCard} from "../utils.js";

export async function useBoon(actor) {
  if (actor.system.wyrd.value < 1) {
    ui.notifications.warn(`${game.i18n.localize("FO.NoWyrdRemaining")}!`);
    return;
  }

  const occult = actor.system.abilities.occult.modified;
  const roll = new Roll(d20Formula(occult));
  await roll.evaluate();
  await showDice(roll);

  const d20Result = roll.total;
  const isFumble = d20Result <= FO.useBoonFumbleOn;
  const isCrit = d20Result >= FO.useBoonCritOn;
  const isDizzy = actor.hasCondition("dizzy");
  const dr =  isDizzy ? 14 : 12;

  let outcome = null;
  let damageRoll = null;
  let takeDamage = null;
  let becomeDizzy = false;
  if (isCrit || roll.total >= dr) {
    // SUCCESS
    outcome = game.i18n.localize(
      isCrit ? "FO.CriticalSuccess" : "FO.Success"
    );
  } else {
    // FAILURE
    outcome = game.i18n.localize(
      isFumble ? "FO.Fumble" : "FO.Failure"
    ) + ": " + game.i18n.localize("FO.UseBoonDizzy");
    damageRoll = new Roll("1d2");
    await damageRoll.evaluate();
    await showDice(damageRoll);
    takeDamage = `${game.i18n.localize("FO.Take")} ${
      damageRoll.total
    } ${game.i18n.localize("FO.Damage")}, ${game.i18n.localize(
      "FO.UseBoonDizzy"
    )}`;

    becomeDizzy = true;
  }

  const formula = `1d20 + ${game.i18n.localize(
    "FO.OccultAbbrev"
  )}`;
  const rollResult = {
    cardTitle: game.i18n.localize("FO.UseBoon"),
    dr,
    formula,
    roll,
    outcome,
    damageRoll
  };  
  showOutcomeRollCard(actor, rollResult);

  const newWyrd = Math.max(0, actor.system.wyrd.value - 1);
  await actor.update({ 
    ["system.wyrd.value"]: newWyrd,
  });
  if (becomeDizzy) {
    await actor.becomeDizzy();
  }  
  if (damageRoll) {
    await actor.loseStabilityPoints(damageRoll.total);
  }
}

export async function learnBoon(actor) {
  const occult = actor.system.abilities.occult.modified;  
  const roll = new Roll(d20Formula(occult));
  await roll.evaluate();
  await showDice(roll);

  let dr = 12;
  let outcome = null;
  let damageRoll = null;
  let takeDamage = null;

  if (roll.total >= dr) {
    outcome = game.i18n.localize("FO.Success");
  } else {
    outcome = game.i18n.localize("FO.Failure");
    damageRoll = new Roll("1d4");
    await damageRoll.evaluate();
    await showDice(damageRoll);
    takeDamage = 
      `${game.i18n.localize("FO.Take")} ${damageRoll.total} ${game.i18n.localize("FO.StabilityPoints").toLowerCase()}`;
  }

  const formula = `1d20 + ${game.i18n.localize(
    "FO.OccultAbbrev"
  )}`;
  const rollResult = {
    cardTitle: game.i18n.localize("FO.LearnBoon"),
    dr,
    formula,
    damageRoll,
    roll,
    outcome,
  };
  showOutcomeRollCard(actor, rollResult);

  if (damageRoll) {
    await actor.loseStabilityPoints(damageRoll.total);
  }
}

