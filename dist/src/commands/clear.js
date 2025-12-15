import { ApplicationCommandOptionType, PermissionsBitField } from "discord.js";
import { promisify } from "util";
const wait = promisify(setTimeout);
export const command = {
    data: {
        name: 'clear',
        description: "Clears a specified amount of messages from the channel.",
        options: [
            {
                name: 'amount',
                type: ApplicationCommandOptionType.Integer,
                description: 'A valid number between 1-100.',
                required: true,
            }
        ]
    },
    permissions: PermissionsBitField.Flags.ManageMessages,
    callback: async (client, interaction) => {
        interaction.deferReply({ flags: "Ephemeral" });
        await wait(1000);
        const amount = interaction.options.getInteger("amount", true);
        if (amount < 1 || amount > 100) {
            return interaction.editReply("You must specify a number between 1 and 100!");
        }
        const channel = interaction.channel;
        if (!channel || !channel.isTextBased()) {
            return interaction.editReply("You cannot clear messages from this channel!");
        }
        try {
            const messages = await channel.messages.fetch({ limit: amount });
            const deletedMessages = await channel.bulkDelete(messages, true);
            interaction.editReply(`Successfully deleted ${deletedMessages.size} messages! `);
        }
        catch (err) {
            console.error(err);
            interaction.editReply("An internal error occured when trying to delete messages.");
        }
    },
};
