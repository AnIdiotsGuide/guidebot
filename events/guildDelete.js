// This event executes when a new guild (server) is left.

module.exports = (client, guild) => {
  // Well they're gone. Let's remove them from the settings!
  client.settings.delete(guild.id);
};
