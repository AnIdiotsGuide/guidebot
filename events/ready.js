const { defaultSettings } = require("../config.js");
const { settings } = require("../util/settings.js");
const logger = require("../util/logger.js");
module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {
    // Check whether the "Default" guild settings are loaded in the enmap.
    // If they're not, write them in. This should only happen on first load.
    if (!settings.has("default")) {
      if (!defaultSettings) throw new Error("defaultSettings not preset in config.js or settings database. Bot cannot load.");
      settings.set("default", defaultSettings);
    }

    // Set the game as the default help command + guild count.
    // NOTE: This is also set in the guildCreate and guildDelete events!
    this.client.user.setActivity(`${settings.get("default").prefix}help | ${this.client.guilds.cache.size} Servers`);
  
    // Log that we're ready to serve, so we know the bot accepts commands.
    logger.log(`${this.client.user.tag}, ready to serve ${this.client.users.cache.size} users in ${this.client.guilds.cache.size} servers.`, "ready");
  }
};