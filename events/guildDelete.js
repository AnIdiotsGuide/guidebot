// This event executes when the bot leaves a guild (server).

module.exports = (client, guild) => {
   if (!guild.available) return; // If there is an outage, return.
  // Update the activity to show the updated number of guilds.
  client.user.setActivity(`${client.settings.get("default").prefix}help | ${client.guilds.cache.size} Servers`);
  // If the settings Enmap contains any guild overrides, remove them.
  // No use keeping stale data!
  if (client.settings.has(guild.id)) {
    client.settings.delete(guild.id);
  } 
  // Log to the console that a guild was left.
  client.logger.log(`Left guild: ${guild.name} (${guild.id}) with ${guild.memberCount} members`);
};