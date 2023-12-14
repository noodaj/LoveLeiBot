import { Interaction } from "discord.js";
import { BotEvent } from "../types";

const event: BotEvent = {
  name: "interactionCreate",
  execute: (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
			const command = interaction.client.
    }
  },
};
export default event;
