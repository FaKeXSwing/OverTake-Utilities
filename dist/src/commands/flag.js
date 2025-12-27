import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContextMenuCommandBuilder, EmbedBuilder } from "discord.js";
import { promisify } from "util";
const wait = promisify(setTimeout);
export const command = {
    data: new ContextMenuCommandBuilder()
        .setName("Flag Message")
        .setType(3),
    callback: async (client, interaction) => {
        const message = interaction.targetMessage;
        const author = message.author;
        if (author.bot)
            return interaction.reply({ content: "You cannot flag messages from other bots!", flags: "Ephemeral" });
        const guild = message.guild;
        if (!guild)
            return interaction.reply({ content: "You cannot flag messages outside of servers!", flags: "Ephemeral" });
        const channel = client.channels.cache.get("1449408606821945529"); // FIX WHEN PROD
        if (!channel || !channel.isTextBased())
            return interaction.reply({ content: "Failed to flag message; A valid logging channel must be set up.", flags: "Ephemeral" });
        const embed = new EmbedBuilder()
            .setTitle("MESSAGE FLAGGED!")
            .setDescription(`A message was flagged in **${guild.name}**`)
            .setURL(message.url)
            .setColor("Blue")
            .setTimestamp()
            .setFooter({ text: `User ID: ${author.id}` })
            .addFields({ name: "👮 Reported By", value: `${interaction.user} ${interaction.user.tag}` }, { name: "👤 Reported User", value: `${author} ${author.tag}` }, { name: "📝 Message", value: `${message}` });
        const row = new ActionRowBuilder()
            .addComponents(new ButtonBuilder()
            .setLabel("View Message")
            .setURL(message.url)
            .setStyle(ButtonStyle.Link), new ButtonBuilder()
            .setLabel("Delete Message")
            .setCustomId("delete_messages")
            // .setEmoji("🗑️")
            .setStyle(ButtonStyle.Danger));
        const loggedMessage = await channel.send({ embeds: [embed], components: [row] });
        const collector = channel.createMessageComponentCollector({ filter: i => i.customId === "delete_messages" });
        collector.on('collect', async (i) => {
            if (i.customId !== "delete_messages")
                return;
            i.deferReply({ flags: "Ephemeral" });
            await wait(1000);
            try {
                await message.delete();
                embed.setColor("Red");
                embed.setFields({ name: "👤 Reported User", value: `${author} ${author.tag}` }, { name: "👮 Reported By", value: `${interaction.user} ${interaction.user.tag}` }, { name: "🗑️ Deleted By", value: `${i.user} ${i.user.tag}` }, { name: "📝 Message", value: `${message}` });
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                loggedMessage.edit({ embeds: [embed], components: [row] });
                collector.stop();
                i.editReply("Successfully deleted message!");
            }
            catch (error) {
                if (error.code === 10008) {
                    embed.setColor("Red");
                    embed.setFields({ name: "👤 Reported User", value: `${author} ${author.tag}` }, { name: "👮 Reported By", value: `${interaction.user} ${interaction.user.tag}` }, { name: "🗑️ Deleted By", value: `Unknown` }, { name: "📝 Message", value: `${message}` });
                    row.components[0].setDisabled(true);
                    row.components[1].setDisabled(true);
                    loggedMessage.edit({ embeds: [embed], components: [row] });
                    collector.stop();
                    return i.editReply("Message has already been deleted!");
                }
                console.error(error);
                i.editReply(`An internal error occured when trying to delete message; ${error}`);
            }
        });
        interaction.reply({ content: `Successfully flagged message!`, flags: "Ephemeral" });
    },
};
