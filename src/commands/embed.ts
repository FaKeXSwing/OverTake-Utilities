import { ApplicationCommandOptionType, Colors, EmbedBuilder, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import { SlashCommand } from "../types/CommandType.js";
import { promisify } from "util";
const wait = promisify(setTimeout)

export const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("embed")
        .setDescription("DEVELOPER ONLY: Creates a custom embed.")
        .addStringOption((option) =>
            option.setName("title")
                .setDescription("The embed's title.")
        )
        .addStringOption((option) =>
            option.setName("description")
                .setDescription("The embed's description.")
        )
        .addStringOption((option) =>
            option.setName("color")
                .setDescription("A hex color (example: #ff0000).")
        )
        .addStringOption((option) =>
            option.setName("footer")
                .setDescription("The embed's footer.")
        )
        .addStringOption((option) =>
            option.setName("thumbnail")
                .setDescription("The embed's thumbnail.")
        )
        .addStringOption((option) =>
            option.setName("image")
                .setDescription("The embed's image.")
        ),


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

        interaction.deferReply({ flags: "Ephemeral" })

        await wait(1000)

        try {
            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
                .setColor(color as keyof typeof Colors || Colors.DarkGrey);

            if (footer) embed.setFooter({ text: footer });
            if (thumbnail) embed.setThumbnail(thumbnail);
            if (image) embed.setImage(image);

            const channel = interaction.channel as TextChannel
            if (!channel) return interaction.editReply("This command can only be used inside of a guild!")
            channel.send({ embeds: [embed] })

            await interaction.editReply("Successfully created message embed!");
        } catch (err) {
            console.error(err)
            interaction.editReply(`Failed to create message embed for the following reason: ${"```"}${err}${"```"} `)
        }
    },
}