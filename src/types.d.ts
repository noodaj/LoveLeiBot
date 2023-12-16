import {
  CacheType,
  ChatInputCommandInteraction,
  Collection,
  Interaction,
  Message,
  PermissionResolvable,
  SlashCommandBuilder,
} from "discord.js";

export interface SlashCommand {
  command: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => void;
  cd?: number;
}
export interface BotEvent {
  name: string;
  execute: (...args) => void;
  once?: boolean;
}

declare module "discord.js" {
  export interface Client {
    slashCommands: Collection<string, SlashCommand>;
    cooldowns: Collection<string, number>;
  }
}
