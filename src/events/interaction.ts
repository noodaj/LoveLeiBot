import { Interaction } from "discord.js";
import { BotEvent } from "../types";

const event: BotEvent = {
  name: "interactionCreate",
  execute: (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.slashCommands.get(
        interaction.commandName
      );
      if (command === undefined) {
        return;
      }

      command.execute(interaction);
    }
  },
};
export default event;
