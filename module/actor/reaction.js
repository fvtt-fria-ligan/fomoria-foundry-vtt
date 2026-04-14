/**
 * Roll reaction.
 */
 export async function rollReaction(actor) {
  const reactionRoll = new Roll("2d6");
  await reactionRoll.evaluate();
  let key = "";
  if (reactionRoll.total <= 3) {
    key = "FO.ReactionHostile";
  } else if (reactionRoll.total <= 6) {
    key = "FO.ReactionAngered";
  } else if (reactionRoll.total <= 8) {
    key = "FO.ReactionIndifferent";
  } else if (reactionRoll.total <= 10) {
    key = "FO.ReactionCurious";
  } else {
    key = "FO.ReactionAsksForHelp";
  }
  const reactionText = `${actor.name} ${game.i18n.localize(key)}.`;
  await reactionRoll.toMessage({
    flavor: reactionText,
    speaker: ChatMessage.getSpeaker({ actor }),
  });
};