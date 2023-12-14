import {
  ChatInputCommandInteraction,
  Interaction,
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
