import { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } from "discord.js";
import { promisify } from "util";
const wait = promisify(setTimeout);
export const command = {
    data: {
        name: "devmessage",
        description: "Developer only.",
        options: [
            {
                name: 'channel',
                type: ApplicationCommandOptionType.Channel,
                description: 'A valid channel to post in.',
                required: true,
            },
            {
                name: 'message',
                type: ApplicationCommandOptionType.String,
                choices: [
                    { name: "Rules Embed", value: "rulesEmbed" },
                    { name: "About Embed", value: "aboutEmbed" },
                    { name: "Welcome Embed", value: "welcomeEmbed" },
                    { name: "Invest Embed", value: "investEmbed" },
                    { name: "Policies Embed", value: "policiesEmbed" },
                ],
                description: 'Select the embed to post.',
                required: true,
            }
        ]
    },
    restrictions: {
        userRestricted: true,
    },
    permissions: PermissionsBitField.Flags.Administrator,
    callback: async (client, interaction) => {
        const channel = interaction.options.getChannel("channel", true);
        if (!channel || !channel.isTextBased())
            return interaction.reply({ content: "You cannot create a message in this channel!", flags: "Ephemeral" });
        const aboutEmbed = new EmbedBuilder()
            .setTitle("About OverTake Esports")
            .setImage("https://cdn.discordapp.com/attachments/1449408606821945529/1450948572811100210/Pinkbanner.jpg?ex=694464a9&is=69431329&hm=8d55d94f0fea138820ac7f93f8adae4ff3ecc4172e834aa61b7550755ec8468e&")
            .setDescription("**OverTake Esports** covers a variety of competitive esports environments such as Fortnite with **professional players** and **content creators** from Europe, North America, Oceania and more!\n\nJoin us on our journey to the top of the competitive esports world, and whether you are here to compete, connect or grind, you are always welcome in **OverTake Esports**!\n\nWe are actively seeking **skilled players** to fill our competitive rosters, and ambitious **content creators** to help us Over-Take together! If you are interested, be sure to open a ticket with our staff and we will process you into **OverTake Esports**!") //  Overtake Esports | EST. 2025 | Welcome to the official home of Overtake Esports. A competitive esports organization representing EU, NA, and OCE regions. Join us to compete, connect, and rise above the rest. It’s time to control the game and overtake the competition.")
            .setColor("#d768bb")
            .setAuthor({ name: "OverTake Esports", iconURL: "https://cdn.discordapp.com/attachments/1449408606821945529/1450948079477063720/PinkbannerPFP.jpg?ex=69446433&is=694312b3&hm=dc19c5caf99fff1d07d91b62e6f8e7e0429e71c432636739d7a6e9f75223d83b&" });
        const rulesEmbed = new EmbedBuilder()
            .setTitle("Server Rules")
            .setDescription("All community members must adhere to the server rules while conversing in the OverTake Esports server. Rules may be voided by <@&1431663836670460135> and above for any reason deemed necessary.") //are authorized to void certain rules given proper reason, under special circumstances.")
            .setColor("#d768bb")
            .addFields({ name: "1. Follow Discord's Terms of Service", value: "> https://discordapp.com/terms \n > https://discordapp.com/guidelines" }, { name: "2. Be respectful with all members", value: "> Be respectful to others. Death threats, sexism, racism, hate speech, antisemitism, or otherwise hateful content is prohibited." }, { name: "3. Controversial topics and malicious content", value: "> Controversial or otherwise sensitive topics that are not necessarily related to OverTake Esports are to be avoided. Malicious content such as viruses, token grabbers, grabify links, or otherwise dangerous content is prohibited." }, { name: "4. English Only", value: "> We do not have the capacity to moderate other languages. Please keep all messages in English when chatting in OverTake Esports Discord server." }, { name: "5. Use Common Sense", value: "> Use common sense when chatting within our server. Just because something isn't explicitly stated in the rules doesn't mean you won't be punished for it." })
            .setAuthor({ name: "OverTake Esports", iconURL: "https://cdn.discordapp.com/attachments/1449408606821945529/1450948079477063720/PinkbannerPFP.jpg?ex=69446433&is=694312b3&hm=dc19c5caf99fff1d07d91b62e6f8e7e0429e71c432636739d7a6e9f75223d83b&" })
            .setFooter({ text: "By staying in the server you agree to adhere by the server rules." });
        const welcomeEmbed = new EmbedBuilder()
            .setTitle("Welcome to OverTake Esports!")
            .setDescription("Welcome to **OverTake Esports**, <@625777528560418836>!\n\nWe're excited to have you here. OverTake is built on competition, growth, and community. Whether you're here to grind, improve your skills, or just vibe with like-minded players, you're in the right place.")
            .setColor("#d768bb")
            .setImage("https://cdn.discordapp.com/attachments/1449408606821945529/1450948572811100210/Pinkbanner.jpg?ex=694464a9&is=69431329&hm=8d55d94f0fea138820ac7f93f8adae4ff3ecc4172e834aa61b7550755ec8468e&")
            .setAuthor({ name: "OverTake Esports", iconURL: "https://cdn.discordapp.com/attachments/1449408606821945529/1450948079477063720/PinkbannerPFP.jpg?ex=69446433&is=694312b3&hm=dc19c5caf99fff1d07d91b62e6f8e7e0429e71c432636739d7a6e9f75223d83b&" });
        const investEmbed = new EmbedBuilder()
            .setTitle("📈┃Interested in investing in OverTake?")
            .setDescription("Support the future of OverTake Esports by becoming an **early investor**! Any monthly contribution — big or small — is deeply appreciated and helps push us closer to becoming the next **million-dollar esports organization**. \n\nInterested? Contact <@923163161291542548> to discuss details and benefits.\nEarly investors will have priority access when OverTake Esports releases official stock.\n\n Be part of something big and help us **OverTake** together!")
            .setImage("https://cdn.discordapp.com/attachments/1449408606821945529/1450948572811100210/Pinkbanner.jpg?ex=694464a9&is=69431329&hm=8d55d94f0fea138820ac7f93f8adae4ff3ecc4172e834aa61b7550755ec8468e&")
            .setColor("#d768bb")
            .setAuthor({ name: "OverTake Esports", iconURL: "https://cdn.discordapp.com/attachments/1449408606821945529/1450948079477063720/PinkbannerPFP.jpg?ex=69446433&is=694312b3&hm=dc19c5caf99fff1d07d91b62e6f8e7e0429e71c432636739d7a6e9f75223d83b&" });
        const policiesEmbed = new EmbedBuilder()
            .setTitle("⚖️┃Legal Action & Server Protection")
            .setDescription("You're not just messing with a Discord server — you're messing with a company that takes its security seriously.")
            .addFields({ name: "🔐 OverTake is protected", value: "We have legal counsel available in case of major rule-breaking, including, but not limited to the following; \n • Attempting to hack or nuke the server\n • Breaking Discord's Terms of Service\n • Sharing or stealing sensitive data\n • Any form of digital sabotage against the organization or its members" }, { name: "📚 We take this seriously", value: "If any of the above actions occur, our legal representative will review the situation and guide us on next steps — including possible reporting to Discord and beyond." }, { name: "🧠 Reminder", value: "Think before you act — everything done on Discord is logged — actions have consequences." })
            .setImage("https://cdn.discordapp.com/attachments/1449408606821945529/1450948572811100210/Pinkbanner.jpg?ex=694464a9&is=69431329&hm=8d55d94f0fea138820ac7f93f8adae4ff3ecc4172e834aa61b7550755ec8468e&")
            .setColor("#d768bb")
            .setAuthor({ name: "OverTake Esports", iconURL: "https://cdn.discordapp.com/attachments/1449408606821945529/1450948079477063720/PinkbannerPFP.jpg?ex=69446433&is=694312b3&hm=dc19c5caf99fff1d07d91b62e6f8e7e0429e71c432636739d7a6e9f75223d83b&" });
        const embedChoice = interaction.options.getString("message", true);
        const embedMap = {
            rulesEmbed,
            aboutEmbed,
            welcomeEmbed,
            investEmbed,
            policiesEmbed,
        };
        const embedToSend = embedMap[embedChoice];
        const message = await channel.send({
            embeds: [embedToSend],
        });
        interaction.reply({ content: `https://discord.com/channels/${interaction.guildId}/${channel.id}/${message.id}`, flags: "Ephemeral" });
    },
};
