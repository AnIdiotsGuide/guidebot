const logger = require("../util/logger.js");
const { defaultSettings } = require("../config.js");
const { settings } = require("../util/settings.js");
// This event executes when a new guild (server) is joined.
module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {
    // Set the bot's activity, updating when ever it is invited to a server.
    this.client.user.setActivity(`${defaultSettings.prefix}help | ${this.client.guilds.cache.size} Servers`);

    // Well they're gone. Let's remove them from the settings and log it!
    settings.delete(guild.id);

    // Log the event.
    logger.cmd(`[GUILD LEFT] ${guild.id}, removed the bot.`);
  }
};