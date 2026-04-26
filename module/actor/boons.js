import { showDice } from "../dice.js";
import { d20Formula, showOutcomeRollCard } from "../utils.js";


export async function learnBoon(actor) {
  const roll = new Roll(
    "d20+@abilities.occult.value",
    actor.getRollData()
  );
  await roll.evaluate();
  await showDice(roll);

  const outcome = game.i18n.localize(roll.total > 12 ? "FO.SUCCESS" : "FO.FAILURE");
  const formula = `1d20 + ${game.i18n.localize(
    "FO.AbilityOccultAbbrev"
  )}`;
  const rollTitle = `${formula} ${game.i18n.localize(
    "FO.Vs"
  )} ${game.i18n.localize("FO.DR")} 12`;

  const rollResults = [{
      rollTitle,
      roll: roll,
      outcomeLines: [outcome],
    }];
  const data = {
    cardTitle: game.i18n.localize("FO.LearnBoon"),
    rollResults,
  };
  const html = await foundry.applications.handlebars.renderTemplate(
    "systems/fomoria/templates/chat/roll-result-card.hbs",
    data
  );
  ChatMessage.create({
    content: html,
    sound: diceSound(),
    speaker: ChatMessage.getSpeaker({ actor: actor }),
  });
}

export async function useBoon(actor) {
  if (actor.system.wyrd.value < 1) {
    ui.notifications.warn(`${game.i18n.localize("FO.NoWyrdsRemaining")}!`);
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
  const useDR = 12; // TODO: sometimes 14

  let useOutcome = null;
  let damageRoll = null;
  let takeDamage = null;
  if (isCrit || useRoll.total >= useDR) {
    // SUCCESS!!!
    useOutcome = game.i18n.localize(
      isCrit ? "FO.CriticalSuccess" : "FO.Success"
    );
  } else {
    // FAILURE
    useOutcome = game.i18n.localize(
      isFumble ? "FO.UseBoonFumble" : "FO.Failure"
    );
    damageRoll = new Roll("1d2");
    await damageRoll.evaluate();
    await showDice(damageRoll);
    takeDamage = `${game.i18n.localize("FO.Take")} ${
      damageRoll.total
    } ${game.i18n.localize("FO.Damage")}, ${game.i18n.localize(
      "MB.UseBoonDizzy"
    )}`;
  }

  const useFormula = `1d20 + ${game.i18n.localize(
    "FO.AbilityOccultAbbrev"
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
  const html = await foundry.applications.handlebars.renderTemplate(
    "systems/fomoria/templates/chat/roll-result-card.hbs",
    data
  );
  ChatMessage.create({
    content: html,
    sound: diceSound(),
    speaker: ChatMessage.getSpeaker({ actor: actor }),
  });

  const newWyrd = Math.max(0, actor.system.wyrd.value - 1);
  await actor.update({ ["system.wyrd.value"]: newWyrd });
}
