import { Client, REST, Routes } from "discord.js";
import { join } from "path";
import { readdirSync } from "fs";
import { config } from "./config.js";
import { SlashCommand } from "./types.js";

const commands = [];

const filePath = join(__dirname, "commands");

const deploy = (client: Client) => {
  readdirSync(filePath).forEach((file) => {
    if (!file.endsWith(".js")) {
      return;
    }

    const newCommand: SlashCommand = require(`${filePath}/${file}`).default;
    commands.push(newCommand.command);
  });

  const rest = new REST().setToken(config.DISCORD_TOKEN);
  (async () => {
    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`
      );
      const data = await rest.put(
        Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID),
        { body: commands }
      );
      console.log("Commands sucessfully uploaded");
    } catch (error) {
      console.error(error);
    }
  })();
};
export default deploy;
