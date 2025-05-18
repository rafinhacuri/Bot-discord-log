import { Client, EmbedBuilder, TextChannel } from 'discord.js'
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async event => {
  const { client } = globalThis.$discord as { client: Client }

  const body = await readBody(event)
  const { sistema, mensagem, tipo, ip, status, channelId } = body

  if(!channelId) throw new Error('Channel ID not provided.')

  const fetched = await client.channels.fetch(channelId)
  if(!fetched?.isTextBased()) return { status: 'Invalid channel.' }

  const channel = fetched as TextChannel

  const color = tipo === 'error' ? 0xFF0000 : tipo === 'success' ? 0x00CC66 : tipo === 'info' ? 0xFFCC00 : 0xCCCCCC

  const title = tipo === 'error' ? `❌ Error ${status || ''}` : tipo === 'success' ? '✅ Success' : tipo === 'info' ? '📢 Info' : '⚠️ Log'

  const embed = new EmbedBuilder().setTitle(title).setColor(color).setDescription(ip ? `${ip} - ${mensagem}` : mensagem).setAuthor({ name: sistema }).setTimestamp()

  await channel.send({ embeds: [embed] })

  return { status: 'Message sent successfully.' }
})
