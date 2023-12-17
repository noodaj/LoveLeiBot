import { Interaction } from "discord.js";
import { BotEvent } from "../types";

const event: BotEvent = {
  name: "interactionCreate",
  execute: (player, interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.slashCommands.get(
        interaction.commandName
      );
      if (command === undefined) {
        interaction.reply({ content: "Command not found", ephemeral: true });
        return;
      }

      try {
        command.execute(player, interaction);
      } catch (err) {
        console.log(err);
        interaction.reply({
          content: "Command could not execute",
          ephemeral: true,
        });
      }
    }
  },
};
export default event;
