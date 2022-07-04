// All tables that should be generated in sqlite are created here.

// Better SQLite
const SQLite = require('better-sqlite3')
const sql = new SQLite('./data/database.sqlite')

const logger = require('../modules/logger.js')

module.exports = async (client) => {
    return await Promise.all([
        createReactionMessagesTable(client),
        createVoiceStatesTable(client),
    ]).then(() => {
        logger.log('Tables created.', 'log')
    })
}

const createReactionMessagesTable = async (client) => {
    // Check if the table reaction_messages exists
    const table = await sql
        .prepare(
            `SELECT count(*) FROM sqlite_master WHERE type='table' AND name='reaction_messages'`
        )
        .get()

    if (!table['count(*)']) {
        // If the table does not exist, create it and setup the database
        sql.prepare(
            'CREATE TABLE reaction_messages (id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT, channel_id TEXT, message_id TEXT)'
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

    return
}

const createVoiceStatesTable = async (client) => {
    // Check if the table voice_states exists
    const table = await sql
        .prepare(
            `SELECT count(*) FROM sqlite_master WHERE type='table' AND name='voice_states'`
        )
        .get()

    if (!table['count(*)']) {
        // If the table does not exist, create it and setup the database
        sql.prepare(
            'CREATE TABLE voice_states (id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT, channel_id TEXT, message_id TEXT)'
        ).run()
        sql.prepare(`CREATE UNIQUE INDEX idx_voice_states_id ON voice_states (id)`).run()
        sql.prepare(
            `CREATE INDEX idx_voice_states_guild_id ON voice_states (guild_id)`
        ).run()
        sql.prepare(
            `CREATE INDEX idx_voice_states_channel_id ON voice_states (channel_id)`
        ).run()
        sql.prepare(
            `CREATE INDEX idx_voice_states_message_id ON voice_states (message_id)`
        ).run()

        sql.pragma('synchronous = 1')
        sql.pragma('journal_mode = wal')
    }

    return
}
