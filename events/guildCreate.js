// This event executes when a new guild (server) is joined.

module.exports = (client, guild) => {
  client.logger.cmd(`[GUILD JOIN] ${guild.id} added the bot. Owner: ${guild.ownerId}`);
};
