import { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { promisify } from "util";
import { registerCase } from "../utilities/moderation.js";
import { Infraction } from "../models/case.js";
const wait = promisify(setTimeout);
export const command = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kicks a member from the Discord Guild.")
        .addUserOption((option) => option.setName("target")
        .setDescription("A valid user to kick.")
        .setRequired(true))
        .addStringOption((option) => option.setName("reason")
        .setDescription("A valid reason for kicking the user.")),
    permissions: PermissionsBitField.Flags.KickMembers,
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
        const member = interaction.guild?.members.cache.get(targetUser.id);
        if (!member)
            return interaction.editReply(`A valid user must be provided for this command.`);
        try {
            await registerCase({
                action: Infraction.KICK,
                guildId: interaction.guild.id,
                userId: targetUser.id,
                issuerId: issuerUser.id,
                reason: reason,
                client: client
            });
            await member.kick(reason);
            const embed = new EmbedBuilder()
                .setDescription(`✅ **${targetUser.username} was kicked** | ${reason}`)
                .setColor("Green");
            interaction.editReply({ embeds: [embed] });
        }
        catch (err) {
            interaction.editReply(`An internal error occured when trying to warn <@${targetUser.id}>: ${err}`);
            console.warn(err);
        }
    },
};
