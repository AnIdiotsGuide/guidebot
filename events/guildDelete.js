// This event executes when a new guild (server) is left.

module.exports = (client, guild) => {
  client.user.setPresence({game: {name: `${client.settings.get("default").prefix}help | ${client.guilds.size} Servers`, type:0}});

  // Well they're gone. Let's remove them from the settings!
  client.settings.delete(guild.id);
};
