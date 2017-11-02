module.exports = async client => {
  // Why await here? Because the ready event isn't actually ready, sometimes
  // guild information will come in *after* ready. 1s is plenty, generally,
  // for all of them to be loaded.
  // NOTE: client.wait and client.log are added by ./modules/functions.js !
  await client.wait(1000);

  // This loop ensures that client.appInfo always contains up to date data
  // about the app's status. This includes whether the bot is public or not,
  // its description, owner, etc. Used for the dashboard amongs other things.
  client.appInfo = await client.fetchApplication();
  setInterval( async () => {
    client.appInfo = await client.fetchApplication();
  }, 60000);

  // Initializes the dashboard, which must be done on ready otherwise some data
  // may be missing from the dashboard. 
  require("../modules/dashboard")(client);  

  // Set the game as the default help command + guild count.
  // NOTE: This is also set in the guildCreate and guildDelete events!
  client.user.setPresence({game: {name: `${client.settings.get("default").prefix}help | ${client.guilds.size} Servers`, type:0}});

  // Log that we're ready to serve, so we know the bot accepts commands.
  client.log("log", `${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, "Ready!");
};
