const config = require('../../config.js')
const { settings } = require('../../modules/settings.js')
exports.run = async (client, reaction, user, level) => {
    // eslint-disable-line no-unused-vars

    // Check if the right reaction was used
    if (reaction.emoji.name !== '✅') return

    // Check if the message is a reaction to a bots message
    if (!reaction.message.author.bot) return

    // Get role based on the text in square brackets in the reaction message (if it exists)
    const roleId = reaction.message.content.match(/\[\<\@(.*?)\>\]/g)
    if (!roleId) {
        return
    }

    // Check if role exists
    const role = reaction.message.guild.roles.cache.find(
        (r) => r.id === roleId[0].slice(4, -2)
    )
    if (!role) {
        return
    }

    const reactedUser = reaction.message.guild.members.cache.get(user.id)

    // Check if the user has already the role, that's defined by roleName
    // const hasRole = reactedUser.roles.cache.find(
    //     (r) => r.name === roleName[0].slice(1, -1)
    // )
    // if (!hasRole) {
    //     return
    // }

    // Give the user, that just reacted, the role
    reactedUser.roles.remove(role)
}

exports.conf = {
    enabled: true,
    permLevel: 'User',
}

exports.help = {
    name: 'roles',
    category: 'System',
}
