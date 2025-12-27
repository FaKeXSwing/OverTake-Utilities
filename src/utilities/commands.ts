import { Collection } from "discord.js";
import { AnyCommand } from "../types/CommandType.js";

export const commands = new Collection<string, AnyCommand>();