import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import { Player } from '../player/Player'
import { Song } from '../player/Song'
import { BotEvent } from '../types'

const event: BotEvent = {
  name: 'songChange',
  execute: (...args) => {
    const player = args[0] as Player
    const song = args[1] as Song

    const interaction = song.interaction

    if (player.firstSong) {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(song.title!)
            .setDescription(`By ${song.author}\n${song.duration}`)
            .setAuthor({ name: 'LoveLeiBot' })
            .setURL(song.url!)
            .setImage(song.thumbnail),
        ],
      })
    } else {
      interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setTitle(song.title!)
            .setDescription(`By ${song.author}\n${song.duration}`)
            .setAuthor({ name: 'LoveLeiBot' })
            .setURL(song.url!)
            .setImage(song.thumbnail),
        ],
      })
    }
    player.currentSong = song
  },
  SlashOrPlayer: 'PlayerCommand',
}

export default event
