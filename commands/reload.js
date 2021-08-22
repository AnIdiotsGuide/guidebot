const config = require("../config.js");
const { settings } = require("../modules/settings.js");
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const replying = settings.ensure(message.guild.id, config.defaultSettings).commandReply;
  if (!args || args.length < 1) return message.reply("Must provide a command name to reload.");
  const command = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
  // Check if the command exists and is valid
  if (!client.commands.has(command.help.name)) {
    return message.reply("That command does not exist");
  }
  // the path is relative to the *current folder*, so just ./filename.js
  delete require.cache[require.resolve(`./${command.help.name}.js`)];
  // We also need to delete and reload the command from the client.commands Enmap
  client.commands.delete(command.help.name);
  const props = require(`./${command.help.name}.js`);
  client.commands.set(command.help.name, props);

  message.reply({ content: `The command \`${command.help.name}\` has been reloaded`, allowedMentions: { repliedUser: (replying === "true") }});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "reload",
  category: "System",
  description: "Reloads a command that\"s been modified.",
  usage: "reload [command]"
};