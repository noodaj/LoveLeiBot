import { VoiceConnectionStatus, createAudioResource } from '@discordjs/voice'
import { EmbedBuilder } from 'discord.js'
import ytdl from 'ytdl-core'
import { Player } from '../player/Player'
import { Song } from '../player/Song'
import { BotEvent } from '../types'

const event: BotEvent = {
  name: 'songAdd',
  execute: (...args): EmbedBuilder => {
    const player = args[0] as Player
    const song = args[1] as Song

    const downloadedSong = ytdl(song.url, {
      filter: 'audioonly',
      highWaterMark: 1 << 62,
      liveBuffer: 1 << 62,
      dlChunkSize: 0,
      quality: 'lowestaudio',
    }).on('error', (error: Error) => {
      if (!/Status code | premature close/i.test(error.message)) {
        return new EmbedBuilder()
          .setDescription('Something went wrong when downloading.')
          .setTitle('LoveLeiBot')
      }
    })

    const resource = createAudioResource(downloadedSong)
    if (player.voiceConnection.state.status === VoiceConnectionStatus.Ready) {
      try {
        player.audioPlayer.play(resource)
      } catch (err) {
        return
      }
    }
  },
  SlashOrPlayer: 'PlayerCommand',
}
export default event
