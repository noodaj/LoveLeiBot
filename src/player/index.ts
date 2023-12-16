import { VoiceConnection } from "@discordjs/voice";
import { InternalDiscordGatewayAdapterCreator } from "discord.js";

export class VoicePlayer {
  static voicePlayer: VoiceConnection = undefined;
  static createNewVoicePlayer = (
    channelId: string,
    guildId: string,
    adapter: InternalDiscordGatewayAdapterCreator
  ) => {
    VoicePlayer.voicePlayer = new VoiceConnection(
      { channelId, guildId, group: "", selfDeaf: false, selfMute: false },
      { adapterCreator: adapter }
    );
  };
}
