export default defineEventHandler(async event => {
  discord(await readBody(event))

  return { status: 'Message sent successfully.' }
})
