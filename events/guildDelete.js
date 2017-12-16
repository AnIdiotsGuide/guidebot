// This event executes when a new guild (server) is left.

module.exports = async (client, guild) => {
  // Well they're gone. Let's remove them from the settings!
  await client.settings.get(guild.id).delete().run();
};
