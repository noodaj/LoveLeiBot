import { createAudioPlayer } from '@discordjs/voice'
import { Client } from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'
import { Player } from '../player/Player'
import { BotEvent, PlayerEvents } from '../types'

const helperPath = join(__dirname, '..')
const eventsPath = join(helperPath, 'events')

const execute = (client: Client) => {
  const player: Player = new Player(createAudioPlayer())
  readdirSync(eventsPath).forEach((file) => {
    if (!file.endsWith('.js')) {
      return
    }

    const event: BotEvent = require(`${eventsPath}/${file}`).default

    if (event.SlashOrPlayer === 'PlayerCommand') {
      player.on(event.name as keyof PlayerEvents, (...args) =>
        event.execute(...args),
      )
    } else {
      client.on(event.name, (interaction) => event.execute(interaction, player))
    }
  })

  console.log('Events successfully set')
}

export default execute
