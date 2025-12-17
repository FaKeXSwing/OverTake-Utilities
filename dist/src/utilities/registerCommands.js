import { REST, Routes } from "discord.js";
import config from '../../config.json' with { type: "json" };
const { clientIds, environment, servers } = config;
import fs from 'fs';
export var Environment;
(function (Environment) {
    Environment["Production"] = "production";
    Environment["Development"] = "development";
})(Environment || (Environment = {}));
export async function registerCommands(client) {
    const commands = [];
    const commandFiles = fs.readdirSync("./dist/src/commands").filter(f => f.endsWith(".js"));
    for (const commandFile of commandFiles) {
        const { command } = await import(`../commands/${commandFile}`);
        if (!command || !command.data)
            continue;
        commands.push(command.data);
    }
    const token = environment === Environment.Production ? process.env.PROD_TOKEN : process.env.DEV_TOKEN;
    const rest = new REST({ version: "10" }).setToken(token || "");
    const clientId = clientIds[environment];
    try {
        console.log(`⚙️  Registering commands in the ${environment} environment.`);
        if (environment === "development") {
            await rest.put(Routes.applicationGuildCommands(clientId, servers.development), { body: commands });
        }
        else {
            await rest.put(Routes.applicationGuildCommands(clientId, servers.production), { body: commands });
        }
        console.log(`✅ Successfully registered commands in the ${environment} environment!`);
    }
    catch (err) {
        console.log(`❌ Failed to register commands in the ${environment} environment!`);
        console.error(err);
    }
}
