// This event executes when a new guild (server) is joined.

module.exports = async (client, guild) => {
  // We need to add this guild to our settings!
  await client.settings.insert({"id":guild.id, "settings":client.config.defaultSettings}).run();
};
