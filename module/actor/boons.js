import { FO } from "../config.js";
import { diceSound, showDice } from "../dice.js";
import { d20Formula, showOutcomeRollCard } from "../utils.js";


export async function useBoon(actor) {
  if (actor.system.wyrd.value < 1) {
    ui.notifications.warn(`${game.i18n.localize("FO.NoWyrdRemaining")}!`);
    return;
  }

  const useRoll = new Roll(
    "d20+@abilities.occult.value",
    actor.getRollData()
  );
  await useRoll.evaluate();
  await showDice(useRoll);

  const d20Result = useRoll.total;
  const isFumble = d20Result <= FO.useBoonFumbleOn;
  const isCrit = d20Result >= FO.useBoonCritOn;
  const isDizzy = actor.hasCondition("dizzy");
  const useDR =  isDizzy ? 14 : 12;

  let useOutcome = null;
  let damageRoll = null;
  let takeDamage = null;
  let becomeDizzy = false;
  if (isCrit || useRoll.total >= useDR) {
    // SUCCESS
    useOutcome = game.i18n.localize(
      isCrit ? "FO.CriticalSuccess" : "FO.Success"
    );
  } else {
    // FAILURE
    useOutcome = game.i18n.localize(
      isFumble ? "FO.Fumble" : "FO.Failure"
    );
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

  const useFormula = `1d20 + ${game.i18n.localize(
    "FO.OccultAbbrev"
  )}`;
  const rollTitle = `${useFormula} ${game.i18n.localize(
    "FO.Vs"
  )} ${game.i18n.localize("FO.DR")} ${useDR}`;
  const outcomeLines = [useOutcome];
  if (takeDamage) {
    outcomeLines.push(takeDamage);
  }
  const rollResults = [
    {
      rollTitle,
      roll: useRoll,
      outcomeLines: [useOutcome],
    },
  ];
  if (damageRoll) {
    rollResults.push({
      rollTitle: `${game.i18n.localize("FO.Damage")}: ${damageRoll.formula}`,
      roll: damageRoll,
      outcomeLines: [takeDamage],
    });
  }
  const data = {
    cardTitle: game.i18n.localize("FO.UseBoon"),
    rollResults,
  };
  // const data = {
  //   cardTitle: game.i18n.localize("FO.UseBoon"),
  //   dr,
  //   formula,
  //   roll,
  //   outcome,
  //   damageRoll
  // };  
  const html = await foundry.applications.handlebars.renderTemplate(
    // "systems/fomoria/templates/chat/outcome-roll-card.html",
    "systems/fomoria/templates/chat/roll-result-card.html",
    data
  );
  ChatMessage.create({
    content: html,
    sound: diceSound(),
    speaker: ChatMessage.getSpeaker({ actor: actor }),
  });

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
  const roll = new Roll(
    "d20+@abilities.occult.value",
    actor.getRollData()
  );
  await roll.evaluate();
  await showDice(roll);

  let outcome = null;
  let damageRoll = null;
  let takeDamage = null;

  if (roll.total >= 12) {
    outcome = game.i18n.localize("FO.Success");
  } else {
    outcome = game.i18n.localize("FO.Failure");
    damageRoll = new Roll("1d4");
    await damageRoll.evaluate();
    await showDice(damageRoll);
    takeDamage = 
      `${game.i18n.localize("FO.Take")} ${damageRoll.total} ${game.i18n.localize("FO.StabilityPoints").toLowerCase()}`;
  }

  const outcomeLines = [outcome];
  if (takeDamage) {
    outcomeLines.push(takeDamage);
  }
  const formula = `1d20 + ${game.i18n.localize(
    "FO.OccultAbbrev"
  )}`;
  const rollTitle = `${formula} ${game.i18n.localize(
    "FO.Vs"
  )} ${game.i18n.localize("FO.DR")} 12`;

  const rollResults = [{
      rollTitle,
      roll: roll,
      outcomeLines: [outcome],
    }];
  if (damageRoll) {
    rollResults.push({
      rollTitle: `${game.i18n.localize("FO.Damage")}: ${damageRoll.formula}`,
      roll: damageRoll,
      outcomeLines: [takeDamage],
    });
  }

  const data = {
    cardTitle: game.i18n.localize("FO.LearnBoon"),
    rollResults,
  };
  const html = await foundry.applications.handlebars.renderTemplate(
    // "systems/fomoria/templates/chat/outcome-roll-card.html",
    "systems/fomoria/templates/chat/roll-result-card.html",
    data
  );
  ChatMessage.create({
    content: html,
    sound: diceSound(),
    speaker: ChatMessage.getSpeaker({ actor: actor }),
  });

  if (damageRoll) {
    await actor.loseStabilityPoints(damageRoll.total);
  }
}

