import 'dotenv/config';
import './keep_alive.js';
import { Client, IntentsBitField, Partials } from 'discord.js';
import { commands } from './utilities/commands.js';
import { setupDatabase } from './database/mongoose.js';
import config from "../config.json" with { type: "json" };
import { Environment } from './utilities/registerCommands.js';
import fs from 'fs';
const { environment } = config;
const client = new Client({
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
});
const commandFiles = fs.readdirSync('./dist/src/commands').filter(f => f.endsWith(".js"));
for (const commandFile of commandFiles) {
    const { command } = await import(`./commands/${commandFile}`);
    commands.set(command.data.name, command);
}
const eventFiles = fs.readdirSync("./dist/src/events").filter(f => f.endsWith(".js"));
for (const eventFile of eventFiles) {
    const eventName = eventFile.split(".")[0];
    const event = await import(`./events/${eventFile}`);
    client.on(eventName, async (...args) => event.execute(client, ...args));
}
await setupDatabase();
client.login(environment === Environment.Production ? process.env.PROD_TOKEN : process.env.DEV_TOKEN);
