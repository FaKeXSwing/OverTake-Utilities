import { SlashCommandBuilder } from "discord.js";
export const command = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Returns the Client's latency."),
    callback: async (client, interaction) => {
        interaction.reply({ content: `Pong! | Client Latency: ${client.ws.ping}ms`, flags: "Ephemeral" });
    },
};
