import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Player } from '../player/Player'
import { SlashCommand } from '../types'

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip to the next song in the queue.'),
  execute: (interaction, ...args) => {
    const player = args[0] as Player

    //we kill the current player but keep it alive
    player.audioPlayer.stop(true)

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`Skipping song ${player.currentSong.title}`)
          .setAuthor({ name: 'LoveLeiBot' }),
      ],
    })
    //then reemit all the songs that we had before in their order
    for (const song of player.queue) {
      player.emit('songAdd', player, song, song.interaction)
    }
  },
}

export default command
