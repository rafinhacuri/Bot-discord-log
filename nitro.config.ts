import 'dotenv/config'
import { defineNitroConfig } from 'nitropack/config'
import process from 'node:process'

const { DISCORD_TOKEN, CHANNEL_ID } = process.env

export default defineNitroConfig({
  srcDir: 'server',
  compatibilityDate: '2025-05-17',
  runtimeConfig: {
    DISCORD_TOKEN,
    CHANNEL_ID,
  },
})
