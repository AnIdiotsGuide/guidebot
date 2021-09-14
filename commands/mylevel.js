const Command = require("../base/Command.js");
const { permLevels, defaultSettings } = require("../config.js");
const { settings } = require("../util/settings.js");
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
    const friendly = permLevels.find(l => l.level === level).name;
    const replying = settings.ensure(message.guild.id, defaultSettings).commandReply;
    message.reply({ content: `Your permission level is: ${level} - ${friendly}`, allowedMentions: { repliedUser: (replying === "true") }});
  }
};