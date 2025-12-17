import { GuildMember } from "discord.js";
import config from '../../config.json' with { type: "json" };
const { servers, developers } = config;
import { commands } from "../utilities/commands.js";
export async function execute(client, interaction) {
    if (interaction.isChatInputCommand()) {
        const command = commands.get(interaction.commandName);
        if (!command)
            return;
        try {
            if (command.restrictions) {
                if (command.restrictions.serverRestricted && interaction.guildId !== servers.development) {
                    interaction.reply({
                        content: "This command is restricted to development servers only!",
                        flags: "Ephemeral"
                    });
                    return;
                }
                if (command.restrictions.userRestricted && !developers.includes(interaction.user.id)) {
                    interaction.reply({
                        content: "This command is restricted to developers only!",
                        flags: "Ephemeral"
                    });
                    return;
                }
            }
            if (command.permissions) {
                const author = interaction.member;
                if (!author || !(author instanceof GuildMember))
                    return;
                if (!author.permissions.has(command.permissions)) {
                    interaction.reply({ content: "You are not authorized to run this command!", flags: "Ephemeral" });
                    return;
                }
            }
            await command.callback(client, interaction);
        }
        catch (err) {
            console.error(err);
        }
    }
    else if (interaction.isButton()) {
        if (interaction.customId === 'verify_button') {
            const roleId = '1422241774033961031';
            const verifiedRole = interaction.guild?.roles.cache.get(roleId);
            if (!verifiedRole)
                return interaction.reply({
                    content: `❌ Failed to find verification role with ID: ${roleId}`,
                    flags: "Ephemeral"
                });
            const member = interaction.member;
            if (!member || !(member instanceof GuildMember))
                return interaction.reply({
                    content: `❌ You cannot use this interaction outside of a guild.`,
                    flags: "Ephemeral"
                });
            if (member.roles.cache.has(roleId)) {
                return interaction.reply({
                    content: `❌ You are already verified in **${interaction.guild?.name}**!`,
                    flags: "Ephemeral"
                });
            }
            try {
                await member.roles.add(verifiedRole);
                interaction.reply({
                    content: `✅ Successfully gave the <@&${roleId}> role!`,
                    flags: "Ephemeral"
                });
            }
            catch (error) {
                console.error(error);
                interaction.reply({
                    content: "❌ An internal error occured during the verification.",
                    flags: "Ephemeral"
                });
            }
        }
    }
}
