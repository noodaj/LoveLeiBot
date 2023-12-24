import {
  AudioPlayerStatus,
  VoiceConnectionStatus,
  createAudioResource,
} from '@discordjs/voice'
import {
  EmbedBuilder,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from 'discord.js'
import ytdl from 'ytdl-core'
import { Player } from '../player/Player'
import { SongFinder } from '../player/SongFinder'
import { SlashCommand } from '../types'

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Search specific video to play')
    .addStringOption(
      (option: SlashCommandStringOption): SlashCommandStringOption =>
        option.setName('url').setDescription('Song URL').setRequired(true),
    ),

  execute: async (interaction, ...args) => {
    const player = args[0] as Player

    const url = interaction.options.getString('url')
    let channelId = undefined
    //@ts-ignore
    if (interaction.member.voice.channel === null) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder().setDescription(
            'You must be in a channel for the bot to join.',
          ),
        ],
        ephemeral: true,
      })
    }

    ///@ts-ignore
    channelId = interaction.member.voice.channelId
    if (
      player.voiceConnection === undefined ||
      player.voiceConnection.state.status === VoiceConnectionStatus.Destroyed
    ) {
      player.join(interaction, channelId)
    }

    try {
      // const song = await SongFinder.search(url)
      const song = await SongFinder.getURL(url)
      player.voiceConnection.emit('songAdd', player, song)
      player.queue.push(song)
      if (player.audioPlayer.state.status === AudioPlayerStatus.Playing) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({ name: 'LoveLeiBot' })
              .setDescription(`${song.title} has been added to the queue.`),
          ],
        })
        return
      } else if (player.audioPlayer.state.status === AudioPlayerStatus.Idle) {
        player.queue.shift()
      }
      await player.playSong(url)
      // const downloadedSong = ytdl(song.url, {
      //   filter: 'audioonly',
      //   highWaterMark: 1 << 62,
      //   liveBuffer: 1 << 62,
      //   dlChunkSize: 0,
      //   quality: 'lowestaudio',
      // }).on('error', (error: Error) => {
      //   console.log(error)
      //   interaction.reply({ content: 'Fake' })
      //   if (!/Status code|premature close/i.test(error.message)) {
      //     if (interaction.replied) {
      //       interaction.deleteReply()
      //     }
      //     interaction.reply({
      //       embeds: [
      //         new EmbedBuilder()
      //           .setDescription('Something went wrong when downloading.')
      //           .setTitle('LoveLeiBot'),
      //       ],
      //     })
      //     return
      //   }
      // })

      // const resource = createAudioResource(downloadedSong)
      // if (player.voiceConnection.state.status === VoiceConnectionStatus.Ready) {
      //   try {
      //     player.audioPlayer.play(resource)
      //   } catch (err) {
      //     console.log(err)
      //     return
      //   }

      //   interaction.reply({
      //     embeds: [
      //       new EmbedBuilder()
      //         .setTitle(song.title)
      //         .setAuthor({ name: 'LoveLeiBot' })
      //         .setURL(song.url!)
      //         .setImage(song.thumbnail)
      //         .setDescription(`By ${song.author}\n${song.duration}`),
      //     ],
      //   })
      // }
    } catch (err: any) {
      console.log(err)
      if (!interaction.replied) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle('LoveLeiBot')
              .setDescription('Song could not play.'),
          ],
        })
      }
    }
  },
}

export default command
