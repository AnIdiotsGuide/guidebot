const Command = require("../base/Command.js");

const { defaultSettings } = require("../config.js");
const { settings } = require("../util/settings.js");

module.exports = class Reboot extends Command {
  constructor(client) {
    super(client, {
      name: "reboot",
      description: "If running under PM2, bot will restart.",
      category: "Owner",
      usage: "reboot",
      permLevel: "Bot Owner",
      aliases: ["restart"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const replying = settings.ensure(message.guild.id, defaultSettings).commandReply;
    await message.reply({ content: "Bot is shutting down.", allowedMentions: { repliedUser: (replying === "true") }});
    await Promise.all(this.client.container.commands.map(cmd => {
      // the path is relative to the *current folder*, so just ./filename.js
      delete require.cache[require.resolve(`./${cmd.help.name}.js`)];
      // We also need to delete and reload the command from the container.commands Enmap
      this.client.container.commands.delete(cmd.help.name);
    }));
    process.exit(0);  }
};