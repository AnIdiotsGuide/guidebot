const { Team } = require("discord.js");

const Event = require("../base/Event");

class Ready extends Event {
  constructor(client) {
    super(client, {
      name: "ready"
    });
  }

  async run() {

    // Why await here? Because the ready event isn't actually ready, sometimes
    // guild information will come in *after* ready. 1s is plenty, generally,
    // for all of them to be loaded.
    // NOTE: client.wait is added when we create the Guidebot class in ../index.js!
    await this.client.wait(1000);

    if (!this.client.application?.owner) await this.client.application?.fetch();
    if (this.client.owners.length < 1) {
      if (this.client.application.owner instanceof Team) {
        this.client.owners.push(...this.client.application.owner.members.keys());
      } else {
        this.client.owners.push(this.client.application.owner.id);
      }
    }

    // Check whether the "Default" guild settings are loaded in the enmap.
    // If they're not, write them in. This should only happen on first load.
    if (!this.client.settings.has("default")) {
      if (!this.client.config.defaultSettings) throw new Error("defaultSettings not preset in config.js or settings database. Bot cannot load.");
      this.client.settings.set("default", this.client.config.defaultSettings);
    }

    // Set the game as the default help command + guild count.
    // NOTE: This is also set in the guildCreate and guildDelete events!
    this.client.user.setActivity(`${this.client.settings.get("default").prefix}help | ${this.client.guilds.cache.size} Servers`);
  
    // Log that we're ready to serve, so we know the bot accepts commands.
    this.client.logger.log(`${this.client.user.tag}, ready to serve ${this.client.users.cache.size} users in ${this.client.guilds.cache.size} servers.`, "ready");
  }
}

module.exports = Ready;
