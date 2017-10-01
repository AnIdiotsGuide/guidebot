exports.run = async (client, message, args, level) => {// eslint-disable-line no-unused-vars
  if (!args || args.size < 1) return message.reply("Must provide a command to reload. Derp.");

  let command;
  if (client.commands.has(args[0])) {
    command = client.commands.get(args[0]);
  } else if (client.aliases.has(args[0])) {
    command = client.commands.get(client.aliases.get(args[0]));
  }
  if (!command) return message.reply(`The command \`${args[0]}\` doesn"t seem to exist, nor is it an alias. Try again!`);
  command = command.help.name;

  if (command.shutdown) {
    await command.shutdown(client);
  }

  delete require.cache[require.resolve(`./${command}.js`)];
  const cmd = require(`./${command}`);
  client.commands.delete(command);
  client.aliases.forEach((cmd, alias) => {
    if (cmd === command) client.aliases.delete(alias);
  });
  client.commands.set(command, cmd);
  if (cmd.init) {
    cmd.init(client);
  }
  cmd.conf.aliases.forEach(alias => {
    client.aliases.set(alias, cmd.help.name);
  });

  message.reply(`The command \`${command}\` has been reloaded`);
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
