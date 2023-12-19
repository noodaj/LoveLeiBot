import { Client, REST, Routes } from 'discord.js'
import { join } from 'path'
import { readdirSync } from 'fs'
import { config } from '../config.js'
import { SlashCommand } from '../types.js'

const commands = []

const helpers = join(__dirname, '..')
const filePath = join(helpers, 'commands')

const deploy = (client: Client) => {
  readdirSync(filePath).forEach((file) => {
    if (!file.endsWith('.js')) {
      return
    }

    const newCommand: SlashCommand = require(`${filePath}/${file}`).default
    if (newCommand === undefined) {
      return
    }

    commands.push(newCommand.command)
    client.slashCommands.set(newCommand.command.name, newCommand)
  })

  const rest = new REST().setToken(config.DISCORD_TOKEN)

  //deploying our commands
  ;(async () => {
    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`,
      )
      const data = await rest
        .put(
          Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID),
          { body: commands },
        )
        .then(() => {
          console.log('Commands sucessfully uploaded')
        })
    } catch (error) {
      console.error(error)
    }
  })()
}
export default deploy
