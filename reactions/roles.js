const config = require('../config.js')
const { settings } = require('../modules/settings.js')
exports.run = async (client, reaction, level) => {
    // eslint-disable-line no-unused-vars

    console.log('test')
}

exports.conf = {
    enabled: true,
    permLevel: 'Bot Admin',
}

exports.help = {
    name: 'roles',
    category: 'System',
}
