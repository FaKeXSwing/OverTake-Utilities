import { ApplicationCommandOptionType, Embed, EmbedBuilder, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import { SlashCommand } from "../types/CommandType.js";
import { promisify } from "util";
import config from '../../config.json' with { type: "json" }
const { channels } = config
import { getCaseById } from "../utilities/moderation.js";
import { Case, Infraction } from "../models/case.js";
import { convertToRealtime } from "../utilities/parseLength.js";

const wait = promisify(setTimeout)

export const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("case")
        .setDescription("Returns a case by a specific case id.")
        .addIntegerOption((option) =>
            option.setName("case_id")
                .setDescription("A valid case id to reference.")
                .setRequired(true)
        ),

    permissions: PermissionsBitField.Flags.ModerateMembers,

    callback: async (client, interaction) => {
        interaction.deferReply({ flags: "Ephemeral" })

        await wait(1000)

        if (!interaction.guild) return interaction.editReply(`This command can only be run in a guild.`)

        const caseId = interaction.options.getInteger("case_id", true)
        const requestedCase = await getCaseById(interaction.guild.id, caseId)
        if (!requestedCase)
            return interaction.editReply(`Unable to find case with the Case ID: ${caseId}`)

        const punishedUser = await client.users.fetch(requestedCase.userId)
        const issuerUser = await client.users.fetch(requestedCase.issuerId)

        const fields = [
            { name: "👤 User", value: `${"`"}${punishedUser.tag}${"`"} (${"`"}${punishedUser.id}${"`"})`, inline: true },
            { name: "👮 Issued By", value: `${"`"}${issuerUser.tag}${"`"} (${"`"}${issuerUser.id}${"`"})` },
            { name: "☎️ Infraction", value: `${"`"}${requestedCase.action}${"`"}`, inline: true },
            { name: "📝 Reason", value: requestedCase.reason, inline: true },
            requestedCase.duration != undefined
                ? { name: "⌛ Duration", value: `${convertToRealtime(requestedCase.duration)}` }
                : undefined,
            requestedCase.expiry != undefined
                ? { name: "⏰ Expiry", value: `<t:${Math.floor(requestedCase.expiry.getTime() / 1000)}:f> (<t:${Math.floor(requestedCase.expiry.getTime() / 1000)}:R>)`, inline: true }
                : undefined
        ];

        const caseEmbed = new EmbedBuilder()
            .setTitle(`CASE ${requestedCase?.caseId}`)
            .setURL(`https://discordapp.com/users/${punishedUser.id}`)
            .setColor("#3498DB")
            .addFields(fields.filter((f): f is Exclude<typeof f, undefined> => Boolean(f)))
            .setFooter({ text: `User ID: ${punishedUser.id}` })
            .setTimestamp(requestedCase.createdAt)
        interaction.editReply({
            embeds: [caseEmbed]
        })
    },
}