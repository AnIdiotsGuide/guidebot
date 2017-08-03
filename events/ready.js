/* global wait */
module.exports = async client => {
  // Why await here? Because the ready event isn't actually ready, sometimes
  // guild information will come in *after* ready. 1s is plenty, generally,
  // for lal of them to be loaded.
  await wait(1000);

  // Both `wait` and `client.log` are in `./modules/functions`.
  client.log("log", `Ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, "Ready!");

  // We check for any guilds added while the bot was offline, if any were, they get a default configuration.
  client.guilds.filter(g => !client.settings.has(g.id)).forEach(g => client.settings.set(g.id, client.config.defaultSettings));

  // Behaves exactly like the code above, checks for new guilds, if any are found, adds an empty array.
  client.guilds.filter(g => !client.blacklist.has(g.id)).forEach(g => client.blacklist.set(g.id, []));

};
