import { useRuntimeConfig } from '#imports'
import { Client, EmbedBuilder, TextChannel } from 'discord.js'
import { defineEventHandler, readBody } from 'h3'

const { CHANNEL_ID } = useRuntimeConfig()

export default defineEventHandler(async event => {
  const { client } = globalThis.$discord as { client: Client }

  const body = await readBody(event)
  const { sistema, mensagem, tipo, ip, status } = body

  const fetched = await client.channels.fetch(CHANNEL_ID)
  if(!fetched?.isTextBased()) return { status: 'Canal inválido' }

  const channel = fetched as TextChannel

  const cor = tipo === 'error' ? 0xFF0000 : tipo === 'success' ? 0x00CC66 : tipo === 'info' ? 0xFFCC00 : 0xCCCCCC

  const titulo = tipo === 'error' ? `❌ Erro ${status || ''}` : tipo === 'success' ? '✅ Sucesso' : tipo === 'info' ? '📢 Informação' : '⚠️ Log'

  const embed = new EmbedBuilder().setTitle(titulo).setColor(cor).setDescription(ip ? `${ip} - ${mensagem}` : mensagem).setAuthor({ name: sistema }).setTimestamp()

  await channel.send({ embeds: [embed] })

  return { status: 'Mensagem enviada com sucesso' }
})
