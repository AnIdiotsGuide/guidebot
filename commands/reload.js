exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const replying = client.settings.ensure(message.guild.id, client.config.defaultSettings).commandReply;
  if (!args || args.length < 1) return message.reply({ content: "Must provide a command to reload. Derp.", allowedMentions: { repliedUser: (replying === "true") }});
  const command = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
  let response = await client.unloadCommand(args[0]);
  if (response) return message.reply({ content: `Error Unloading: ${response}`, allowedMentions: { repliedUser: (replying === "true") }});

  response = client.loadCommand(command.help.name);
  if (response) return message.reply({ content: `Error Loading: ${response}`, allowedMentions: { repliedUser: (replying === "true") }});

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