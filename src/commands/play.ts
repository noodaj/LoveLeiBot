import {
  AudioResource,
  VoiceConnectionStatus,
  entersState,
  joinVoiceChannel,
} from "@discordjs/voice";
import {
  EmbedBuilder,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import { SlashCommand } from "../types";
import { SongFinder } from "../player/songFinder";
import ytdl from "ytdl-core";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Search specific video to play")
    .addStringOption(
      (option: SlashCommandStringOption): SlashCommandStringOption =>
        option.setName("url").setDescription("Song URL").setRequired(true)
    ),

  execute: async (vp, interaction) => {
    const url = interaction.options.getString("url");
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
    if (vp.voicePlayer === undefined) {
      let connection = joinVoiceChannel({
        channelId: channelId,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
        selfDeaf: true,
      });
      try {
        connection = await entersState(
          connection,
          VoiceConnectionStatus.Ready,
          15 * 1000
        );
        vp.setConnection(connection);
      } catch (err) {
        connection.destroy();
        console.log(err);
      }
    }

    try {
      const type = SongFinder.valdiateURL(url);
      const song = await SongFinder.search(url);
      if (type === "SearchResult") {
      } else {
      }

      const downloadedSong = ytdl(song.url, {
        filter: "audioonly",
        quality: "highestaudio",
      }).on("error", (error: Error) => {
        if (!/Status code|premature close/i.test(error.message)) {
          interaction.reply({
            content: "Video is unavailable",
          });
        }
      });

      // const audio: AudioResource = vp.voicePlayer
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(song.title)
            .setAuthor({ name: "LoveLeiBot" })
            .setURL(song.url)
            .setImage(song.bestThumbnail.url)
            .setDescription(`By ${song.author.name}\n${song.duration}`),
        ],
      });
    } catch (err: any) {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("LoveLeiBot")
            .setDescription((err as Error).message),
        ],
      });
    }
  },
};

export default command;
