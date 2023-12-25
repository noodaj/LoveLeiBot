import {
  EmbedBuilder,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from 'discord.js'
import { SlashCommand } from '../types'
import { Player } from '../player/Player'
import { AudioPlayerStatus } from '@discordjs/voice'

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Get all songs in queue.'),
  execute(interaction, ...args) {
    const player = args[0] as Player
    // if (!player.voiceConnection) {
    //   interaction.reply({
    //     embeds: [
    //       new EmbedBuilder()
    //         .setDescription(
    //           'Bot must be in a voice channel to use this command!',
    //         )
    //         .setAuthor({ name: 'LoveLeiBot' }),
    //     ],
    //   })
    // } else
    if (player.queue.length === 0) {
      if (player.audioPlayer.state.status === AudioPlayerStatus.Playing) {
        const song = player.currentSong
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setFields({
                name: 'Currently Playing',
                value: song.title,
              })
              .setAuthor({ name: 'LoveLeiBot' }),
          ],
        })
      } else {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription('Queue is empty!')
              .setAuthor({ name: 'LoveLeiBot' }),
          ],
        })
      }
    } else {
      const remaining = player.queue
        .map((song, i) => `${i + 1}. ${song.title}`)
        .join('\n')
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setFields(
              {
                name: 'Currently Playing',
                value: player.currentSong.title,
              },
              { name: 'Queue', value: remaining },
            )

            // .setDescription(
            //   player.queue
            //     .map(
            //       (song, index) =>
            //         `${index + 1}. ${song.title} - ${song.author}`,
            //     )
            //     .join('\n'),
            // )
            .setAuthor({ name: 'LoveLeiBot' }),
        ],
      })
    }
  },
}

export default command
