import { FO } from "../config.js";
import { addShowDicePromise, diceSound, showDice } from "../dice.js";
import { d20Formula } from "../utils.js";


const ATTACK_ROLL_CARD_TEMPLATE =
  "systems/fomoria/templates/chat/attack-roll-card.html";

/**
 * Do the actual attack rolls and resolution.
 */
export async function rollAttack(
  actor, itemId, attackDR, targetArmor) {
  const item = actor.items.get(itemId);
  const itemRollData = item.getRollData();

  // decide relevant attack ability
  let ability;
  let abilityAbbrevKey;
  let attackTypeKey;
  if (itemRollData.usesAbility?.toLowerCase() === "presence") {
    // ranged
    ability = "presence";
    abilityAbbrevKey = "FO.PresenceAbbrev";
    attackTypeKey = "FO.Ranged";
  } else {
    // melee
    ability = "strength";
    abilityAbbrevKey = "FO.StrengthAbbrev";
    attackTypeKey = "FO.Melee";
  }
  const value = actor.system.abilities[ability].value + actor.system.abilities[ability].modifier;

  // TODO: check for off-hand weapon
  const offHandWeapon = actor.offHandWeapon();
  if (offHandWeapon) {

  }

  // roll 1: attack
  const attackRoll = new Roll(d20Formula(value));
  await attackRoll.evaluate();
  await showDice(attackRoll);

  const d20Result = attackRoll.terms[0].results[0].result;
  const fumbleTarget = itemRollData.fumbleOn ?? 1;
  const critTarget = itemRollData.critOn ?? 20;
  const isFumble = d20Result <= fumbleTarget;
  const isCrit = d20Result >= critTarget;
  // nat 1 is always a miss, nat 20 is always a hit, otherwise check vs DR
  const isHit =
    attackRoll.total !== 1 &&
    (attackRoll.total === 20 || attackRoll.total >= attackDR);
  let attackOutcome = null;
  let damageRoll = null;
  let targetArmorRoll = null;
  let takeDamage = null;
  if (isHit) {
    // HIT!!!
    attackOutcome = game.i18n.localize(
      isCrit ? "FO.AttackCritText" : "FO.Hit"
    );
    // roll 2: damage.
    const baseDamage = item.system.damage;
    let damageFormula = baseDamage;
    if (damageFormula.includes("+") || damageFormula.includes("-")) {
      // wrap formula in parentheses in case of crit multiplying
      // e.g., chainsaw 1d6+1
      damageFormula = `(${damageFormula})`;
    }
    if (isCrit) {
      const critMultiplier = item.system.critMultiplier ?? 2;
      damageFormula = `${damageFormula} * ${critMultiplier}`;
    }
    damageRoll = new Roll(damageFormula);
    await damageRoll.evaluate();
    const dicePromises = [];
    addShowDicePromise(dicePromises, damageRoll);
    let damage = damageRoll.total;
    // roll 3: target armor soak
    if (targetArmor) {
      targetArmorRoll = new Roll(targetArmor, {});
      await targetArmorRoll.evaluate();
      addShowDicePromise(dicePromises, targetArmorRoll);
      damage = Math.max(damage - targetArmorRoll.total, 0);
    }
    if (dicePromises) {
      await Promise.all(dicePromises);
    }
    takeDamage = `${game.i18n.localize(
      "FO.Inflict"
    )} ${damage} ${game.i18n.localize("FO.Damage")}`;
  } else {
    // MISS!!!
    attackOutcome = await missText(isFumble);
  }

  const rollResult = {
    actor,
    attackDR,
    attackFormula: `1d20+${game.i18n.localize(abilityAbbrevKey)}`,
    attackRoll,
    attackOutcome,
    attackTypeKey,
    damageRoll,
    items: [item],
    takeDamage,
    targetArmorRoll,
  };
  await renderAttackRollCard(actor, rollResult);
};

async function missText(isFumble) {
  let missKey;
  if (isFumble) {
    const fumbleRoll = new Roll("1d6");
    await fumbleRoll.evaluate();
    if (fumbleRoll.total < 4) {
      missKey = "FO.AttackFumbleText1";
    } else if (fumbleRoll.total < 6) {
      missKey = "FO.AttackFumbleText2";
    } else {
      missKey = "FO.AttackFumbleText3";
    }
  } else {
    missKey = "FO.Miss";
  }
  return game.i18n.localize(missKey);
};

/**
 * Show attack rolls/result in a chat roll card.
 */
async function renderAttackRollCard(actor, rollResult) {
  const html = await foundry.applications.handlebars.renderTemplate(ATTACK_ROLL_CARD_TEMPLATE, rollResult);
  ChatMessage.create({
    content: html,
    sound: diceSound(),
    speaker: ChatMessage.getSpeaker({ actor }),
  });
};