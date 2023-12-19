import { Client } from 'discord.js'
import { join } from 'path'
import { readdirSync } from 'fs'
import { BotEvent } from '../types'
import {
  VoiceConnection,
  createAudioPlayer,
  getVoiceConnection,
} from '@discordjs/voice'
import { Player } from '../player'

const helperPath = join(__dirname, '..')
const eventsPath = join(helperPath, 'events')

const execute = (client: Client) => {
  readdirSync(eventsPath).forEach((file) => {
    if (!file.endsWith('.js')) {
      return
    }

    const player: Player = new Player(createAudioPlayer())

    const event: BotEvent = require(`${eventsPath}/${file}`).default
    if (event.name === 'interactionCreate') {
      client.on(event.name, (interaction) => event.execute(interaction, player))
    }
    // } else {
    //   event?.once
    //     ? client.once(event.name, (...args) => event.execute(...args))
    //     : client.on(event.name, (...args) => event.execute(...args));
    // }
  })

  console.log('Events successfully set')
}

export default execute
