import { AudioPlayerStatus, VoiceConnectionStatus } from '@discordjs/voice'
import {
  EmbedBuilder,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from 'discord.js'
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
      const song = await SongFinder.getURL(url)
      song.interaction = interaction
      player.queue.push(song)

      if (player.audioPlayer.state.status === AudioPlayerStatus.Playing) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({ name: 'LoveLeiBot' })
              .setDescription(`${song.title} has been added to the queue.`),
          ],
        })
      }

      if (player.audioPlayer.state.status === AudioPlayerStatus.Idle) {
        if (player.queue.length === 0) {
          player.firstSong = true
        }
        const song = player.queue[0]
        await player.playSong(song)
      }
      player.audioPlayer.on('stateChange', async (oldState, newState) => {
        //if idle and queue
        if (player.audioPlayer.state.status === AudioPlayerStatus.Idle) {
          if (player.queue.length === 0) {
            player.firstSong = true
          }
          if (player.queue.length > 0) {
            const song = player.queue[0]
            await player.playSong(song)
          }
        }
      })
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
