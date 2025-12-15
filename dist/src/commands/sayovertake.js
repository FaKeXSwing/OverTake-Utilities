import { ApplicationCommandOptionType, PermissionsBitField } from "discord.js";
import { promisify } from "util";
const wait = promisify(setTimeout);
export const command = {
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
        interaction.deferReply({ flags: "Ephemeral" });
        await wait(1000);
        const message = interaction.options.getString("message");
        const channel = interaction.channel;
        if (message && channel && channel.isTextBased())
            channel.send(message);
        interaction.editReply(`Successfully sent message: ${message}`);
    },
};
