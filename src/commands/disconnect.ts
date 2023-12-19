import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../types'

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop and disconnect bot'),
  execute: (interaction, ...args) => {
    const player = args[0]
    player.onChangeState()
    if (player.voiceConnection !== undefined) {
      player.voiceConnection.destroy()
      interaction.reply({ content: 'bye' })
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
