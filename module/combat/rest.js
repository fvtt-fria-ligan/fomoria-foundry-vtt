import { FO } from "../config.js";
import { pluralize } from "../utils.js";


export async function rollRest(actor, restLength, starving, infected, dread) {
  console.log("infected", infected);
  if (actor.isDead()) {
    // no resting when dead
    return;
  }

  let canHealHP = true;
  let canHealSP = true;

  if (starving) {
    canHealHP = false;
    canHealSP = false;
    await rollStarvation(actor);
    if (actor.isDead()) {
      // died from starvation breakdown
      return;
    }
    if (actor.system.hitPoints.value === 0) {
      await actor.die();
      return;
    }
  }

  if (infected) {
    canHealHP = false;
    await rollInfection(actor);
    if (actor.system.hitPoints.value === 0) {
      await actor.die();
      return;
    }
  }

  if (dread) {
    canHealSP = false;
    await rollDread(actor);
    if (actor.isDead()) {
      // died from dread breakdown
      return;
    }
  }

  if (restLength === "short") {
    await rollHeal(actor, "d4", canHealHP, canHealSP);
  } else if (restLength === "long") {
    await rollHeal(actor, "d6", canHealHP, canHealSP);
    await rollWyrd(actor);
    await rollThreads(actor);
  }
};

async function rollLoseHitPointa(actor, formula, causeKey) {
  const hpRoll = new Roll(formula);
  await hpRoll.evaluate();
  const flavor = `${game.i18n.localize(causeKey)}: ${game.i18n.localize("FO.Lose")} ${hpRoll.total} ${pluralize("FO.HitPoint", "FO.HitPoints", hpRoll.total)}`;
  await hpRoll.toMessage({
    flavor,
    speaker: ChatMessage.getSpeaker({ actor: actor }),
  });
  await actor.loseHitPoints(hpRoll.total);
}

async function rollLoseStabilityPoints(actor, formula, causeKey) {
  const spRoll = new Roll("1d4");
  await spRoll.evaluate();
  const flavor = `${game.i18n.localize(causeKey)}: ${game.i18n.localize("FO.Lose")} ${spRoll.total} ${pluralize("FO.StabilityPoint", "FO.StabilityPoints", spRoll.total)}`;
  await spRoll.toMessage({
    flavor,
    speaker: ChatMessage.getSpeaker({ actor: actor }),
  });
  await actor.loseStabilityPoints(spRoll.total);
}

async function rollStarvation(actor) {
  await rollLoseHitPointa(actor, "1d4", "FO.Starving");
  await rollLoseStabilityPoints(actor, "1d4", "FO.Starving");
};

async function rollInfection(actor) {
  await rollLoseHitPointa(actor, "1d4", "FO.Infected");
};

async function rollDread(actor) {
  await rollLoseStabilityPoints(actor, "1d4", "FO.Dread");
};

async function rollHeal(actor, formula, canHealHP, canHealSP) {
  if (canHealHP) {
    const hp = new Roll(formula);
    await hp.evaluate();
    const hpFlavor = `${game.i18n.localize("FO.Rest")}: ${game.i18n.localize("FO.Heal")} ${hp.total} ${pluralize("FO.HitPoint", "FO.HitPoints", hp.total)}`;
    await hp.toMessage({
      flavor: hpFlavor,
      speaker: ChatMessage.getSpeaker({ actor: actor }),
    });
    const newHP = Math.min(
      actor.system.hitPoints.max,
      actor.system.hitPoints.value + hp.total
    );
    await actor.update({ ["system.hitPoints.value"]: newHP });
  }

  if (canHealSP) {
    const sp = new Roll(formula);
    await sp.evaluate();
    const spFlavor = `${game.i18n.localize("FO.Rest")}: ${game.i18n.localize("FO.Heal")} ${sp.total} ${pluralize("FO.StabilityPoint", "FO.StabilityPoints", sp.total)}`;
    await sp.toMessage({
      flavor: spFlavor,
      speaker: ChatMessage.getSpeaker({ actor: actor }),
    });
    const newSP = Math.min(
      actor.system.stabilityPoints.max,
      actor.system.stabilityPoints.value + sp.total
    );
    await actor.update({ ["system.stabilityPoints.value"]: newSP });
  }
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
