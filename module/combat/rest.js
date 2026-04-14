import { FO } from "../config.js";
import { pluralize } from "../utils.js";


export const rollRest = async (actor, restLength, starving) => {
  if (starving) {
    await rollStarvation(actor);      
  } else if (restLength === "short") {
    await rollHealHitPoints(actor, "d4");
  } else if (restLength === "long") {
    await rollHealHitPoints(actor, "d6");
    if (actor.system.threads.value === 0) {
      await rollThreads(actor);
    }
    await resetFumbles(actor);
    await unburnApps(actor);
  }
};

async function rollStarvation(actor) {
  const roll = new Roll("1d4");
  await roll.evaluate();
  const flavor = `${game.i18n.localize("FO.Starving")}: ${game.i18n.localize("FO.Lose")} ${roll.total} ${pluralize("FO.HitPoint", "FO.HitPoints", roll.total)}`;
  await roll.toMessage({
    flavor,
    speaker: ChatMessage.getSpeaker({ actor: actor }),
  });

  const newHP = actor.system.hitPoints.value - roll.total;
  await actor.update({ ["system.hitPoints.value"]: newHP });
};

async function rollHealHitPoints(actor, dieRoll) {
  const roll = new Roll(dieRoll);
  await roll.evaluate();
  const flavor = `${game.i18n.localize("FO.Rest")}: ${game.i18n.localize("FO.Heal")} ${roll.total} ${pluralize("FO.HitPoint", "FO.HitPoints", roll.total)}`;
  await roll.toMessage({
    flavor,
    speaker: ChatMessage.getSpeaker({ actor: actor }),
  });

  const newHP = Math.min(
    actor.system.hitPoints.max,
    actor.system.hitPoints.value + roll.total
  );
  await actor.update({ ["system.hitPoints.value"]: newHP });
};

const rollThreads = async (actor) => {
  const classItem = actor.items.filter(x => x.type === FO.itemTypes.class).pop();
  if (!classItem || !classItem.system.threads) {
    return;
  }
  const roll = new Roll(classItem.system.threads);
  await roll.toMessage({
    flavor: game.i18n.localize("FO.Threads"),
    speaker: ChatMessage.getSpeaker({ actor }),
  })
  await actor.update({ ["system.threads"]: { max: roll.total, value: roll.total } });
};

const resetFumbles = async (actor) => {
  await actor.update({ 
    ["system.appFumbleOn"]: 1,
    ["system.boonFumbleOn"]: 1,
  });
};

const unburnApps = async (actor) => {
  for (const item of actor.items) {
    if (item.type === FO.itemTypes.app && item.system.burned) {
      await item.update({ ["system.burned"]: false});
    }
  }
};