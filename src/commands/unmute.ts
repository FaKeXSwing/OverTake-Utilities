import { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } from "discord.js";
import { Command } from "../types/CommandType";
import { promisify } from "util";
import { parseLength } from "../utilities/parseLength";
import { getActiveCaseByUserAndInfraction, registerCase } from "../utilities/moderation";
import { Infraction } from "../models/case";
const wait = promisify(setTimeout)

export const command: Command = {
    data: {
        name: 'unmute',
        description: "Unmutes a member that has been timed out.",
        options: [
            {
                name: 'target',
                type: ApplicationCommandOptionType.User,
                description: 'A valid user to mute.',
                required: true,
            },
            {
                name: 'reason',
                type: ApplicationCommandOptionType.String,
                description: 'A valid reason for unmuting the user.',
            },
        ]
    },

    permissions: PermissionsBitField.Flags.ModerateMembers,

    callback: async (client, interaction) => {
        interaction.deferReply({ flags: "Ephemeral" })

        await wait(1000)

        const issuerUser = interaction.user
        const targetUser = interaction.options.getUser("target")
        if (!targetUser || targetUser.bot || targetUser == issuerUser) return interaction.editReply(`A valid user must be provided for this command.`);
        if (!interaction.guild) return interaction.editReply(`This command can only be run in a guild.`)
        const reason = interaction.options.getString("reason") || "No reason provided"

        const member = interaction.guild?.members.cache.get(targetUser.id)
        if (!member) return interaction.editReply(`A valid user must be provided.`);

        try {
            const muteCase = await getActiveCaseByUserAndInfraction(
                interaction.guild.id,
                targetUser.id,
                Infraction.MUTE,
            )

            if (!muteCase) return interaction.editReply(`This user is not currently muted!`)

            member.timeout(null)

            muteCase.active = false;
            await muteCase.save()

            await registerCase({
                action: Infraction.UNMUTE,
                guildId: interaction.guild.id,
                userId: targetUser.id,
                issuerId: issuerUser.id,
                reason: reason,
                client
            })

            const embed = new EmbedBuilder()
                .setDescription(`✅ **${targetUser.username} was unmuted** | ${reason}`)
                .setColor("Green")

            interaction.editReply({ embeds: [embed] })
        } catch (err) {
            interaction.editReply(`An internal error occured when trying to unmute <@${targetUser.id}>: ${err}`);
            console.error(err);
        }
    },
}