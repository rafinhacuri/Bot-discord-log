import { Client, EmbedBuilder, GatewayIntentBits } from 'discord.js'

const DISCORD_TOKEN = 'Seu token aqui'

const client = new Client({ intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds] })
client.login(DISCORD_TOKEN)
client.once('ready', () => console.warn(`✅ Bot connected as ${client.user?.tag}`))

export default async function({ sistema, mensagem, tipo, channelId }: { sistema: string, mensagem: string, tipo: string, channelId: string }){
  const channel = await client.channels.fetch(channelId)
  if(!channel || !channel.isTextBased()) return { status: 'Canal inválido.' }

  if(!('send' in channel) || typeof channel.send !== 'function') return { status: 'Canal não é um canal de texto.' }

  const color = tipo === 'error' ? 0xFF0000 : tipo === 'success' ? 0x00CC66 : tipo === 'info' ? 0xFFCC00 : 0xCCCCCC

  const embed = new EmbedBuilder().setColor(color).setDescription(mensagem).setAuthor({ name: sistema })

  await channel.send({ embeds: [embed] })
}
