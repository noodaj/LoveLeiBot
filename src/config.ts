import dotenv from 'dotenv'
dotenv.config()

const { CLIENT_ID, DISCORD_TOKEN, CLIENT_SECRET, GUILD_ID } = process.env

if (!CLIENT_ID || !DISCORD_TOKEN || !CLIENT_SECRET) {
  throw new Error('Environment variables not defined.')
}

type configItems = 'CLIENT_ID' | 'CLIENT_SECRET' | 'DISCORD_TOKEN' | 'GUILD_ID'

export const config: Record<configItems, string> = {
  CLIENT_ID,
  CLIENT_SECRET,
  DISCORD_TOKEN,
  GUILD_ID,
}
