import { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import { SlashCommand } from "../types/CommandType.js";
import { promisify } from "util";
const wait = promisify(setTimeout)

export const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("sayovertake")
        .setDescription("Says a message as OverTake Utilities")
        .addStringOption((option) =>
            option.setName("message")
                .setDescription("A message to send as the bot.")
                .setRequired(true)
        ),

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