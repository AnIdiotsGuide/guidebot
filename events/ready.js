module.exports = async client => {
  // Why await here? Because the ready event isn't actually ready, sometimes
  // guild information will come in *after* ready. 1s is plenty, generally,
  // for all of them to be loaded.
  await client.wait(1000);

  const def = await client.settings.get("default").run();
  if (def == null) {

    // Okay, the client does NOT have a default database table.

    await client.settings.insert({"id":"default", "settings":client.config.defaultSettings}).run();

    // Add a warning and let the Owner know about the issue.
    
    client.log("warn", "You did not have the default table in the database, we've added it for you.", "Warnning");
  }

  // Both `wait` and `client.log` are in `./modules/functions`.

  // We check for any guilds added while the bot was offline, if any were, they get a default configuration.
  
  await client.guilds.forEach(async function(g) {
    const gl = await client.settings.get(g.id).run();
    if (gl === null) {
      await client.settings.insert({"id":g.id, "settings": client.config.defaultSettings});
    }
  });

  // Change the game properly.

  client.user.setGame(`${client.config.defaultSettings.prefix}help | ${client.guilds.size}`);

  // We are ready for the masses!

  client.log("ready", `${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, "Ready!");
};
