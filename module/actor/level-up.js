import { FO } from "../config.js";

const LEVEL_UP_ROLL_CARD_TEMPLATE =
  "systems/fomoria/templates/chat/level-up-roll-card.html";

export async function rollLevelUp(actor) {
  const oldHp = actor.system.hitPoints.max;
  const newHp = await betterHp(oldHp);
  const oldStr = actor.system.abilities.strength.value;
  const newStr = await betterAbility(oldStr);
  const oldAgi = actor.system.abilities.agility.value;
  const newAgi = await betterAbility(oldAgi);
  const oldPre = actor.system.abilities.presence.value;
  const newPre = await betterAbility(oldPre);
  const oldTou = actor.system.abilities.toughness.value;
  const newTou = await betterAbility(oldTou);
  const oldKno = actor.system.abilities.occult.value;
  const newKno = await betterAbility(oldKno);
  let newSilver = actor.system.silver;

  const hpOutcome = abilityOutcome(
    game.i18n.localize("FO.HitPoints"),
    oldHp,
    newHp
  );
  const strOutcome = abilityOutcome(
    game.i18n.localize("FO.Strength"),
    oldStr,
    newStr
  );
  const agiOutcome = abilityOutcome(
    game.i18n.localize("FO.Agility"),
    oldAgi,
    newAgi
  );
  const preOutcome = abilityOutcome(
    game.i18n.localize("FO.Presence"),
    oldPre,
    newPre
  );
  const touOutcome = abilityOutcome(
    game.i18n.localize("FO.Toughness"),
    oldTou,
    newTou
  );
  const knoOutcome = abilityOutcome(
    game.i18n.localize("FO.Occult"),
    oldKno,
    newKno
  );  

  // In the lining of your jacket, you find...
  let jacketOutcome = null;
  let rollTableName = null;
  const jacketRoll = await new Roll("1d6").evaluate();
  if (jacketRoll.total < 4) {
    jacketOutcome = game.i18n.localize("FO.LevelUpJacketNothing");
  } else if (jacketRoll.total === 4) {
    const silverRoll = await new Roll("3d6*10").evaluate();
    jacketOutcome = game.i18n.format("FO.LevelUpJacketCredChip", {silver: silverRoll.total});
    newSilver += silverRoll.total;
  } else if (jacketRoll.total === 5) {
    jacketOutcome = game.i18n.localize("FO.LevelUpJacketMagAndBooster");
    rollTableName = "Booster Mods";
  } else {
    if (Math.random() < .20) {
      jacketOutcome = game.i18n.localize("FO.LevelUpJacketPebbleInfect");
      rollTableName = "Nano Powers";  
    } else {
      jacketOutcome = game.i18n.localize("FO.LevelUpJacketPebbleNothing");
    }
  }

  // show a single chat message for everything
  const data = {
    agiOutcome,
    hpOutcome,
    jacketOutcome,
    preOutcome,
    strOutcome,
    touOutcome,
    knoOutcome,
  };
  const html = await renderTemplate(LEVEL_UP_ROLL_CARD_TEMPLATE, data);
  ChatMessage.create({
    content: html,
    sound: CONFIG.sounds.dice, // make a single dice sound
    speaker: ChatMessage.getSpeaker({ actor: actor }),
  });

  if (rollTableName) {
    // roll a scroll
    const pack = game.packs.get(FO.packs.tables);
    const content = await pack.getDocuments();
    const table = content.find((i) => i.name === rollTableName);
    await table.draw();
  }

  // set new stats on the actor
  await actor.update({
    ["system.abilities.strength.value"]: newStr,
    ["system.abilities.agility.value"]: newAgi,
    ["system.abilities.presence.value"]: newPre,
    ["system.abilities.toughness.value"]: newTou,
    ["system.abilities.occult.value"]: newKno,
    ["system.hitPoints.max"]: newHp,
    ["system.silver"]: newSilver,
  });
}

async function betterHp(oldHp) {
  const hpRoll = await new Roll("6d10").evaluate();
  if (hpRoll.total >= oldHp) {
    // success, increase HP
    const howMuchRoll = await new Roll("1d6").evaluate();
    return oldHp + howMuchRoll.total;
  } else {
    // no soup for you
    return oldHp;
  }
}

async function betterAbility(oldVal) {
  const roll = await new Roll("1d6").evaluate();
  if (roll.total === 1 || roll.total < oldVal) {
    // decrease, to a minimum of -3
    return Math.max(-3, oldVal - 1);
  } else {
    // increase, to a max of +6
    return Math.min(6, oldVal + 1);
  }
}

function abilityOutcome(abilityName, oldVal, newVal) {
  if (newVal < oldVal) {
    return `Lose ${oldVal - newVal} ${abilityName}`;
  } else if (newVal > oldVal) {
    return `Gain ${newVal - oldVal} ${abilityName}`;
  } else {
    return `${abilityName} unchanged`;
  }
}