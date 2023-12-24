import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../types'
import { Player } from '../player/Player'

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop and disconnect bot'),
  execute: (interaction, ...args) => {
    const player = args[0] as Player
    player.onChangeState()
    if (player.voiceConnection !== undefined) {
      player.voiceConnection.destroy()
      player.queue = []
      interaction.reply({ content: 'bye' })
      player.audioPlayer.stop()
    } else {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription('There is currently no bot in the server!')
            .setAuthor({ name: 'LoveLeiBot' }),
        ],
      })
    }
  },
}

export default command
