import {
  ChatInputCommandInteraction,
  Collection,
  Interaction,
  SlashCommandBuilder,
} from 'discord.js'
import { Player, VoicePlayer } from './player/Player'
import { Song } from './player/Song'

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
  execute: (...args: any) => void
  once?: boolean
  SlashOrPlayer: 'SlashCommand' | 'PlayerCommand'
}

export interface PlayerEvents {
  songAdd: [
    player: Player,
    song: Song,
    interaction: ChatInputCommandInteraction,
  ]
  songChange: [player: Player, song: Song]
}
declare module 'discord.js' {
  export interface Client {
    slashCommands: Collection<string, SlashCommand>
    cooldowns: Collection<string, number>
  }
}
