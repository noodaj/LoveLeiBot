import { ChatInputCommandInteraction } from 'discord.js'

export type Song = {
  url: string
  thumbnail: string
  title: string
  duration: string
  author: string
  interaction: ChatInputCommandInteraction
}
