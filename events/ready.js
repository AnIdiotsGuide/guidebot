const { Team } = require("discord.js");
module.exports = async client => {
  // Log that the bot is online.
  client.logger.log(`${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`, "ready");
  
  if (!client.application?.owner) await client.application?.fetch();
  if (client.owners.length < 1) {
    if (client.application.owner instanceof Team) {
      client.owners.push(...client.application.owner.members.keys());
    } else {
      client.owners.push(client.application.owner.id);
    }
  }

  // Make the bot "play the game" which is the help command with default prefix.
  client.user.setActivity(`${client.settings.get("default").prefix}help`, { type: "PLAYING" });
};
