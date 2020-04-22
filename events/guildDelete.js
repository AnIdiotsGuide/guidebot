// This event executes when the bot leaves a guild (server).

module.exports = (client, guild) => {
  // Update the activity to show the updated number of guilds.
  client.user.setActivity(`${client.getSettings("default").prefix}help | ${client.guilds.size} Servers`);
  // Well they're gone. Let's remove them from the settings and log it!
  client.settings.delete(guild.id);
  // Log to the console that a guild was left.
  client.logger.log(`Left guild: ${guild.name} (${guild.id}) with ${guild.memberCount} members`);
};
