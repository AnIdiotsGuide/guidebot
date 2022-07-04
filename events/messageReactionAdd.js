const logger = require('../modules/logger.js')
const { getSettings, permlevelByUser } = require('../modules/functions.js')
const config = require('../config.js')

module.exports = async (client, reaction, user) => {
    // Grab the container from the client to reduce line length.
    const { container } = client

    // If a message gains a reaction and it is uncached, fetch and cache the message
    // You should account for any errors while fetching, it could return API errors if the resource is missing
    if (reaction.message.partial) await reaction.message.fetch()

    // console.log(`${user.username} reacted in channel ${reaction.message.channel.name}`)

    // Check if the message is a reaction to a message from the bot
    if (reaction.message.author.id === user.id) return

    // Get settings for the server the message was sent in
    // const settings = (reaction.message.settings = getSettings(reaction.message.guild))

    // If the member on a guild is invisible or not cached, fetch them.
    if (reaction.message.guild && !reaction.message.member)
        await reaction.message.guild.members.fetch(reaction.message.author)

    // Get the user or member's permission level from the elevation
    const level = permlevelByUser(reaction.message, user)

    // Get channelname from message
    const channelName = reaction.message.channel.name

    // Check if the reaction channel exists in the collections defined
    // in index.js.
    const rct = container.reactionsAdd.get(channelName)
    if (!rct) return

    if (level < container.levelCache[rct.conf.permLevel]) {
        return
    }

    // To simplify message arguments, the author's level is now put on level (not member so it is supported in DMs)
    // The "level" command module argument will be deprecated in the future.
    reaction.message.author.permLevel = level

    try {
        await rct.run(client, reaction, user, level)
        logger.log(
            `${config.permLevels.find((l) => l.level === level).name} ${
                user.username
            } added a reaction in channel ${rct.help.name}`,
            'log'
        )
    } catch (e) {
        console.error(e)
        reaction.message.channel
            .send({
                content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``,
            })
            .catch((e) => console.error('An error occurred reacting on an error', e))
    }
}
