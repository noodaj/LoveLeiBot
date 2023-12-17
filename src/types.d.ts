import {
  CacheType,
  ChatInputCommandInteraction,
  Collection,
  Interaction,
  Message,
  PermissionResolvable,
  SlashCommandBuilder,
} from "discord.js";
import { VoicePlayer } from "./player";

export interface SlashCommand {
  command:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  execute: (
    player: VoicePlayer,
    interaction: ChatInputCommandInteraction
  ) => void;
  cd?: number;
}
export interface BotEvent {
  name: string;
  execute: (player: VoicePlayer, ...args) => void;
  once?: boolean;
}

declare module "discord.js" {
  export interface Client {
    slashCommands: Collection<string, SlashCommand>;
    cooldowns: Collection<string, number>;
  }
}
