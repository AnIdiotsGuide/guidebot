const logger = require('../modules/logger.js')
const { getSettings, permlevel } = require('../modules/functions.js')
const config = require('../config.js')

// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = async (client, reaction, user) => {
    console.log(client.user.name)

    // Grab the container from the client to reduce line length.
    const { container } = client

    // Check if the message is a reaction to a bot's message
    if (reaction.message.author.bot) return

    // Check if the message is a reaction to a message from the bot
    if (reaction.message.author.id === client.user.id) return

    // Get settings for the server the message was sent in
    const settings = (reaction.message.settings = getSettings(reaction.message.guild))

    // If the member on a guild is invisible or not cached, fetch them.
    if (reaction.message.guild && !reaction.message.member)
        await reaction.message.guild.members.fetch(reaction.message.author)

    // Get the user or member's permission level from the elevation
    const level = permlevel(reaction.message)

    // Get channelname from message
    const channelName = reaction.message.channel.name

    // Check if the reaction channel exists in the collections defined
    // in index.js.
    const rct = container.reactions.get(channelName)
    if (!rct) return

    if (level < container.levelCache[rct.conf.permLevel]) {
        if (settings.systemNotice === 'true') {
            return reaction.message.channel
                .send(`You do not have permission to use this reaction.
Your permission level is ${level} (${
                config.permLevels.find((l) => l.level === level).name
            })
This reaction requires level ${container.levelCache[rct.conf.permLevel]} (${
                rct.conf.permLevel
            })`)
        } else {
            return
        }
    }

    // To simplify message arguments, the author's level is now put on level (not member so it is supported in DMs)
    // The "level" command module argument will be deprecated in the future.
    reaction.message.author.permLevel = level

    try {
        await rct.run(client, reaction, level)
        logger.log(
            `${config.permLevels.find((l) => l.level === level).name} ${
                reaction.message.author.id
            } reacted with ${rct.help.name}`,
            'reaction'
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
