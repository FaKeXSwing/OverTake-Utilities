import { Collection } from "discord.js";
import { Command } from "./types/CommandType";

export const commands = new Collection<string, Command>();