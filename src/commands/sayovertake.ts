import { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField, TextChannel } from "discord.js";
import { Command } from "../types/CommandType";
import { promisify } from "util";
import { channels } from '../../config.json'

const wait = promisify(setTimeout)

export const command: Command = {
    data: {
        name: 'sayovertake',
        description: "Says a message as OverTake Utilities.",
        options: [
            { 
                name: 'message', 
                type: ApplicationCommandOptionType.String, 
                description: 'A message to send as the bot.',
                required: true
            },
        ]
    },

    permissions: PermissionsBitField.Flags.Administrator,

    restrictions: {
        userRestricted: true
    },

    callback: async (client, interaction) => {
        interaction.deferReply({ flags: "Ephemeral" })

        await wait(1000)

        const message = interaction.options.getString("message")
        const channel = interaction.channel as TextChannel
        if (message && channel && channel.isTextBased())
            channel.send(message)

        interaction.editReply(`Successfully sent message: ${message}`)
    },
}