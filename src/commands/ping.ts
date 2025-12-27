import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types/CommandType.js";

export const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Returns the Client's latency."),

    callback: async (client, interaction) => {
        interaction.reply({ content: `Pong! | Client Latency: ${client.ws.ping}ms`, flags: "Ephemeral"})
    },
}