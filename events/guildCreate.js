// This event executes when the bot joins a new guild (server).

module.exports = (client, guild) => {
  // Update the activity to show the updated number of guilds.
  client.user.setActivity(`${client.getSettings("default").prefix}help | ${client.guilds.size} Servers`);
  // Log the guild the bot just joined to the console.
  client.logger.log(`Joined guild: ${guild.name} (${guild.id}) with ${guild.memberCount} members`);
};
