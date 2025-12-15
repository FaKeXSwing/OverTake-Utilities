import { CaseModel, Case, Infraction } from "../models/case";
import { getNextCaseId } from "../models/caseCounter";
import { APIEmbedField, Client, Colors, EmbedBuilder, EmbedField, TextChannel } from "discord.js";
import { convertToRealtime } from "./parseLength";
import { channels } from "../../config.json";
import { HydratedDocument } from "mongoose";

export interface CaseOptions {
    action: Infraction,
    guildId: string,
    userId: string,
    issuerId: string,
    reason?: string,
    duration?: number,
    client: Client
}

export async function checkInfractionExpiry(client: Client) {
    const now = new Date();

    const expiredBans = await CaseModel.find({
        action: Infraction.BAN,
        active: true,
        expiry: { $lte: now }
    });

    for (const banCase of expiredBans) {
        try {
            const guild = client.guilds.cache.get(banCase.guildId)
            if (!guild) continue;

            await guild.members.unban(banCase.userId, "Temporary ban expired");

            banCase.active = false;
            await banCase.save()

            // AUDIT LOGS

            const targetUser = client.users.cache.get(banCase.userId)
            if (!targetUser) return;

            const embed = new EmbedBuilder()
                .setTitle(`USER UNBANNED`)
                .setURL(`https://discordapp.com/users/${banCase.userId}`)
                .setDescription(`<@${banCase.userId}> has been unbanned from **${guild.name}**`)
                .setFooter({ text: `Case ID: ${banCase.caseId} • User ID: ${banCase.userId}` })
                .setColor("#3498DB")
                .setTimestamp()
                .addFields(
                    { name: "👤 User", value: `\`${targetUser.tag}\` (\`${banCase.userId}\`)` }
                )
            const channel = client.channels.cache.get(channels.moderationLogs) as TextChannel
            channel.send({ embeds: [embed] })

            const dmEmbed = new EmbedBuilder()
                .setDescription(`You have been unbanned from **${guild.name}** for reason: Ban Expired`)
                .setColor("Blue")
            try {
                await targetUser.send({ embeds: [dmEmbed] })
            } catch (error) {
                console.log("Failed to send DM to user.")
            }
        } catch (error) {
            console.error(`Failed to unban user ${banCase.userId}: ${error}`)
        }
    }
}

export async function getCaseById(
    guildId: string,
    caseId: number,
): Promise<HydratedDocument<Case> | null> {
    return CaseModel.findOne({ guildId, caseId });
}

export async function getCasesByUser(
    guildId: string,
    userId: string,
): Promise<HydratedDocument<Case>[]> {
    return CaseModel.find({ guildId, userId }).sort({ createdAt: -1 });
}

export async function getActiveCasesByUser(
    guildId: string,
    userId: string,
): Promise<HydratedDocument<Case>[]> {
    return CaseModel.find({
        guildId,
        userId,
        active: true
    })
}

export async function getActiveCaseByUserAndInfraction(
    guildId: string,
    userId: string,
    action: Infraction,
): Promise<HydratedDocument<Case> | null> {
    return CaseModel.findOne({
        guildId,
        userId,
        action,
        active: true
    })
}

export async function getCasesByInfraction(
    guildId: string,
    action: Infraction
): Promise<HydratedDocument<Case>[]> {
    return CaseModel.find({ guildId, action })
}

export async function registerCase({
    action,
    guildId,
    userId,
    issuerId,
    reason,
    duration,
    client
}: CaseOptions) {
    const caseId = await getNextCaseId(guildId);
    const active = [
        Infraction.MUTE,
        Infraction.BAN,
    ].includes(action)

    const expiry = duration !== undefined ? new Date(Date.now() + duration!) : undefined;

    await CaseModel.create({
        caseId,
        guildId,
        userId,
        issuerId,
        action,
        reason,
        duration,
        expiry,
        active
    })

    const targetUser = await client.users.cache.get(userId)
    const issuerUser = await client.users.cache.get(issuerId)
    const guild = await client.guilds.cache.get(guildId)
    if (!targetUser || !issuerUser || !guild) return

    const ACTION_PAST_TENSE: Record<Infraction, string> = {
        WARN: "warned",
        KICK: "kicked",
        BAN: "banned",
        UNBAN: "unbanned",
        MUTE: "muted",
        UNMUTE: "unmuted"
    };

    const pastTense = ACTION_PAST_TENSE[action];

    const locationWord = [
        Infraction.KICK,
        Infraction.BAN,
        Infraction.UNBAN,
    ].includes(action)
        ? "from"
        : "in";

    const ACTION_COLOR: Record<Infraction, number> = {
        WARN: Colors.Yellow,
        MUTE: Colors.Orange,
        KICK: Colors.Red,
        BAN: Colors.Red,
        UNBAN: Colors.Blue,
        UNMUTE: Colors.Blue,
    };

    const isTimedPunishment =
        action === Infraction.BAN || action === Infraction.MUTE;

    // Direct Messages
    const dmEmbed = new EmbedBuilder()
        .setDescription(
            `You have been ${pastTense} ${locationWord} **${guild.name}** for reason: ${reason}${isTimedPunishment
                ? duration && expiry
                    ? `\nThis expires <t:${Math.floor(expiry.getTime() / 1000)}:R> (<t:${Math.floor(expiry.getTime() / 1000)}:f>).`
                    : ""
                : ""
            }`
        )
        .setColor(ACTION_COLOR[action])
    try {
        await targetUser.send({ embeds: [dmEmbed] })
    } catch (error) {
        console.log("Failed to send DM to user.")
    }

    // AUDIT LOGS
    const fields: APIEmbedField[] = [
        {
            name: "👤 User",
            value: `\`${targetUser.tag}\` (\`${targetUser.id}\`)`,
            inline: true,
        },
        {
            name: "👮 Issued By",
            value: `\`${issuerUser.tag}\` (\`${issuerUser.id}\`)`,
            inline: true,
        },
        {
            name: "📝 Reason",
            value: reason,
        },
        duration ? {
            name: "⌛ Duration",
            value: convertToRealtime(duration)
        } : undefined,
        expiry ? {
            name: "⏰ Expiry",
            value: `<t:${Math.floor(expiry.getTime() / 1000)}:f> (<t:${Math.floor(expiry.getTime() / 1000)}:R>)`,
            inline: true
        } : undefined
    ].filter((f): f is APIEmbedField => Boolean(f));

    const auditEmbed = new EmbedBuilder()
        .setTitle(`USER ${pastTense.toUpperCase()}`)
        .setURL(`https://discordapp.com/users/${userId}`)
        .setDescription(`<@${userId}> has been ${pastTense.toLowerCase()} ${locationWord} **${guild.name}** by <@${issuerUser.id}> `)
        .setFooter({ text: `Case ID: ${caseId} • User ID: ${targetUser.id}` })
        .setColor(ACTION_COLOR[action])
        .setTimestamp()
        .addFields(fields)
    const channel = client.channels.cache.get(channels.moderationLogs) as TextChannel
    channel.send({ embeds: [auditEmbed] })
}