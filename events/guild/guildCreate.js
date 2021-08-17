// This event executes when a new guild (server) is joined.

const Event = require("../../base/Event.js");

module.exports = class guildCreate extends Event {
  constructor(client) {
    super(client, {
      name: "guildCreate"
    });
  }

  async run(guild) {
    // Filter and map out guild only commands
    const guildCmds = this.client.slashcmds.filter(c => c.guildOnly).map(c => c.commandData);

    // Set the slash commands for the guild.
    await this.client.guilds.cache.get(guild.id)?.commands.set(guildCmds);

    // Set the bot's activity, updating when ever it is invited to a server.
    this.client.user.setActivity(`${this.client.settings.get("default").prefix}help | ${this.client.guilds.cache.size} Servers`);

    // Log the event.
    this.client.logger.cmd(`[GUILD JOIN] ${guild.id} added the bot. Owner: ${guild.ownerId}`);
  }
};