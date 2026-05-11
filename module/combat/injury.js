import { FO } from "../config.js";
import { documentFromDraw, drawFromTableUuid, simpleData } from "../packutils.js";

export async function rollInjury(actor) {
  const draw = await drawFromTableUuid(FO.direInjuriesTable, null, true);
  const injury= await documentFromDraw(draw);
  await actor.createEmbeddedDocuments("Item", [simpleData(injury)]);
}
