import { Client, Collection, Events } from 'discord.js'
import { config } from './config'
import deploy from './helpers/deploy'
import execute from './helpers/event'
import { SlashCommand } from './types'

export const client = new Client({
  intents: [
    'GuildMessages',
    'Guilds',
    'DirectMessages',
    'GuildVoiceStates',
    'MessageContent',
  ],
})

client.slashCommands = new Collection<string, SlashCommand>()
client.cooldowns = new Collection<string, number>()
//extend the client type to add commands
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`)
  deploy(client)
  execute(client)
})

client.login(config.DISCORD_TOKEN)
