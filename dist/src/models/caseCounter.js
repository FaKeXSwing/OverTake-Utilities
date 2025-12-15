import { Schema, model } from "mongoose";
const caseCounterSchema = new Schema({
    guildId: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 },
});
export async function getNextCaseId(guildId) {
    const counter = await caseCounter.findOneAndUpdate({ guildId }, { $inc: { seq: 1 } }, { new: true, upsert: true });
    return counter.seq;
}
export const caseCounter = model("CaseCounter", caseCounterSchema);
