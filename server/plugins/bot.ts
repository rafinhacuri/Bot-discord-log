import { defineNitroPlugin, useRuntimeConfig } from '#imports'
import { Client, GatewayIntentBits } from 'discord.js'

const { DISCORD_TOKEN } = useRuntimeConfig()

export default defineNitroPlugin(() => {
  const client = new Client({
    intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds],
  })

  client.login(DISCORD_TOKEN)

  client.once('ready', () => {
    console.warn(`✅ Bot conectado como ${client.user?.tag}`)
  })

  globalThis.$discord = { client }
})
