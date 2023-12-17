import { AudioPlayer, VoiceConnection } from "@discordjs/voice";
import { InternalDiscordGatewayAdapterCreator } from "discord.js";

export class VoicePlayer {
  public voicePlayer: VoiceConnection;
  public player: AudioPlayer;

  constructor(connection: VoiceConnection, player: AudioPlayer) {
    this.voicePlayer = connection;
    this.player = player;

    if (this.voicePlayer !== undefined) {
      this.voicePlayer.subscribe(this.player);
    }
  }

  public setConnection(newConnection: VoiceConnection) {
    this.voicePlayer = newConnection;
  }
}
