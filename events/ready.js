module.exports = async client => {
  // Why await here? Because the ready event isn't actually ready, sometimes
  // guild information will come in *after* ready. 1s is plenty, generally,
  // for all of them to be loaded.
  await client.wait(1000);

  client.logger.log(`[READY] ${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, "ready");

  // Both `wait` and `client.log` are in `./modules/functions`.

  // Make the bot "play the game" which is the help command with default prefix.
  client.user.setActivity(`${client.config.defaultSettings.prefix}help`, {type: "PLAYING"});
};
