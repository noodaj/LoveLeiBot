import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { VoicePlayer } from "../player";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop and disconnect bot"),
  execute: (vp, interaction) => {
    if (vp.voicePlayer !== undefined) {
      vp.voicePlayer.destroy();
      vp.voicePlayer = undefined;
      //these shuld be discraded so it gets garbage collected
      // vp.player.stop();
      // vp.player = undefined;
    } else {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("There is currently no bot in the server!")
            .setAuthor({ name: "LoveLeiBot" }),
        ],
      });
    }
  },
};

export default command;
