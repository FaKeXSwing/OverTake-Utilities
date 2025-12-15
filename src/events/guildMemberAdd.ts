import { Client, EmbedBuilder, GuildMember, TextChannel } from "discord.js";

export async function execute(client: Client, guildMember: GuildMember) {
    const channelId = "1449408606821945529"
    const userId = guildMember.user.id

    const embed = new EmbedBuilder()
    .setTitle("JOIN LOG")
    .setDescription(`<@${userId}> has joined **${guildMember.guild.name}**`)
    .setColor('#57F287')
    .setURL(`https://discordapp.com/users/${userId}`)
    .setThumbnail(guildMember.user.displayAvatarURL({ size: 128 }))
    .addFields(
        { name: "Username", value: `<@${userId}> ${guildMember.user.tag}` },
        { name: "Account Created", value: `${new Date(guildMember.user.createdTimestamp).toLocaleDateString()}`},
    )
    .setFooter({ text: `ID: ${userId}`})
    .setTimestamp()

    const channel = await client.channels.cache.get(channelId) as TextChannel
    if (channel && channel.isTextBased()){
        channel.send({ embeds: [ embed ]})
    }
}