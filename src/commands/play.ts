import {
  VoiceConnectionStatus,
  createAudioResource,
  joinVoiceChannel,
} from '@discordjs/voice'
import {
  EmbedBuilder,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from 'discord.js'
import ytdl from 'ytdl-core'
import { SongFinder } from '../player/SongFinder'
import { SlashCommand } from '../types'
import { Player } from '../player/Player'

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
      const success = player.join(interaction, channelId)
      if (!success) {
        // interaction.reply({})
      }
    }

    try {
      const type = SongFinder.valdiateURL(url)
      const song = await SongFinder.search(url)
      if (type === 'SearchResult') {
      } else {
      }
      const downloadedSong = ytdl(song.url, {
        filter: 'audioonly',
        highWaterMark: 1 << 62,
        liveBuffer: 1 << 62,
        dlChunkSize: 0,
        quality: 'lowestaudio',
      }).on('error', (error: Error) => {
        if (!/Status code|premature close/i.test(error.message)) {
          if (interaction.replied) {
            interaction.deleteReply()
          }
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription('Something went wrong when downloading.')
                .setTitle('LoveLeiBot'),
            ],
          })
          return
        }
      })

      const resource = createAudioResource(downloadedSong)
      if (player.voiceConnection.state.status === VoiceConnectionStatus.Ready) {
        player.audioPlayer.play(resource)

        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(song.title)
              .setAuthor({ name: 'LoveLeiBot' })
              .setURL(song.url!)
              .setImage(song.bestThumbnail.url)
              .setDescription(`By ${song.author.name}\n${song.duration}`),
          ],
        })
      }
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
