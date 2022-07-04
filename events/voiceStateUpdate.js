const logger = require('../modules/logger.js')
const { getSettings } = require('../modules/functions.js')

// Better SQLite
const SQLite = require('better-sqlite3')
const sql = new SQLite('./database.sqlite')

const { memberNicknameMention, channelMention } = require('@discordjs/builders')

module.exports = async (client, oldState, newState) => {
    // Get the settings for the guild
    const settings = getSettings(newState.guild.id)

    const userVoiceState = getUserVoiceState(oldState, newState)

    // Find channel called "wo-wer-was" and send a message to it
    const channel = newState.guild.channels.cache.find(
        (channel) => channel.name === 'wo-wer-was'
    )
    if (!channel) return

    // Get the embed message in the voice_states table by guild_id and channel_id
    let vsMessage = sql
        .prepare(`SELECT * FROM voice_states WHERE guild_id = ? AND channel_id = ?`)
        .get(newState.guild.id, channel.id)

    // If message was found, edit the embed message
    if (vsMessage) {
        try {
            await client.channels.cache
                .get(vsMessage.channel_id)
                .messages.fetch(vsMessage.message_id)
                .then((message) => {
                    editEmbedMessage(client, userVoiceState, message)
                })

            return
        } catch (error) {
            sql.prepare(`DELETE FROM voice_states WHERE id = ?`).run(vsMessage.id)
        }
    }

    // If no message was found, create a new embed message
    createNewEmbedMessage(client, userVoiceState, channel)
}

const createNewEmbedMessage = (client, userVoiceState, channel) => {
    const messageTemplate = getEmbedMessageTemplate(client)

    const category = userVoiceState.parent
    if (!category.name) return

    const field = {
        name: `${category.name}`,
        value: memberNicknameMention(userVoiceState.userId),
        inline: true,
    }
    messageTemplate.fields.push(field)

    // Create a new embed message
    return channel.send({ embeds: [messageTemplate] }).then((message) => {
        // Add the message to the voice_states table
        sql.prepare(
            `INSERT INTO voice_states (guild_id, channel_id, message_id) VALUES (?, ?, ?)`
        ).run(channel.guild.id, channel.id, message.id)
    })
}

const editEmbedMessage = (client, userVoiceState, message) => {
    // Edit the embed message
    let embed = message.embeds[0]

    // If the user left the channel
    if (userVoiceState.leftVoiceChannel) {
        // Remove the user from the field
        embed = removeUserFromField(embed, userVoiceState)
    }

    // If the user joined the channel
    if (userVoiceState.joinedVoiceChannel) {
        // Add the user to the field
        embed = addUserToField(embed, userVoiceState)
    }

    // If there aren't any field left, add a field to tell the user, that there are no users in the voice chat currently
    if (embed.fields.length === 0) {
        const randomUser = client.guilds.cache
            .get(userVoiceState.guildId)
            .members.cache.random()

        const field = {
            name: `:information_source: Zurzeit sind keine User im Voice-Chat`,
            value: `Frag doch mal ${memberNicknameMention(
                randomUser.id
            )}, ob er Lust hat zu zocken.`,
            inline: true,
        }
        embed.fields.push(field)
    }

    console.log(embed)

    message.edit({
        embeds: [embed],
    })
}

const getEmbedMessageTemplate = (client) => {
    // Get channel called 'roles'
    const channel = client.channels.cache.find((channel) => channel.name === 'roles')

    return {
        title: ':speaking_head: User in Voice-Channel',
        description: `${channelMention(
            channel.id
        )} Hier findest du alle Rollen.\n\n_____`,
        color: 39129,
        timestamp: new Date(),
        footer: {
            text: `Füge dir Rollen hinzu, um Zugriff auf die Channel zu bekommen`,
            icon_url: '',
        },
        fields: [],
    }
}

const editUserInField = (embed, userVoiceState, addEmojis) => {
    const emojis = ['🔇', '🎥']
    const muted = userVoiceState.mute || userVoiceState.deaf ? emojis[0] : ''
    const video = userVoiceState.selfVideo || userVoiceState.selfStream ? emojis[1] : ''

    // Remove emojis, that are behind the users mention
    embed.fields.forEach((field) => {
        if (field.value.includes(memberNicknameMention(userVoiceState.userId))) {
            field.value = field.value.replace(muted, '')
            field.value = field.value.replace(video, '')
            if (addEmojis) {
                field.value += muted
                field.value += video
            }
        }
    })

    return embed
}

const removeUserFromField = (embed, userVoiceState) => {
    embed = editUserInField(embed, userVoiceState, false)

    // Foreach field the user is in, remove the user from the field
    embed.fields.forEach((field) => {
        if (field.value.includes(userVoiceState.userId)) {
            field.value = field.value.replace(
                `${memberNicknameMention(userVoiceState.userId)}`,
                ''
            )
        }
    })

    // Check for each field, if the value is empty
    // If it is empty, remove the field
    embed.fields = embed.fields.filter(
        (field) => field.value !== '' && !field.name.includes(':information_source:')
    )

    return embed
}

const addUserToField = (embed, userVoiceState) => {
    removeUserFromField(embed, userVoiceState)

    const fieldName = userVoiceState.parent?.name || userVoiceState.channel.name

    // Check if a field with fieldName exists
    const field = embed.fields.find((field) => field.name === fieldName)

    // If no field exists, create a new field
    if (!field) {
        const field = {
            name: `${fieldName}`,
            value: `${memberNicknameMention(userVoiceState.userId)}`,
            inline: true,
        }
        embed.fields.push(field)
    }
    // If a field exists, add the user to the field
    else {
        field.value += `\n${memberNicknameMention(userVoiceState.userId)}`
    }

    embed = editUserInField(embed, userVoiceState, true)

    return embed
}

const getUserVoiceState = (oldState, newState) => {
    // Get user
    const user = newState.member || oldState.member

    const userVoiceState = {
        userId: newState.id || oldState.id,
        user: user,
        deaf: newState.selfDeaf || newState.serverDeaf || false,
        mute: newState.selfMute || newState.serverMute || false,
        video: newState.selfVideo,
        streaming: newState.streaming,
        suppress: newState.suppress,
        channel: newState.channel || oldState.channel,
        parent: newState.channel?.parent || oldState.channel?.parent,
        guildId: newState.guild.id || oldState.guild.id,
        joinedVoiceChannel: newState.channelId !== null,
        leftVoiceChannel: oldState.channelId !== null,
    }

    return userVoiceState
}
