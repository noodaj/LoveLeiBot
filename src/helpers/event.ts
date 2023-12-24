import { Client } from 'discord.js'
import { join } from 'path'
import { readdirSync } from 'fs'
import { BotEvent } from '../types'
import {
  VoiceConnection,
  createAudioPlayer,
  getVoiceConnection,
} from '@discordjs/voice'
import { Player } from '../player/Player'

const helperPath = join(__dirname, '..')
const eventsPath = join(helperPath, 'events')

const execute = (client: Client) => {
  const player: Player = new Player(createAudioPlayer())
  readdirSync(eventsPath).forEach((file) => {
    if (!file.endsWith('.js')) {
      return
    }

    const event: BotEvent = require(`${eventsPath}/${file}`).default
    if (event.name === 'songAdd') {
      player.on('songAdd', (player, song) => {
        event.execute(player, song)
      })
      // console.log('eventnames', player.eventNames())
      // console.log('listeners', player.listeners('songAdd'))
      // player.on(event.name, (player, song) => {
      //   // event.execute(player, song)
      // })
    }
    if (event.name === 'interactionCreate') {
      client.on(event.name, (interaction) => event.execute(interaction, player))
      console.log(player)
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
