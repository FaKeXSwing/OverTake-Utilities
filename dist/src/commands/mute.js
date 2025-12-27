import { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { promisify } from "util";
import { parseLength } from "../utilities/parseLength.js";
import { registerCase } from "../utilities/moderation.js";
import { Infraction } from "../models/case.js";
const wait = promisify(setTimeout);
export const command = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Mutes a member for a transgression.")
        .addUserOption((option) => option.setName("target")
        .setDescription("A valid user to timeout.")
        .setRequired(true))
        .addStringOption((option) => option.setName("length")
        .setDescription("A valid length for the mute (1d, 2h, 30m etc.).")
        .setRequired(true))
        .addStringOption((option) => option.setName("reason")
        .setDescription("A valid reason for muting the user.")),
    permissions: PermissionsBitField.Flags.ModerateMembers,
    callback: async (client, interaction) => {
        interaction.deferReply({ flags: "Ephemeral" });
        await wait(1000);
        const issuerUser = interaction.user;
        const targetUser = interaction.options.getUser("target");
        if (!targetUser || targetUser.bot || targetUser === issuerUser)
            return interaction.editReply(`A valid user must be provided for this command.`);
        if (!interaction.guild)
            return interaction.editReply(`This command can only be run in a guild.`);
        const reason = interaction.options.getString("reason") || "No reason provided";
        const length = interaction.options.getString("length", true);
        const member = interaction.guild?.members.cache.get(targetUser.id);
        if (!member)
            return interaction.editReply(`A valid user must be provided.`);
        const parsedLength = parseLength(length);
        if (!parsedLength)
            return interaction.editReply(`A valid length must be provided. Use 1d, 2h, 30m, etc.`);
        try {
            await registerCase({
                action: Infraction.MUTE,
                guildId: interaction.guild.id,
                userId: targetUser.id,
                issuerId: issuerUser.id,
                reason: reason,
                duration: parsedLength?.ms,
                client
            });
            member.timeout(parsedLength.ms, reason);
            const embed = new EmbedBuilder()
                .setDescription(`✅ **${targetUser.username} was muted for ${parsedLength.realtime}** | ${reason}`)
                .setColor("Green");
            interaction.editReply({ embeds: [embed] });
        }
        catch (err) {
            interaction.editReply(`An internal error occured when trying to mute <@${targetUser.id}>: ${err}`);
            console.error(err);
        }
    },
};
