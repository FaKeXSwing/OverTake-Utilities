import { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { promisify } from "util";
import config from '../../config.json' with { type: "json" };
const { channels } = config;
import { getCasesByUser } from "../utilities/moderation.js";
import { convertToRealtime } from "../utilities/parseLength.js";
const wait = promisify(setTimeout);
export const command = {
    data: new SlashCommandBuilder()
        .setName("history")
        .setDescription("Returns the moderation history of a user.")
        .addUserOption((option) => option.setName("target")
        .setDescription("A valid user to view the history of."))
        .addNumberOption((option) => option.setName("page")
        .setDescription("Select the page to view.")),
    permissions: PermissionsBitField.Flags.ModerateMembers,
    callback: async (client, interaction) => {
        const embed = new EmbedBuilder();
        const targetUser = interaction.options.getUser("target") || interaction.user;
        if (!targetUser || targetUser.bot) {
            embed.setDescription("❌ A valid user must be provided for this command.")
                .setColor("Red");
            return interaction.reply({ embeds: [embed], flags: "Ephemeral" });
        }
        if (!interaction.guild) {
            embed.setDescription("❌ This command can only be run in a guild.")
                .setColor("Red");
            return interaction.reply({ embeds: [embed], flags: "Ephemeral" });
        }
        const page = interaction.options.getNumber("page") || 1;
        try {
            const rawCases = await getCasesByUser(interaction.guild.id, targetUser.id);
            if (!rawCases || rawCases.length < 1) {
                embed.setDescription("❌ No history found for that user.")
                    .setColor("Red");
                return interaction.reply({ embeds: [embed], flags: "Ephemeral" });
            }
            rawCases.sort((a, b) => a.caseId - b.caseId);
            const LOGS_PER_PAGE = 5;
            const totalPages = Math.max(1, Math.ceil(rawCases.length / LOGS_PER_PAGE));
            const startIndex = (page - 1) * LOGS_PER_PAGE;
            const endIndex = startIndex + LOGS_PER_PAGE;
            const cases = rawCases.slice(startIndex, endIndex);
            embed.setTitle(`Modlogs for ${targetUser.tag} (Page ${page} of ${totalPages})`)
                .setColor("Blue")
                .setTimestamp()
                .setFooter({ text: `Page ${page} of ${totalPages}` });
            const fields = [];
            const ACTION_FORMATTED = {
                WARN: "Warn",
                KICK: "Kick",
                BAN: "Ban",
                UNBAN: "Unban",
                MUTE: "Mute",
                UNMUTE: "Unmute"
            };
            cases.forEach((c) => {
                fields.push({
                    name: `Case #${c.caseId} • ${ACTION_FORMATTED[c.action]}`,
                    value: `\n**User:** ${targetUser.tag} (${targetUser.id})\n**Moderator:** <@${c.issuerId}> (${targetUser.id})\n${c.duration ? `**Duration:** ${convertToRealtime(c.duration)}\n` : ""}**Reason:** ${c.reason} - <t:${Math.floor(c.createdAt.getTime() / 1000)}:f>`,
                    inline: false,
                });
            });
            embed.addFields(fields);
            interaction.reply({ embeds: [embed] });
        }
        catch (err) {
            interaction.reply({
                content: `An internal error occured when trying to fetch history for <@${targetUser.id}>: ${err}`,
                flags: "Ephemeral"
            });
            console.warn(err);
        }
    },
};
