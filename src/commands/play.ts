import {
  VoiceConnection,
  VoiceConnectionStatus,
  entersState,
  joinVoiceChannel,
} from "@discordjs/voice";
import {
  Embed,
  EmbedBuilder,
  SlashCommandBuilder,
  VoiceChannel,
} from "discord.js";
import { SlashCommand } from "../types";
import { VoicePlayer } from "../player";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Search specific video to play"),

  execute: async (interaction) => {
    let channelId = undefined;
    //@ts-ignore
    if (interaction.member.voice.channel === null) {
      new EmbedBuilder().setDescription(
        "You must be in a channel for the bot to join."
      );
      return interaction.reply({
        embeds: [
          new EmbedBuilder().setDescription(
            "You must be in a channel for the bot to join."
          ),
        ],
        ephemeral: true,
      });
    }

    ///@ts-ignore
    channelId = interaction.member.voice.channelId;
    if (!VoicePlayer.voicePlayer) {
      VoicePlayer.createNewVoicePlayer(
        channelId,
        interaction.guildId,
        interaction.guild.voiceAdapterCreator
      );
    }

    // VoicePlayer.voicePlayer.on("stateChange", async (oldState, newState) => {
    //   if (newState.status === VoiceConnectionStatus.Disconnected) {
    try {
      await entersState(
        VoicePlayer.voicePlayer,
        VoiceConnectionStatus.Connecting,
        5000
      );
    } catch (err) {
      console.error(err);
    }
    //   }
    // // });

    // const connection =  joinVoiceChannel({
    //   channelId: channelId,
    //   guildId: interaction.guildId,
    //   adapterCreator: interaction.guild.voiceAdapterCreator,
    // });
  },
};

export default command;
