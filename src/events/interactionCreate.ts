import { Client, EmbedBuilder, GuildMember, Interaction } from "discord.js";
import config from '../../config.json' with { type: "json" }
const { servers, developers, categories, roles } = config
import { commands } from "../utilities/commands.js";
import { AnyCommand, Command } from "../types/CommandType.js";

type TicketType = "application" | "support";

function isAuthorized(interaction: Interaction, command: AnyCommand) {
    if (command.restrictions) {
        if (command.restrictions.serverRestricted && interaction.guildId !== servers.development)
            return [false, "| Development Server only."]

        if (command.restrictions.userRestricted && !developers.includes(interaction.user.id))
            return [false, "| Developer Only."]
    }

    if (command.permissions) {
        const author = interaction.member as GuildMember
        if (!author) return [false, "| Guild Only."]

        if (!author.permissions.has(command.permissions))
            return [false]
    }

    return [true]
}

export async function execute(client: Client, interaction: Interaction) {
    if (interaction.isChatInputCommand() || interaction.isMessageContextMenuCommand() || interaction.isUserContextMenuCommand()) {
        const command = commands.get(interaction.commandName) as Command<typeof interaction, any>
        if (!command) return

        const errorEmbed = new EmbedBuilder().setColor("Red")

        const [hasPermission, missingPermission] = isAuthorized(interaction, command)
        if (!hasPermission) {
            errorEmbed.setDescription(`❌ **You are not authorized to run this command!** ${missingPermission || ""}`)
            return interaction.reply({ embeds: [errorEmbed], flags: "Ephemeral" })
        }

        try {
            await command.callback(client, interaction)
        } catch (error) {
            console.error(error)
            errorEmbed.setDescription(`❌ **An internal error occured when running the command** | ${error}`)
            return interaction.reply({ embeds: [errorEmbed], flags: "Ephemeral" })
        }
    }
}

// export async function execute(client: Client, interaction: Interaction) {
//     if (interaction.isButton()) {
//         if (interaction.customId === 'verify_button') {
//             const roleId = '1422241774033961031'
//             const verifiedRole = interaction.guild?.roles.cache.get(roleId)
//             if (!verifiedRole)
//                 return interaction.reply({
//                     content: `❌ Failed to find verification role with ID: ${roleId}`,
//                     flags: "Ephemeral"
//                 })

//             const member = interaction.member
//             if (!member || !(member instanceof GuildMember))
//                 return interaction.reply({
//                     content: `❌ You cannot use this interaction outside of a guild.`,
//                     flags: "Ephemeral"
//                 })

//             if (member.roles.cache.has(roleId)) {
//                 return interaction.reply({
//                     content: `❌ You are already verified in **${interaction.guild?.name}**!`,
//                     flags: "Ephemeral"
//                 })
//             }

//             try {
//                 await member.roles.add(verifiedRole);
//                 interaction.reply({
//                     content: `✅ Successfully gave the <@&${roleId}> role!`,
//                     flags: "Ephemeral"
//                 })

//             } catch (error) {
//                 console.error(error)
//                 interaction.reply({
//                     content: "❌ An internal error occured during the verification.",
//                     flags: "Ephemeral"
//                 })
//             }
//         }
//     } else if (interaction.isStringSelectMenu()) {
//         if (interaction.customId.match("tickets")) {
//             const ticketType = interaction.customId.split("_")[1] as TicketType
//             const ticketChoiceRaw = interaction.values[0]
//             const guild = interaction.guild!
//             const user = interaction.user;

//             const staffRole = guild.roles.cache.get(roles.dev_staff)
//             if (!staffRole) return

//             const categoryId = categories[ticketType]
//             if (!categoryId) return

