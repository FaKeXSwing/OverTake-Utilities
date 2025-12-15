import { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField, TextChannel } from "discord.js";
import { Command } from "../types/CommandType.js";
import { promisify } from "util";
import { registerCase } from "../utilities/moderation.js";
import { Infraction } from "../models/case.js";

const wait = promisify(setTimeout)

export const command: Command = {
    data: {
        name: 'warn',
        description: "Warns a member for a transgression.",
        options: [
            { 
                name: 'target', 
                type: ApplicationCommandOptionType.User, 
                description: 'A valid user to warn.',
                required: true, 
            },
            { 
                name: 'reason', 
                type: ApplicationCommandOptionType.String, 
                description: 'A valid reason for warning the user.' 
            },
        ]
    },

    permissions: PermissionsBitField.Flags.ModerateMembers,

    callback: async (client, interaction) => {
        interaction.deferReply({ flags: "Ephemeral" })

        await wait(1000)

        const issuerUser = interaction.user
        const targetUser = interaction.options.getUser("target")
        if (!targetUser || targetUser.bot || targetUser === issuerUser) return interaction.editReply(`A valid user must be provided for this command.`);
        if (!interaction.guild) return interaction.editReply(`This command can only be run in a guild.`)
        const reason = interaction.options.getString("reason") || "No reason provided"

        try {
            // TODO: Database Logging
            await registerCase({
                action: Infraction.WARN,
                guildId: interaction.guild.id,
                userId: targetUser.id,
                issuerId: issuerUser.id,
                reason: reason,
                client: client
            })

            // Interaction Reply
            const warnEmbed = new EmbedBuilder()
            .setDescription(`✅ **${targetUser.username} was warned** | ${reason}`)
            .setColor("Green")
            interaction.editReply({ embeds: [ warnEmbed ]})
        } catch (err) {
            console.warn(err)
            interaction.editReply(`An internal error occured when trying to warn <@${targetUser.id}>: ${err}`)
        }
    },
}