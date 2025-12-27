import 'dotenv/config';
import './keep_alive.js';
import './dashboard/server.js'
import { Client, IntentsBitField, Partials } from 'discord.js'
import { commands } from './utilities/commands.js';
import { setupDatabase } from './routes/database.js';
import config from "../config.json" with { type: "json" }
import { Environment } from './utilities/registerCommands.js';
import { fileURLToPath, pathToFileURL } from "node:url";
import fs from 'fs';
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const isCompiled = __dirname.includes("dist");

const { environment } = config

const client: Client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages
    ],
    partials: [
        Partials.Channel,
        Partials.Message
    ]
})

const commandsPath = path.join(__dirname, "commands")
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(isCompiled ? ".js" : ".ts"));
for (const commandFile of commandFiles) {
    const { command } = await import(pathToFileURL(path.join(commandsPath, commandFile)).href)
    commands.set(command.data.name, command)
}

const eventsPath = path.join(__dirname, "events")
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith(isCompiled ? ".js" : ".ts"))
for (const eventFile of eventFiles) {
    const eventName = eventFile.split(".")[0]
    const event =  await import(pathToFileURL(path.join(eventsPath, eventFile)).href)
    client.on(eventName, async (...args) => event.execute(client, ...args))
}

await setupDatabase()

client.login(environment === Environment.Production ? process.env.PROD_TOKEN : process.env.DEV_TOKEN)