// This event executes when a new guild (server) is joined.

module.exports = (client, guild) => {
  client.user.setPresence({game: {name: `${client.settings.get("default").prefix}help | ${client.guilds.size} Servers`, type:0}});
  client.log("log", `New guild has been joined: ${guild.name} (${guild.id}) with ${guild.memberCount}`, "JOINED");
};
