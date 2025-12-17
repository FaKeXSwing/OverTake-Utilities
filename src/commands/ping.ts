import { Command } from "../types/CommandType.js";

export const command: Command = {
    data: {
        name: 'ping',
        description: "Returns the Client's latency.",
    },
    
    callback: async (client, interaction) => {
        interaction.reply({ content: `Pong! | Client Latency: ${client.ws.ping}ms`, flags: "Ephemeral"})
    },
}