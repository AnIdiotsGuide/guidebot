module.exports = class slashCommand {

  constructor(client, {
    name = null,
    description = "No description provided.",
    options = [],
    defaultPermission = true,
    guildOnly = false // false = global, true = guild.
  }) {
    this.client = client;
    this.commandData = { name, description, options, defaultPermission };
    this.guildOnly = guildOnly;
  }

};