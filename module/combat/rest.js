import { FO } from "../config.js";
import { pluralize } from "../utils.js";


export async function rollRest(actor, restLength, starving) {
  if (starving) {
    await rollStarvation(actor);      
  } else if (restLength === "short") {
    await rollHeal(actor, "d4");
  } else if (restLength === "long") {
    await rollHeal(actor, "d6");
    await rollWyrd(actor);
    if (actor.system.threads.value === 0) {
      await rollThreads(actor);
    }
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

async function rollHeal(actor, dieRoll) {
  const hp = new Roll(dieRoll);
  await hp.evaluate();
  const hpFlavor = `${game.i18n.localize("FO.Rest")}: ${game.i18n.localize("FO.Heal")} ${hp.total} ${pluralize("FO.HitPoint", "FO.HitPoints", hp.total)}`;
  await hp.toMessage({
    hpFlavor,
    speaker: ChatMessage.getSpeaker({ actor: actor }),
  });

  const sp = new Roll(dieRoll);
  await sp.evaluate();
  const spFlavor = `${game.i18n.localize("FO.Rest")}: ${game.i18n.localize("FO.Heal")} ${sp.total} ${pluralize("FO.StabilityPoint", "FO.StabilityPoints", sp.total)}`;
  await sp.toMessage({
    spFlavor,
    speaker: ChatMessage.getSpeaker({ actor: actor }),
  });

  const newHP = Math.min(
    actor.system.hitPoints.max,
    actor.system.hitPoints.value + hp.total
  );
  const newSP = Math.min(
    actor.system.stabilityPoints.max,
    actor.system.stabilityPoints.value + sp.total
  );
  await actor.update({ ["system.hitPoints.value"]: newHP, ["system.stabilityPoints.value"]: newSP });
};

async function rollWyrd(actor) {
  const roll = new Roll("1d4");
  await roll.evaluate();
  await roll.toMessage({
    flavor: game.i18n.localize("FO.Wyrd"),
    speaker: ChatMessage.getSpeaker({ actor }),
  })
  const newWyrd = Math.min(
    actor.system.wyrd.max,
    actor.system.wyrd.value + roll.total + actor.system.abilities.occult.value
  );
  await actor.update({ ["system.wyrd"]: { value: newWyrd } });
}

async function rollThreads(actor) {
  const tradition = actor.items.filter(x => x.type === FO.itemTypes.tradition).pop();
  const threadDie = tradition ? tradition.threadDie : "1d2";
  const roll = new Roll(threadDie);
  await roll.toMessage({
    flavor: game.i18n.localize("FO.Threads"),
    speaker: ChatMessage.getSpeaker({ actor }),
  })
  await actor.update({ ["system.threads"]: { max: roll.total, value: roll.total } });
}
