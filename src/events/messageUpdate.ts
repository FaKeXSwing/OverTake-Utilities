import { Client, EmbedBuilder, GuildMember, Message, TextChannel } from "discord.js";
import config from '../../config.json' with { type: "json" }
const { channels } = config

export async function execute(client: Client, oldMessage: Message, newMessage: Message) {
    if (!oldMessage.author || oldMessage.author.bot) return;

    const author = oldMessage.author || newMessage.author
    const originChannelId = oldMessage.channelId || newMessage.channelId
    const userId = author.id

    const embed = new EmbedBuilder()
    .setTitle("MESSAGE LOG")
    .setDescription(`**Message sent by <@${userId}> edited in <#${originChannelId}>**`)
    .setColor("#3498DB")
    .setURL(`https://discordapp.com/users/${userId}`)
    .setThumbnail(author.displayAvatarURL({ size: 128}))
    .addFields(
        { name: "Old message", value: oldMessage.content },
        { name: "New message", value: newMessage.content },
    )
    .setFooter({ text: `User ID: ${userId} • Message ID: ${newMessage.id}`})
    .setTimestamp()

    const channel = await client.channels.cache.get(channels.auditLogs) as TextChannel
    if (channel && channel.isTextBased()){
        channel.send({ embeds: [ embed ]})
    }
}