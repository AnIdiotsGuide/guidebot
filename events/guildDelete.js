// This event executes when a new guild (server) is left.

module.exports = (client, guild) => {
   if (!guild.available) return; // If there is an outage, return.
  
  client.logger.cmd(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`);

  // If the settings Enmap contains any guild overrides, remove them.
  // No use keeping stale data!
  if (client.settings.has(guild.id)) {
    client.settings.delete(guild.id);
  }
};
