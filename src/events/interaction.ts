import { Interaction } from 'discord.js'
import { BotEvent } from '../types'

const event: BotEvent = {
  name: 'interactionCreate',
  execute: (...args: any[]) => {
    const interaction = args[0]
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.slashCommands.get(
        interaction.commandName,
      )
      if (command === undefined) {
        interaction.reply({ content: 'Command not found', ephemeral: true })
        return
      }

      try {
        command.execute(...args)
      } catch (err) {
        console.log(err)
        interaction.reply({
          content: 'Command could not execute',
          ephemeral: true,
        })
      }
    }
  },
  SlashOrPlayer: 'SlashCommand',
}
export default event
