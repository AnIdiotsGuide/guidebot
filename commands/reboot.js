const Command = require("../base/Command.js");

module.exports = class Reboot extends Command {
  constructor(client) {
    super(client, {
      name: "reboot",
      description: "If running under PM2, bot will restart.",
      category: "System",
      usage: "reboot",
      permLevel: "Bot Owner",
      aliases: ["restart"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const replying = this.client.settings.ensure(message.guild.id, this.client.config.defaultSettings).commandReply;
      await message.reply({ content: "Bot is shutting down.", allowedMentions: { repliedUser: (replying === "true") }});
      await Promise.all(this.client.commands.map(cmd => this.client.unloadCommand(cmd)));
      process.exit(1);
    } catch (e) {
      console.log(e);
    }
  }
};