//             const channel = await guild.channels.create({
//                 name: `ticket_${user.username}`,
//                 type: ChannelType.GuildText,
//                 parent: categoryId,
//                 permissionOverwrites: [
//                     {
//                         id: guild.roles.everyone,
//                         deny: [PermissionFlagsBits.ViewChannel],
//                     },
//                     {
//                         id: staffRole,
//                         allow: [
//                             PermissionFlagsBits.ViewChannel,
//                             PermissionFlagsBits.SendMessages,
//                             PermissionFlagsBits.ReadMessageHistory
//                         ]
//                     }
//                 ]
//             })

//             const ticketChoices: Record<string, string> = {
//                 "fortnite": "Fortnite Roster",
//                 "valorant": "Valorant Roster",
//                 "rocketleague": "Rocket League Roster",
//                 "staff": "Server Staff"
//             }

//             const ticketChoice = ticketChoices[ticketChoiceRaw]

//             const dmEmbed = new EmbedBuilder()
//                 .setTitle(`${ticketType.toUpperCase()} TICKET CREATED!`)
//                 .setDescription(`📨 **${ticketChoice}** ticket created! Please be patient while staff reviews your ticket. Any messages sent here will be forwarded and reacted with a green checkmark. If you wish to close the ticket, please ask a staff member in your ticket.`)
//                 .addFields(
//                     { name: "🔢 Ticket ID", value: "TBD" },
//                     { name: "📝 Reason", value: "No reason provided." }
//                 )
//                 .setTimestamp()
//                 .setColor("Blue")

//             const openedEmbed = new EmbedBuilder()
//                 .setTitle(`${ticketType.toUpperCase()} TICKET CREATED!`)
//                 .setDescription(`📨 **${ticketChoice}** ticket created by <@${user.id}>! Please be patient while staff reviews your ticket. Any messages sent here with a '!' at the start will be forwarded and reacted with a green checkmark.`)
//                 .addFields(
//                     { name: "🔢 Ticket ID", value: "TBD" },
//                     { name: "👤 Opened By", value: `<@${user.id}> ${user.username}` },
//                     { name: "📝 Reason", value: "No reason provided." }
//                 )
//                 .setTimestamp()
//                 .setColor("Blue")

//             const openedRow = new ActionRowBuilder<MessageActionRowComponentBuilder>()
//                 .addComponents(
//                     new ButtonBuilder()
//                         .setCustomId("tickets_close")
//                         .setLabel("Close")
//                         .setStyle(ButtonStyle.Danger)
//                         .setEmoji("🔒"),
//                     new ButtonBuilder()
//                         .setCustomId("tickets_transcript")
//                         .setLabel("Transcript")
//                         .setStyle(ButtonStyle.Primary)
//                         .setEmoji("📜")
//                 )

//             channel.send({ embeds: [openedEmbed], components: [openedRow] })
//             user.send({ embeds: [dmEmbed] })

//             interaction.reply({ content: `✅ Successfully opened ticket`, flags: "Ephemeral" })
//         }
//     } else {
//         const command = commands.get(interaction.commandName);
//         if (!command) return;

//         try {
//             if (command.restrictions) {
//                 if (command.restrictions.serverRestricted && interaction.guildId !== servers.development) {
//                     interaction.reply({
//                         content: "This command is restricted to development servers only!",
//                         flags: "Ephemeral"
//                     });
//                     return
//                 }

//                 if (command.restrictions.userRestricted && !developers.includes(interaction.user.id)) {
//                     interaction.reply({
//                         content: "This command is restricted to developers only!",
//                         flags: "Ephemeral"
//                     });
//                     return
//                 }
//             }

//             if (command.permissions) {
//                 const author = interaction.member
//                 if (!author || !(author instanceof GuildMember)) return;

//                 if (!author.permissions.has(command.permissions)) {
//                     interaction.reply({ content: "You are not authorized to run this command!", flags: "Ephemeral" })
//                     return
//                 }
//             }

//             await command.callback(client, interaction)
//         } catch (err) {
//             console.error(err)
//         }
//     }
// }