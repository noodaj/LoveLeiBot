import {
  AudioPlayer,
  AudioPlayerStatus,
  VoiceConnection,
  VoiceConnectionStatus,
  joinVoiceChannel,
} from '@discordjs/voice'
import { CacheType, ChatInputCommandInteraction } from 'discord.js'
import { Song } from './Song'
import { SongFinder } from './SongFinder'
import { EventEmitter } from 'node:events'

export class Player extends EventEmitter {
  public voiceConnection: VoiceConnection
  public audioPlayer: AudioPlayer
  public queue: Song[]

  constructor(audioPlayer: AudioPlayer, connection?: VoiceConnection) {
    super()
    this.audioPlayer = audioPlayer
    this.queue = []
  }

  public setConnection(newConnection: VoiceConnection) {
    this.voiceConnection = newConnection
  }

  public subscribevoiceConnection() {
    this.voiceConnection.subscribe(this.audioPlayer)
  }

  public onChangeState() {
    if (this.voiceConnection) {
      this.voiceConnection.on('stateChange', (_, newState) => {
        if (
          newState.status === VoiceConnectionStatus.Disconnected &&
          this.voiceConnection.state.status !== VoiceConnectionStatus.Destroyed
        ) {
          this.voiceConnection.destroy()
          this.audioPlayer.stop()
        }
      })
      return
    }
    if (this.audioPlayer) {
      this.audioPlayer
        .on('stateChange', (_, newState) => {
          //if we stop the bot with a slash command
          this.audioPlayer.stop()
        })
        .on('error', (error) => {
          console.log(error)
        })
    }
  }

  public join(
    //   // connection = await entersState(
    //   //   connection,
    //   //   VoiceConnectionStatus.Ready,
    //   //   15 * 1000
    //   // );
    interaction: ChatInputCommandInteraction<CacheType>,
    channelId: any,
  ) {
    let connection: VoiceConnection
    try {
      connection = joinVoiceChannel({
        adapterCreator: interaction.guild.voiceAdapterCreator,
        channelId: channelId,
        guildId: interaction.guildId,
      })

      this.voiceConnection = connection
      this.subscribevoiceConnection()
      this.onChangeState()
      return true
    } catch (err) {
      connection.destroy()
      console.log(err)
      return false
    }
  }

  public async playSong(url: string) {
    // if (this.queue.length === 0) {
    //   return
    // }
    try {
      const song = await SongFinder.getURL(url)
      const emitters = this.voiceConnection.emit('songAdd', this.queue, song)
      console.log(emitters)
      this.queue.push(song)
    } catch (err) {}
  }
}
