import { ActivityType } from "discord.js";
import { registerCommands } from "../utilities/registerCommands.js";
import { checkInfractionExpiry } from "../utilities/moderation.js";
export async function execute(client) {
    // Status Update
    client.user?.setActivity({ name: "OverTake Esports", type: ActivityType.Watching });
    // Re-add when there's enough statuses
    // setInterval(() => {
    //     const index = Math.floor(Math.random() * (activities.length - 1) + 1);
    //     client.user?.setActivity(activities[index].message, { type: activities[index].type })
    // }, (10 * 1000));
    // Infractions Check - Every 30 seconds
    setInterval(checkInfractionExpiry, 30 * 1000, client);
    // Command Registration
    await registerCommands(client);
    console.log(`${client.user?.username} is now online!`);
}
