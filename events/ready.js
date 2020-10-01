module.exports = async client => {
  // Initializes the dashboard,
  // await require("../dashboard/app")(client);
  
  // Check whether the "Default" guild settings are loaded in the enmap.
  // If they're not, write them in. This should only happen on first load.
  if (!client.settings.has("default")) {
    if (!client.config.defaultSettings) throw new Error("defaultSettings not preset in config.js or settings database. Bot cannot load.");
    client.settings.set("default", client.config.defaultSettings);
  }

  // Log that we're ready to serve, so we know the bot accepts commands.
  client.logger.log(`${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`, "ready");

  // Make the bot "play the game" which is the help command with default prefix + guild count. + guild count.
  // NOTE: This is also set in the guildCreate and guildDelete events!.
  client.user.setActivity(`${client.settings.get("default").prefix}help | ${client.guilds.cache.size} Servers`, {type: "PLAYING"});
};
