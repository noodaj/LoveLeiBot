import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js'
import { SlashCommand } from '../types'

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Get all songs in queue.'),
  execute(interaction, ...args) {},
}
