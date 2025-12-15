import { EmbedBuilder } from "discord.js";
import config from '../../config.json' with { type: "json" };
const { channels } = config;
export async function execute(client, message) {
    const author = message.author;
    if (!author)
        return;
    const authorId = author.id;
    const originChannelId = message.channelId;
    const embed = new EmbedBuilder()
        .setTitle("MESSAGE LOG")
        .setDescription(`**Message sent by <@${authorId}> deleted in <#${originChannelId}>**`)
        .setColor("#ED4245")
        .setURL(`https://discordapp.com/users/${authorId}`)
        .setThumbnail(author.displayAvatarURL({ size: 128 }))
        .addFields({ name: "Message", value: message.content })
        .setFooter({ text: `User ID: ${authorId} • Message ID: ${message.id}}` })
        .setTimestamp();
    const channel = await client.channels.cache.get(channels.auditLogs);
    if (channel && channel.isTextBased()) {
        channel.send({ embeds: [embed] });
    }
}
