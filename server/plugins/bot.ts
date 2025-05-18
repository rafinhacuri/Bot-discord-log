import { defineNitroPlugin, useRuntimeConfig } from '#imports'
import { Client, GatewayIntentBits } from 'discord.js'

const { DISCORD_TOKEN } = useRuntimeConfig()

export default defineNitroPlugin(() => {
  if(!DISCORD_TOKEN) throw new Error('Discord token not provided.')
  const client = new Client({ intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds] })
  client.login(DISCORD_TOKEN)
  client.once('ready', () => console.warn(`✅ Bot connected as ${client.user?.tag}`))
  globalThis.$discord = { client }
})
