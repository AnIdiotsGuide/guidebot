// This event executes when a new guild (server) is joined.

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {

    this.client.user.setActivity(`${this.client.settings.get("default").prefix}help | ${this.client.guilds.cache.size} Servers`);
    this.client.logger.cmd(`[GUILD JOIN] ${guild.id} added the bot. Owner: ${guild.ownerId}`);
  }
};
