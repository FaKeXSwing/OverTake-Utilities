import { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { promisify } from "util";
import { parseLength } from "../utilities/parseLength.js";
import { registerCase } from "../utilities/moderation.js";
import { Infraction } from "../models/case.js";
const wait = promisify(setTimeout);
export const command = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bans a member from the Discord Guild. TESTING TESTING")
        .addUserOption((option) => option.setName("target")
        .setDescription("A valid user to ban.")
        .setRequired(true))
        .addStringOption((option) => option.setName("reason")
        .setDescription("A valid reason for banning the user."))
        .addStringOption((option) => option.setName("length")
        .setDescription("A valid length for the ban (1d, 2h, 30m etc.).")),
    permissions: PermissionsBitField.Flags.BanMembers,
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
        const length = interaction.options.getString("length");
        const member = interaction.guild?.members.cache.get(targetUser.id);
        if (!member)
            return interaction.editReply(`A valid user must be provided.`);
        // if (!member.bannable) return interaction.editReply(`You do not have permission to ban this user.`) UNCOMMENT WHEN DONE TESTING
        let parsedLength;
        if (length) {
            parsedLength = parseLength(length);
            if (!parsedLength)
                return interaction.editReply(`A valid length must be provided. Use 1d, 2h, 30m, etc.`);
        }
        try {
            await registerCase({
                action: Infraction.BAN,
                guildId: interaction.guild.id,
                userId: targetUser.id,
                issuerId: issuerUser.id,
                reason: reason,
                duration: parsedLength?.ms,
                client
            });
            await member.ban({ reason: reason });
            const embed = new EmbedBuilder()
                .setDescription(`✅ **${targetUser.username} was banned ${parsedLength ? `for ${parsedLength.realtime}` : ""}** | ${reason}`)
                .setColor("Green");
            interaction.editReply({ embeds: [embed] });
        }
        catch (err) {
            interaction.editReply(`An internal error occured when trying to ban <@${targetUser.id}>: ${err}`);
            console.error(err);
        }
    },
};
