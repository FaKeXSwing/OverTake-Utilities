import { PermissionFlagsBits, PermissionsBitField } from "discord.js";
import { Command } from "../types/CommandType";
import { promisify } from "util";
const wait = promisify(setTimeout)

export const command: Command = {
    data: {
        name: 'ping',
        description: "Returns the Client's latency.",
    },
    
    callback: async (client, interaction) => {
        // interaction.deferReply({ flags: "Ephemeral" })

        // await wait(3000)

        // interaction.editReply(`Pong! | Client Latency: ${client.ws.ping}ms`)
        interaction.reply({ content: `Pong! | Client Latency: ${client.ws.ping}ms`, flags: "Ephemeral"})
    },
}