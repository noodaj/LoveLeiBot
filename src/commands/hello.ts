import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("says hello"),
  execute: (interaction) => {
    interaction.reply("hello world");
  },
};

export default command;
