export async function showThreadsHelp(actor) {
  await ChatMessage.create({
    content: game.i18n.localize("FO.ThreadsHelpHtml"),
    flavor: game.i18n.localize("FO.Threads"),
    speaker: ChatMessage.getSpeaker({ actor }),
  });
};