const Command = require("../base/Command.js");

module.exports = class MyLevel extends Command {
  constructor(client) {
    super(client, {
      name: "mylevel",
      description: "Displays your permission level for your location.",
      usage: "mylevel",
      guildOnly: true
    });
  }

  async run(message, args, level) {
    const friendly = this.client.config.permLevels.find(l => l.level === level).name;
    const replying = this.client.settings.ensure(message.guild.id, this.client.config.defaultSettings).commandReply;
    message.reply({ content: `Your permission level is: ${level} - ${friendly}`, allowedMentions: { repliedUser: (replying === "true") }});
  }
};