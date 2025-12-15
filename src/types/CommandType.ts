import { ChatInputCommandInteraction, Client, Options, PermissionResolvable } from "discord.js";

/**
 * Represents a Discord Application Command.
 *
 * Use this interface for defining any command your bot supports.
 * Each command should include its `data`, optional `restrictions` or `permissions`, and a `callback`.
 */
export interface Command {
    data: {
        name: string;
        description: string;

        /**
         * Optional **command options** (arguments or parameters).
         * Example:
         * ```ts
         * options: [
         *   { name: 'target', type: 'USER', description: 'Target user' }
         * ]
         * ```
         */
        options?: Options;
    };

    /**
     * Optional **restrictions** for this command.
     *
     * Use restrictions to limit usage to specific users or servers.
     * These are not enforced automatically; your command handler should check them.
     */
    restrictions?: {
        /**
         * If `true`, restricts usage to specific users only.
         * 
         * **Example:** Only allow developers to run the command.
         */
        userRestricted?: boolean;

        /**
         * If `true`, restricts usage to specific servers only.
         * 
         * **Example:** Only allow usage in the development or support server.
         */
        serverRestricted?: boolean;
    };

    /**
     * Optional **permissions** required to run the command.
     * @type Can be a single `PermissionResolvable` or an array.
     * @example `PermissionFlagsBits.Administrator`
     */
    permissions?: PermissionResolvable | [ PermissionResolvable ];

    /**
     * A **callback function** executed when an interaction is invoked.
     *
     * @param client The Discord Client instance
     * @param interaction The Discord Interaction object representing the interaction
     * @example
     * ```ts
     * callback: async (client, interaction) => {
     *     await interaction.reply("Hello world!");
     * }
     * ```
     */
    callback: (client: Client, interaction: ChatInputCommandInteraction) => void;
}
