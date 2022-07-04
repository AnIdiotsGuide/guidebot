// Better SQLite
const SQLite = require('better-sqlite3')
const sql = new SQLite('./data/database.sqlite')

const logger = require('../modules/logger.js')
const { getSettings } = require('../modules/functions.js')
// Create tables using the createTables.js
const createTables = require('../sqlite/createTables.js')
module.exports = async (client) => {
    await createTables(client)

    await fetchMessagesByDatabase(client)

    await fetchLastHundredMessages(client)

    // Log that the bot is online.
    logger.log(
        `${client.user.tag}, ready to serve ${client.guilds.cache
            .map((g) => g.memberCount)
            .reduce((a, b) => a + b)} users in ${client.guilds.cache.size} servers.`,
        'ready'
    )

    // Make the bot "play the game" which is the help command with default prefix.
    client.user.setActivity(`${getSettings('default').prefix}help`, { type: 'PLAYING' })
}

const fetchLastHundredMessages = async (client) => {
    // Fetch 100 messages from the channel with name "roles"
    const channel = client.channels.cache.find((channel) => channel.name === 'roles')
    if (!channel) return
    const messages = await channel.messages.fetch({ limit: 100 })

    // For each message, save the guild_id, channel_id and message_id to the reaction_messages table
    messages.forEach((message) => {
        // Check if the message.id already exists in the database
        const messageExists = sql
            .prepare(`SELECT * FROM reaction_messages WHERE message_id = ?`)
            .get(message.id)
        if (messageExists) return

        sql.prepare(
            `INSERT INTO reaction_messages (guild_id, channel_id, message_id) VALUES (?, ?, ?)`
        ).run(channel.guild.id, channel.id, message.id)
    })
}

const fetchMessagesByDatabase = async (client) => {
    // Fetch all the messages that have a reaction
    const messages = sql.prepare(`SELECT * FROM reaction_messages`).all()
    // For each message, fetch the message
    for (const message of messages) {
        const channel = client.channels.cache.get(message.channel_id)
        if (!channel) {
            // The channel was not found, so the message was probably deleted.
            // Remove the message from the database
            sql.prepare(`DELETE FROM reaction_messages WHERE id = ?`).run(message.id)
            continue
        }
        try {
            await channel.messages.fetch(message.message_id)
        } catch (err) {
            // The message was not found, so the message was probably deleted.
            // Remove the message from the database
            sql.prepare(`DELETE FROM reaction_messages WHERE id = ?`).run(message.id)
            continue
        }
    }
}
