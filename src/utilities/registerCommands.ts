import { Client, REST, Routes } from "discord.js";
import config from '../../config.json' with { type: "json" }
const { clientIds, environment, developmentServer } = config
import fs from 'fs'

export enum Environment {
    Production = "production",
    Development = "development"
}

export async function registerCommands(client: Client) {
    const commands = []

    const commandFiles = fs.readdirSync("./dist/src/commands").filter(f => f.endsWith(".js"));
    for (const commandFile of commandFiles) {
        const { command } = await import(`../commands/${commandFile}`)
        if (!command || !command.data) continue
        commands.push(command.data)
    }

    const token = environment === Environment.Production ? process.env.PROD_TOKEN : process.env.DEV_TOKEN
    const rest = new REST({ version: "10" }).setToken(token || "")
    const clientId = clientIds[environment as Environment]

    try {
        console.log(`⚙️  Registering commands in the ${environment} environment.`)
        if (environment === "development") {
            await rest.put(
                Routes.applicationGuildCommands(clientId, developmentServer),
                { body: commands}
            )
        } else {
            await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands}
            )
        }
        
        console.log(`✅ Successfully registered commands in the ${environment} environment!`);

    } catch (err) {
        console.log(`❌ Failed to register commands in the ${environment} environment!`);
        console.error(err)
    }
}