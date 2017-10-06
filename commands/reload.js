exports.run = async (client, message, args, level) => {// eslint-disable-line no-unused-vars
  if (!args || args.size < 1) return message.reply("Must provide a command to reload. Derp.");

  let command;
  if (client.commands.has(args[0])) {
    command = client.commands.get(args[0]);
  } else if (client.aliases.has(args[0])) {
    command = client.commands.get(client.aliases.get(args[0]));
  }
  if (!command) return message.reply(`The command \`${args[0]}\` doesn"t seem to exist, nor is it an alias. Try again!`);

  if (command.shutdown) {
    await command.shutdown(client);
  }

  const commandName = command.help.name;
  delete require.cache[require.resolve(`./${commandName}.js`)];
  const cmd = require(`./${commandName}`);
  client.commands.delete(cmd.help.name);
  client.aliases.forEach((cmdName, alias) => {
    if (cmdName === cmd.help.name) client.aliases.delete(alias);
  });
  client.commands.set(cmd.help.name, cmd);
  if (cmd.init) {
    cmd.init(client);
  }
  cmd.conf.aliases.forEach(alias => {
    client.aliases.set(alias, cmd.help.name);
  });

  message.reply(`The command \`${cmd.help.name}\` has been reloaded`);
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
