// Better SQLite
const SQLite = require('better-sqlite3')
const sql = new SQLite('./database.sqlite')

const logger = require('../modules/logger.js')
const { getSettings } = require('../modules/functions.js')
module.exports = async (client) => {
    // Check if the table reaction_messages exists
    const table = sql
        .prepare(
            `SELECT count(*) FROM sqlite_master WHERE type='table' AND name='reaction_messages'`
        )
        .get()

    if (!table['count(*)']) {
        // If the table does not exist, create it and setup the database
        sql.prepare(
            'CREATE TABLE reaction_messages (id TEXT PRIMARY KEY, guild_id TEXT, channel_id TEXT, message_id TEXT)'
        ).run()
        sql.prepare(
            `CREATE UNIQUE INDEX idx_reaction_messages_id ON reaction_messages (id)`
        ).run()
        sql.prepare(
            `CREATE INDEX idx_reaction_messages_guild_id ON reaction_messages (guild_id)`
        ).run()
        sql.prepare(
            `CREATE INDEX idx_reaction_messages_channel_id ON reaction_messages (channel_id)`
        ).run()
        sql.prepare(
            `CREATE INDEX idx_reaction_messages_message_id ON reaction_messages (message_id)`
        ).run()

        sql.pragma('synchronous = 1')
        sql.pragma('journal_mode = wal')
    }

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
