import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentBuilder, EmbedBuilder, PermissionsBitField, TextChannel } from "discord.js";
import { Command } from "../types/CommandType.js";
import { promisify } from "util";
const wait = promisify(setTimeout)

export const command: Command = {
    data: {
        name: "devmessage",
        description: "Developer only.",
    },

    restrictions: {
        userRestricted: true,
        serverRestricted: true,
    },

    callback: async (client, interaction) => {
        const channel = interaction.channel as TextChannel
        if (!channel || !channel.isTextBased())
            return interaction.reply({ content: "You cannot create a verification in this channel!", flags: "Ephemeral" })

        const aboutEmbed = new EmbedBuilder()
            .setTitle("About OverTake Esports")
            .setDescription("Overtake Esports | EST. 2025 | Welcome to the official home of Overtake Esports. A competitive esports organization representing EU, NA, and OCE regions. Join us to compete, connect, and rise above the rest. It’s time to control the game and overtake the competition.")
            .setColor("#d768bb")

        const rulesEmbed = new EmbedBuilder()
            .setTitle("Server Rules")
            .setDescription("All community members must adhere to the server rules while conversing in the OverTake Esports server. <@&1324152526148341790> are authorized to void certain rules given proper reason, under special circumstances.")
            .setColor("#d768bb")
            .addFields(
                { name: "1. Follow Discord's Terms of Service", value: "> https://discordapp.com/terms \n > https://discordapp.com/guidelines" },
                { name: "2. Be respectful with all members", value: "> Be respectful to others. Death threats, sexism, racism, hate speech, antisemitism, or otherwise hateful content is prohibited." },
                { name: "3. Controversial topics and malicious content", value: "> Controversial or otherwise sensitive topics that are not necessarily related to OverTake Esports are to be avoided. Malicious content such as viruses, token grabbers, grabify links, or otherwise dangerous content is prohibited." },
                { name: "4. English Only", value: "> We do not have the capacity to moderate other languages. Please keep all messages in English when chatting in OverTake Esports Discord server." },
                { name: "5. Use Common Sense", value: "> Use common sense when chatting within our server. Just because something isn't explicitly stated in the rules doesn't mean you won't be punished for it." }
            )
            .setFooter({ text: "By verifying you agree to adhere by the server rules." })

        const verifyRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('verify_button')
                .setLabel("Verify")
                .setStyle(ButtonStyle.Success)
                .setEmoji("✅"),
            new ButtonBuilder()
                .setLabel("TikTok")
                .setStyle(ButtonStyle.Link)
                .setURL("https://www.tiktok.com/@notovertake"),
        )

        const welcomeEmbed = new EmbedBuilder()
            .setTitle("Welcome to OverTake Esports!")
            .setDescription("Welcome to OverTake Esports, @Swing!\nWe're excited to have you here. OverTake is built on competition, growth, and community. Whether you're here to grind, improve your skills, or just vibe with like-minded players, you’re in the right place.")
            .setColor("#d768bb")
            .setAuthor({name: "OverTake Esports", iconURL: "https://cdn.discordapp.com/attachments/1449408606821945529/1449836237773996072/PinkbannerPFP.jpg?ex=694058b7&is=693f0737&hm=d03224b8671eb532d888ad74bbd412964ec4ff71bc5db8fe5b4808756f736c60&" })
            // .setThumbnail(interaction.user.displayAvatarURL({ size: 128 }))

        channel.send({
            embeds: [aboutEmbed],
            // components: [ verifyRow ]
        })

        interaction.reply({ content: "Done!", flags: "Ephemeral" })
    },
}