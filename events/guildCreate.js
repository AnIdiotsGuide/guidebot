const logger = require("../util/logger.js");
const { defaultSettings } = require("../config.js");
const { settings } = require("../util/settings.js");
// This event executes when a new guild (server) is joined.
module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {
    // Filter and map out guild only commands
    const guildCmds = this.client.container.slashcmds.filter(c => c.guildOnly).map(c => c.commandData);

    // Set the slash commands for the guild.
    await this.client.guilds.cache.get(guild.id)?.commands.set(guildCmds);

    // Let's create the server settings while we're here.
    settings.set(guild.id, defaultSettings);

    // Set the bot's activity, updating when ever it is invited to a server.
    this.client.user.setActivity(`${defaultSettings.prefix}help | ${this.client.guilds.cache.size} Servers`);

    // Log the event.
    logger.cmd(`[GUILD JOIN] ${guild.id}, added the bot.`);
  }
};