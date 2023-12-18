import {
  VoiceConnectionStatus,
  createAudioResource,
  entersState,
  joinVoiceChannel,
} from "@discordjs/voice";
import {
  EmbedBuilder,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import { SongFinder } from "../player/songFinder";
import { SlashCommand } from "../types";
import DiscordYTDLCore from "discord-ytdl-core";

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

      const downloadedSong = DiscordYTDLCore(song.url, {
        filter: "audioonly",
        quality: "highestaudio",
        fmt: "s16le",
        encoderArgs: [],
        opusEncoded: false,
        highWaterMark: 1 << 25,
      }).on("error", (error: Error) => {
        if (!/Status code|premature close/i.test(error.message)) {
          interaction.reply({
            content: "Video is unavailable",
          });
        }
      });

      console.log(downloadedSong);
      const resource = createAudioResource(downloadedSong);
      console.log(resource);
      if (vp.voicePlayer.state.status === VoiceConnectionStatus.Ready) {
        // console.log(downloadedSong);
        if (resource) {
          vp.player.play(resource);
        }
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
      }
    } catch (err: any) {
      console.log(err);
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("LoveLeiBot")
            .setDescription("Song could not play"),
        ],
      });
    }
  },
};

export default command;
