import { Schema, model, InferSchemaType } from "mongoose";

export enum Infraction {
    WARN = "WARN",
    MUTE = "MUTE",
    KICK = "KICK",
    BAN = "BAN",
    UNBAN = "UNBAN",
    UNMUTE = "UNMUTE"
}

const caseSchema = new Schema(
    {
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

    },
    { timestamps: true }
)

caseSchema.index({ guildId: 1, userId: 1 });
caseSchema.index({ guildId: 1, caseId: 1 });

export type Case = InferSchemaType<typeof caseSchema>;

export const CaseModel = model(
    "Case",
    caseSchema
)