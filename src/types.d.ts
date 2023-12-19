import {
  ChatInputCommandInteraction,
  Collection,
  Interaction,
  SlashCommandBuilder,
} from 'discord.js'
import { Player, VoicePlayer } from './player/Player'

type slashCommandType = 'music' | 'other'

export interface SlashCommand {
  command:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
  execute: (interaction: ChatInputCommandInteraction, ...args: any) => void
  cd?: number
}
export interface BotEvent {
  name: string
  execute: (interaction: Interaction, ...args: any) => void
  once?: boolean
}

declare module 'discord.js' {
  export interface Client {
    slashCommands: Collection<string, SlashCommand>
    cooldowns: Collection<string, number>
  }
}
