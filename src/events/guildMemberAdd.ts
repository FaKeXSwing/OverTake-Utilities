import { Client, EmbedBuilder, GuildMember, TextChannel } from "discord.js";
import config from '../../config.json' with { type: "json" }
const { channels } = config

export async function execute(client: Client, guildMember: GuildMember) {
    const userId = guildMember.user.id

    const welcomeEmbed = new EmbedBuilder()
        .setTitle("Welcome to OverTake Esports!")
        .setDescription(`Welcome to **OverTake Esports**, <@${userId}>!\n\nWe're excited to have you here. OverTake is built on competition, growth, and community. Whether you're here to grind, improve your skills, or just vibe with like-minded players, you're in the right place.`)
        .setColor("#d768bb")
        .setImage("https://cdn.discordapp.com/attachments/1449408606821945529/1450948572811100210/Pinkbanner.jpg?ex=694464a9&is=69431329&hm=8d55d94f0fea138820ac7f93f8adae4ff3ecc4172e834aa61b7550755ec8468e&")
        .setAuthor({ name: "OverTake Esports", iconURL: "https://cdn.discordapp.com/attachments/1449408606821945529/1450948079477063720/PinkbannerPFP.jpg?ex=69446433&is=694312b3&hm=dc19c5caf99fff1d07d91b62e6f8e7e0429e71c432636739d7a6e9f75223d83b&" })

    const welcomeChannel = await client.channels.cache.get(channels.welcomeChannel) as TextChannel
    if (welcomeChannel && welcomeChannel.isTextBased())
        welcomeChannel.send({ embeds: [ welcomeEmbed ]})

    const auditEmbed = new EmbedBuilder()
        .setTitle("JOIN LOG")
        .setDescription(`<@${userId}> has joined **${guildMember.guild.name}**`)
        .setColor('#57F287')
        .setURL(`https://discordapp.com/users/${userId}`)
        .setThumbnail(guildMember.user.displayAvatarURL({ size: 128 }))
        .addFields(
            { name: "Username", value: `<@${userId}> ${guildMember.user.tag}` },
            { name: "Account Created", value: `${new Date(guildMember.user.createdTimestamp).toLocaleDateString()}` },
        )
        .setFooter({ text: `ID: ${userId}` })
        .setTimestamp()

    const channel = await client.channels.cache.get(channels.auditLogs) as TextChannel
    if (channel && channel.isTextBased()) {
        channel.send({ embeds: [auditEmbed] })
    }
}