import { useRuntimeConfig } from '#imports'
import { Client, EmbedBuilder, GatewayIntentBits, TextChannel } from 'discord.js'
import { defineEventHandler, readBody } from 'h3'

const { DISCORD_TOKEN, CHANNEL_ID } = useRuntimeConfig()

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
  ],
})

let ready = false
let channel: null | TextChannel = null

client.once('ready', async () => {
  console.warn(`✅ Bot conectado como ${client.user?.tag}`)

  try {
    const fetched = await client.channels.fetch(CHANNEL_ID || '')
    if(!fetched?.isTextBased()){
      console.error('❌ Canal não encontrado ou não é de texto')
      return
    }
    channel = fetched as TextChannel
    ready = true
  }
  catch (error){
    console.error('❌ Erro ao buscar canal:', error)
  }
})

client.login(DISCORD_TOKEN)

export default defineEventHandler(async event => {
  if(!ready || !channel){
    return { status: 'Bot não pronto ou canal inválido.' }
  }

  if(event.method !== 'POST'){
    event.node.res.statusCode = 405
    return 'Method Not Allowed'
  }

  try {
    const body = await readBody(event)
    const { sistema, mensagem, tipo, ip, status } = body

    const cor = tipo === 'error' ? 0xFF0000 : tipo === 'success' ? 0x00CC66 : tipo === 'info' ? 0xFFCC00 : 0xCCCCCC

    const titulo = tipo === 'error' ? `❌ Erro ${status || ''}` : tipo === 'success' ? '✅ Sucesso' : tipo === 'info' ? '📢 Informação' : '⚠️ Log'

    const embed = new EmbedBuilder()
      .setTitle(titulo)
      .setColor(cor)
      .setDescription(ip ? `${ip} - ${mensagem}` : mensagem)
      .setAuthor({ name: sistema })

    await channel.send({ embeds: [embed] })

    return { status: 'Mensagem enviada com sucesso' }
  }
  catch (error){
    console.error('❌ Erro ao enviar mensagem:', error)
    event.node.res.statusCode = 500
    return 'Erro ao processar'
  }
})
