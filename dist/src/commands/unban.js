import { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } from "discord.js";
import { promisify } from "util";
import { getActiveCaseByUserAndInfraction, registerCase } from "../utilities/moderation.js";
import { Infraction } from "../models/case.js";
const wait = promisify(setTimeout);
export const command = {
    data: {
        name: 'unban',
        description: "Unbans a member from a Discord Guild.",
        options: [
            {
                name: 'user_id',
                type: ApplicationCommandOptionType.String,
                description: 'A valid user id to unban.',
                required: true,
            },
            {
                name: 'reason',
                type: ApplicationCommandOptionType.String,
                description: 'A valid reason for unbanning the user.'
            },
        ]
    },
    permissions: PermissionsBitField.Flags.BanMembers,
    callback: async (client, interaction) => {
        interaction.deferReply({ flags: "Ephemeral" });
        await wait(1000);
        const issuerUser = interaction.user;
        const userId = interaction.options.getString("user_id");
        if (!userId)
            return interaction.editReply(`A valid user id must be provided for this command.`);
        const targetUser = await client.users.fetch(userId);
        if (!targetUser || targetUser.bot || targetUser === issuerUser)
            return interaction.editReply(`A valid user must be provided for this command.`);
        if (!interaction.guild)
            return interaction.editReply(`This command can only be run in a guild.`);
        const reason = interaction.options.getString("reason") || "No reason provided";
        try {
            const banCase = await getActiveCaseByUserAndInfraction(interaction.guild.id, targetUser.id, Infraction.BAN);
            if (!banCase)
                return interaction.editReply(`This user is not currently banned!`);
            banCase.active = false;
            await banCase.save();
            await registerCase({
                action: Infraction.UNBAN,
                guildId: interaction.guild.id,
                userId: targetUser.id,
                issuerId: issuerUser.id,
                reason: reason,
                client
            });
            await interaction.guild.members.unban(banCase.userId, reason);
            const embed = new EmbedBuilder()
                .setDescription(`✅ **${targetUser.username} was unbanned** | ${reason}`)
                .setColor("Green");
            interaction.editReply({ embeds: [embed] });
        }
        catch (err) {
            interaction.editReply(`An internal error occured when trying to unban <@${targetUser.id}>: ${err}`);
            console.error(err);
        }
    },
};
