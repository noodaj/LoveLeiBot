import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop and disconnect bot"),
  execute: (interaction) => {},
};

export default command;
