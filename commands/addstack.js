const { Permissions } = require('discord.js')
const config = require('../config.js')
const { settings } = require('../modules/settings.js')

// Better SQLite
const SQLite = require('better-sqlite3')
const sql = new SQLite('./data/database.sqlite')

exports.run = async (client, message, args, level) => {
    // eslint-disable-line no-unused-vars
    const replying = settings.ensure(
        message.guild.id,
        config.defaultSettings
    ).commandReply

    // Check if the user has given a role name
    if (!args || args.length < 1) return message.reply('Must provide a role name.')
    const roleName = args[0]

    // Check if role name already exists
    const roleExists = message.guild.roles.cache.find((r) => r.name === roleName)
    if (roleExists) {
        return message.reply('That role does already exist')
    }

    // Create role and give it to everybody that's mentioned
    await message.guild.roles
        .create({
            name: roleName,
            color: 'BLUE',
            reason: 'Created for automatic channel and reactions',
        })
        .then((role) => {
            message.mentions.members.forEach((member) => {
                member.roles.add(role)
            })
        })
        .catch(console.error)

    // Get the just created role
    const role = message.guild.roles.cache.find((r) => r.name === roleName)

    // Check if channel already exists
    const channel = message.guild.channels.cache.find((c) => c.name === roleName)
    if (channel) {
        return message.reply(
            'Role category does already exist, skipping creating category and channels'
        )
    }

    // Create category with channels, only accessable by role
    const permissions = [
        {
            id: message.guild.roles.everyone,
            deny: [Permissions.FLAGS.VIEW_CHANNEL],
        },
        {
            id: role.id,
            allow: [Permissions.FLAGS.VIEW_CHANNEL],
        },
    ]
    message.guild.channels
        .create(roleName, {
            type: 'GUILD_CATEGORY',
            permissionOverwrites: permissions,
        })
        .then((cat) => {
            message.guild.channels.create('main', {
                type: 'GUILD_TEXT',
                parent: cat,
                permissionOverwrites: permissions,
            })
            message.guild.channels.create('Main', {
                type: 'GUILD_VOICE',
                parent: cat,
                permissionOverwrites: permissions,
            })
        })

    // Send a message to the roles channel about the just created role and add a reaction to that message
    const rolesChannel = message.guild.channels.cache.find((c) => c.name === 'roles')
    if (rolesChannel) {
        rolesChannel
            .send(
                `Channel für [<@&${role.id}>] wurden erstellt. Reagiere auf diese Nachricht, um alles sehen zu können.`
            )
            .then((c) => {
                // Add guild, channel and message to the reaction_messages table
                sql.prepare(
                    `INSERT INTO reaction_messages (guild_id, channel_id, message_id) VALUES (?, ?, ?)`
                ).run(message.guild.id, c.channel.id, c.id)

                c.react('✅')
            })
    }

    // Add a final message
    message.reply({
        content: `The role \`${roleName}\` has been created ${
            !channel ? 'and a category with channels has been added' : ''
        }\nYou'll find the reactions in #roles`,
        allowedMentions: { repliedUser: replying === 'true' },
    })
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 'Administrator',
}

exports.help = {
    name: 'addstack',
    category: 'System',
    description:
        'Adds a new role, creates a category for it as well as an reaction. When mentioning users, it will also assign the role.',
    usage: 'addstack [command] (@users)',
}
