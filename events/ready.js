// Better SQLite
const SQLite = require('better-sqlite3')
const sql = new SQLite('./data/database.sqlite')

const logger = require('../modules/logger.js')
const { getSettings } = require('../modules/functions.js')
// Create tables using the createTables.js
const createTables = require('../sqlite/createTables.js')
module.exports = async (client) => {
    await createTables(client)

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
