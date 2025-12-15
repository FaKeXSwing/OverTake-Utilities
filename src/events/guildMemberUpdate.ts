import { APIEmbedField, Client, EmbedBuilder, EmbedField, GuildMember, TextChannel } from "discord.js";
import config from '../../config.json' with { type: "json" }
const { channels } = config


export async function execute(client: Client, oldMember: GuildMember, newMember: GuildMember) {
    const userId = newMember.user.id
    const embed = new EmbedBuilder()

    if (oldMember.roles.cache.size === newMember.roles.cache.size) return

    if (oldMember.roles.cache.size > newMember.roles.cache.size) {
        embed.setTitle("ROLE(S) REMOVED")
        .setColor("#ED4245")
        .setAuthor({ name: `${newMember.user.tag}`, iconURL: `${newMember.user.displayAvatarURL()}`})
        .setURL(`https://discordapp.com/users/${userId}`)
        .setThumbnail(newMember.displayAvatarURL({ size: 128 }))
        .setFooter({ text: `User ID: ${userId}` })
        .setTimestamp()

        const oldRoles: APIEmbedField[] = []
        oldMember.roles.cache.forEach(role => {
            if (!newMember.roles.cache.has(role.id)) {
                oldRoles.push({
                    name: "Role Removed",
                    value: `<@&${role.id}>`
                })
            }
        })

        if (oldRoles.length > 0)
            embed.addFields(oldRoles)
    } else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
        embed.setTitle("ROLE(S) ADDED")
        .setColor("#57F287")
        .setAuthor({ name: `${newMember.user.tag}`, iconURL: `${newMember.user.displayAvatarURL()}`})
        .setURL(`https://discordapp.com/users/${userId}`)
        .setThumbnail(newMember.displayAvatarURL({ size: 128 }))
        .setFooter({ text: `User ID: ${userId}` })
        .setTimestamp()

        const newRoles: APIEmbedField[] = []
        newMember.roles.cache.forEach(role => {
            if (!oldMember.roles.cache.has(role.id)) {
                newRoles.push({
                    name: "Role Added",
                    value: `<@&${role.id}>`
                })
            }
        })

        if (newRoles.length > 0)
            embed.addFields(newRoles)
    }


    const channel = await client.channels.cache.get(channels.auditLogs) as TextChannel
    if (channel && channel.isTextBased()){
        channel.send({ embeds: [ embed ]})
    }
}