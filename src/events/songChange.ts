import { Player } from '../player/Player'
import { Song } from '../player/Song'
import { BotEvent } from '../types'

const event: BotEvent = {
  name: 'songChange',
  execute: (...args) => {
    const player = args[0] as Player
    const song = args[1] as Song

    player.emit('songAdd', player, song)
  },
  SlashOrPlayer: 'PlayerCommand',
}

export default event
