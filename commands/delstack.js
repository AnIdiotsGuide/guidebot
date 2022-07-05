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

    if (!args || args.length < 1) return message.reply('Must provide a role name.')
    const roleName = args[0]

    // Check if rolename already exists
    const roleExists = message.guild.roles.cache.find((r) => r.name === roleName)
    if (!roleExists) {
        return message.reply("That role doesn't exist")
    }

    const deleteMessages = []

    // Delete the role
    await message.guild.roles.cache
        .find((r) => r.name === roleName)
        .delete()
        .then(() => {
            deleteMessages.push(`Deleted role @${roleName}`)
        })
        .catch(console.error)

    // Check if channel already exists
    const channel = message.guild.channels.cache.find((c) => c.name === roleName)
    if (!channel) {
        return message.reply(
            "Role category doesn't exist, skipping deleting category and channels"
        )
    }

    // Delete all channels in the category
    await message.guild.channels.cache
        .filter((c) => c.parentId === channel.id)
        .forEach((c) => {
            deleteMessages.push(`Deleted channel ${c.name} in category ${channel.name}`)
            c.delete()
        })

    // Delete category
    await message.guild.channels.cache
        .find((c) => c.name === roleName)
        .delete()
        .then(() => {
            deleteMessages.push(`Deleted category ${roleName}`)
        })
        .catch(console.error)

    // Get the first channel, called roles, and fetch all messages. Then delete all messages that contain the roleName.
    const rolesChannel = message.guild.channels.cache.find((c) => c.name === 'roles')
    const messages = await rolesChannel.messages.fetch({ limit: 100 })
    messages.forEach((m) => {
        if (m.content.includes(`[${roleName}]`)) {
            // Delete the message in the reaction_messages table
            sql.prepare(`DELETE FROM reaction_messages WHERE message_id = ${m.id}`).run()
            m.delete()
        }
    })

    // Add a final message
    deleteMessages.push(
        `The role \`@${roleName}\` ${
            channel ? 'and a category with channels' : ''
        } has been successfully deleted`
    )
    message.reply({
        content: deleteMessages.join('\n'),
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
    name: 'delstack',
    category: 'System',
    description: "Deletes a role and it's associated categories and messages.",
    usage: 'delstack [role]',
}
