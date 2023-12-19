import { Interaction } from 'discord.js'
import { BotEvent } from '../types'
import { Player } from '../player'

const event: BotEvent = {
  name: 'interactionCreate',
  execute: (interaction: Interaction, ...args) => {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.slashCommands.get(
        interaction.commandName,
      )
      if (command === undefined) {
        interaction.reply({ content: 'Command not found', ephemeral: true })
        return
      }

      try {
        command.execute(interaction, ...args)
      } catch (err) {
        console.log(err)
        interaction.reply({
          content: 'Command could not execute',
          ephemeral: true,
        })
      }
    }
  },
}
export default event
