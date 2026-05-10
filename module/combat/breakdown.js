import { FO } from "../config.js";
import { documentFromDraw, drawFromTableUuid, simpleData } from "../packutils.js";

export async function rollBreakdown(actor) {
  const draw = await drawFromTableUuid(FO.dismalBreakdownsTable, null, true);
  const breakdown = await documentFromDraw(draw);
  await this.createEmbeddedDocuments("Item", [simpleData(breakdown)]);
}
