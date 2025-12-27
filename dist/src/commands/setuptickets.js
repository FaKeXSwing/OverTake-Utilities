import { ActionRowBuilder, EmbedBuilder, PermissionsBitField, SlashCommandBuilder, StringSelectMenuBuilder } from "discord.js";
export const command = {
    data: new SlashCommandBuilder()
        .setName("setuptickets")
        .setDescription("Developer only.")
        .addStringOption((option) => option.setName("message")
        .setDescription("Select the embed to post.")
        .setRequired(true)
        .addChoices({ name: "Applications", value: "applications" }, { name: "Support", value: "support" }))
        .addChannelOption((option) => option.setName("channel")
        .setDescription("A valid channel to post in.")),
    restrictions: {
        userRestricted: true,
    },
    permissions: PermissionsBitField.Flags.Administrator,
    callback: async (client, interaction) => {
        const channel = interaction.options.getChannel("channel") || interaction.channel;
        if (!channel || !channel.isTextBased())
            return interaction.reply({ content: "You cannot create a message in this channel!", flags: "Ephemeral" });
        const applicationsEmbed = new EmbedBuilder()
            .setTitle("📝┃Applications") // Might change title
            .setDescription("All applications for **OverTake Esports** can be found below.")
            // .addFields(
            //     { name: "<:Fortnite:1336739735237824582> Fortnite Roster", value: "" },
            //     { name: "<:Valorant:1336739039105253419> Valorant Roster", value: "" },
            //     { name: "<:rocketleague:1451109494355529850> Rocket League Roster", value: "" },
            //     { name: "<:staff:1450722785142767727> Server Staff", value: "" },
            //     { name: "<:HR:1450722743577215097> Management", value: "" },
            // )
            .setColor("Yellow");
        // .setAuthor({ name: "OverTake Esports", iconURL: "https://cdn.discordapp.com/attachments/1449408606821945529/1450948079477063720/PinkbannerPFP.jpg?ex=69446433&is=694312b3&hm=dc19c5caf99fff1d07d91b62e6f8e7e0429e71c432636739d7a6e9f75223d83b&" })
        const applicationsRow = new ActionRowBuilder()
            .addComponents(new StringSelectMenuBuilder()
            .setCustomId("tickets_application")
            .setPlaceholder("Select a ticket!")
            .addOptions({ label: "Fortnite Roster", value: "fortnite", emoji: "<:Fortnite:1336739735237824582>" }, { label: "Valorant Roster", value: "valorant", emoji: "<:Valorant:1336739039105253419>" }, { label: "Rocket League Roster", value: "rocketleague", emoji: "<:rocketleague:1451109494355529850>" }, { label: "Server Staff", value: "staff", emoji: "<:staff:1450722785142767727>" }, { label: "Management", value: "hr", emoji: "<:HR:1450722743577215097>" }));
        const ticketsEmbed = new EmbedBuilder()
            .setTitle("☎️┃ Support") // Might change title
            .setDescription("All support tickets for **OverTake Esports** can be found below.")
            // .addFields(
            //     { name: "🔎 Report a Violation", value: "Report any violation of the **Community Rules**." },
            //     { name: "👮 Report a Moderator", value: "Report misconduct from a **Moderator** or **Staff**." },
            //     { name: "📝 Appeal a Moderation", value: "Appeal a punishment issued by **OverTake Esports**." },
            //     { name: "❓ Other", value: "Any other inquiry or request to **OverTake Esports**." },
            // )
            .setColor("Red");
        // .setAuthor({ name: "OverTake Esports", iconURL: "https://cdn.discordapp.com/attachments/1449408606821945529/1450948079477063720/PinkbannerPFP.jpg?ex=69446433&is=694312b3&hm=dc19c5caf99fff1d07d91b62e6f8e7e0429e71c432636739d7a6e9f75223d83b&" })
        const ticketsRow = new ActionRowBuilder()
            .addComponents(new StringSelectMenuBuilder()
            .setCustomId("tickets_support")
            .setPlaceholder("Select a ticket!")
            .addOptions({ label: "Report a Violation", value: "report", emoji: "🔎" }, { label: "Report a Moderator", value: "misconduct", emoji: "👮" }, { label: "Appeal a Moderation", value: "appeal", emoji: "📝" }, { label: "Other", value: "misc", emoji: "❓" }));
        const choice = interaction.options.getString("message", true);
        const embedMap = {
            "applications": applicationsEmbed,
            "support": ticketsEmbed,
        };
        const componentMap = {
            "applications": applicationsRow,
            "support": ticketsRow,
        };
        const embedToSend = embedMap[choice];
        const rowToSend = componentMap[choice];
        const message = await channel.send({
            embeds: [embedToSend],
            components: [rowToSend]
        });
        // const message = await channel.send({
        //     embeds: [ticketsEmbed],
        //     components: [ticketsRow]
        // })
        interaction.reply({ content: `https://discord.com/channels/${interaction.guildId}/${channel.id}/${message.id}`, flags: "Ephemeral" });
    },
};
