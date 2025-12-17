import { ApplicationCommandOptionType, Colors, EmbedBuilder, PermissionsBitField } from "discord.js";
import { promisify } from "util";
const wait = promisify(setTimeout);
export const command = {
    data: {
        name: "embed",
        description: "Create a custom embed.",
        options: [
            {
                name: "title",
                description: "The title of the embed",
                type: ApplicationCommandOptionType.String,
                required: false
            },
            {
                name: "description",
                description: "The embed's description",
                type: ApplicationCommandOptionType.String,
                required: false
            },
            {
                name: "color",
                description: "A hex color (example: #ff0000)",
                type: ApplicationCommandOptionType.String,
                required: false
            },
            {
                name: "footer",
                description: "Footer text",
                type: ApplicationCommandOptionType.String,
                required: false
            },
            {
                name: "thumbnail",
                description: "Thumbnail image URL",
                type: ApplicationCommandOptionType.String,
                required: false
            },
            {
                name: "image",
                description: "Main image URL",
                type: ApplicationCommandOptionType.String,
                required: false
            },
        ]
    },
    restrictions: {
        userRestricted: true,
    },
    permissions: PermissionsBitField.Flags.Administrator,
    callback: async (client, interaction) => {
        const title = interaction.options.getString("title");
        const description = interaction.options.getString("description");
        const color = interaction.options.getString("color") ?? "#2b2d31";
        const footer = interaction.options.getString("footer");
        const thumbnail = interaction.options.getString("thumbnail");
        const image = interaction.options.getString("image");
        interaction.deferReply({ flags: "Ephemeral" });
        await wait(1000);
        try {
            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
                .setColor(color || Colors.DarkGrey);
            if (footer)
                embed.setFooter({ text: footer });
            if (thumbnail)
                embed.setThumbnail(thumbnail);
            if (image)
                embed.setImage(image);
            const channel = interaction.channel;
            if (!channel)
                return interaction.editReply("This command can only be used inside of a guild!");
            channel.send({ embeds: [embed] });
            await interaction.editReply("Successfully created message embed!");
        }
        catch (err) {
            console.error(err);
            interaction.editReply(`Failed to create message embed for the following reason: ${"```"}${err}${"```"} `);
        }
    },
};
