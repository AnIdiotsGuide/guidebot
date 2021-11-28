const logger = require("../modules/logger.js");
// This event executes when a new guild (server) is joined.

module.exports = (client, guild) => {
  logger.log(`[GUILD JOIN] ${guild.id} added the bot. Owner: ${guild.ownerId}`);
};
