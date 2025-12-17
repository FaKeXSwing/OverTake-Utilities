import { EmbedBuilder } from "discord.js";
import config from '../../config.json' with { type: "json" };
const { channels } = config;
export async function execute(client, guildMember) {
    const userId = guildMember.user.id;
    const embed = new EmbedBuilder()
        .setTitle("LEAVE LOG")
        .setDescription(`<@${userId}> has left **${guildMember.guild.name}**`)
        .setColor("#ED4245")
        .setURL(`https://discordapp.com/users/${userId}`)
        .setThumbnail(guildMember.user.displayAvatarURL({ size: 128 }))
        .addFields({ name: "Username", value: `<@${userId}> ${guildMember.user.tag}` }, { name: "Account Created", value: `${new Date(guildMember.user.createdTimestamp).toLocaleDateString()}` })
        .setFooter({ text: `User ID: ${userId}` })
        .setTimestamp();
    const channel = await client.channels.cache.get(channels.auditLogs);
    if (channel && channel.isTextBased()) {
        channel.send({ embeds: [embed] });
    }
}
