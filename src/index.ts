import 'dotenv/config';
import { Client, IntentsBitField, Partials } from 'discord.js'
import { commands } from './commands';
import { setupDatabase } from './database/mongoose';
import { environment } from "../config.json";
import fs from 'fs';
import { Environment } from './utilities/registerCommands';

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

const commandFiles = fs.readdirSync('./src/commands').filter(f => f.endsWith(".ts"));
for (const commandFile of commandFiles) {
    const { command } = await import(`./commands/${commandFile}`) // await import(path.join("/commands", commandFile)) //require(path.join(commandsPath, commandFile))
    if (!command || !command.data) continue
    commands.set(command.data.name, command)
}

const eventFiles = fs.readdirSync("./src/events").filter(f => f.endsWith(".ts"))
for (const eventFile of eventFiles) {
    const eventName = eventFile.split(".")[0]
    const event =  await import(`./events/${eventFile}`) // require(path.join(eventsPath, eventFile))
    client.on(eventName, async (...args) => event.execute(client, ...args))
}

await setupDatabase()

client.login(environment === Environment.Production ? process.env.PROD_TOKEN : process.env.DEV_TOKEN)