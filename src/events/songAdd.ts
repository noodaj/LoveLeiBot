import { Interaction } from 'discord.js'
import { BotEvent } from '../types'

const event: BotEvent = {
  name: 'songAdd',
  execute: (interaction: Interaction, ...args) => {
    console.log('song add')
  },
}
export default event
