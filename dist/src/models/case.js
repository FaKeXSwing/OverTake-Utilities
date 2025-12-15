import { Schema, model } from "mongoose";
export var Infraction;
(function (Infraction) {
    Infraction["WARN"] = "WARN";
    Infraction["MUTE"] = "MUTE";
    Infraction["KICK"] = "KICK";
    Infraction["BAN"] = "BAN";
    Infraction["UNBAN"] = "UNBAN";
    Infraction["UNMUTE"] = "UNMUTE";
})(Infraction || (Infraction = {}));
const caseSchema = new Schema({
    caseId: { type: Number, required: true },
    guildId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    issuerId: { type: String, required: true },
    action: {
        type: String,
        enum: Object.values(Infraction),
        required: true,
    },
    reason: {
        type: String,
        default: "No reason provided",
    },
    duration: {
        type: Number, // ms
    },
    expiry: {
        type: Date
    },
    active: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });
caseSchema.index({ guildId: 1, userId: 1 });
caseSchema.index({ guildId: 1, caseId: 1 });
export const CaseModel = model("Case", caseSchema);
