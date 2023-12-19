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
import { SongFinder } from "../player/SongFinder";
import { SlashCommand } from "../types";
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
        // connection = await entersState(
        //   connection,
        //   VoiceConnectionStatus.Ready,
        //   15 * 1000
        // );
        vp.setConnection(connection);
        vp.subscribeVoicePlayer();
      } catch (err) {
        //voice connection no longer needed garbage collected
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
        highWaterMark: 1 << 62,
        liveBuffer: 1 << 62,
        dlChunkSize: 0,
        quality: "lowestaudio",
      }).on("error", (error: Error) => {
        if (!/Status code|premature close/i.test(error.message)) {
          if (interaction.replied) {
            interaction.deleteReply();
          }
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription("Something went wrong when downloading.")
                .setTitle("LoveLeiBot"),
            ],
          });
          return;
        }
      });

      const resource = createAudioResource(downloadedSong);
      if (vp.voicePlayer.state.status === VoiceConnectionStatus.Ready) {
        vp.player.play(resource);
        vp.player.on("stateChange", (oldState, newState) => {
          console.log("change state", newState.status);
        });

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
      if (!interaction.replied) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("LoveLeiBot")
              .setDescription("Song could not play."),
          ],
        });
      }
    }
  },
};

export default command;
