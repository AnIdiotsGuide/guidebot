// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = (client, message) => {

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;

  // Grab the settings for this server from the PersistentCollection
  // If there is no guild, get default conf (DMs)
  // For ease of use in commands and functions, we'll attach the settings
  // to the message object, so `message.settings` is accessible.
  const settings = message.settings = client.getSettings(message.guild);
  
  // Just in case we don't know what the current prefix is, mention the bot
  // and the following regex will detect it and fire off letting you know
  // what the current prefix is.
  const mentionMatch = new RegExp(`^<@!?${client.user.id}> ?$`);
  if (message.content.match(mentionMatch)) {
    return message.channel.send(`My prefix on this guild is \`${settings.prefix}\``);
  }

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file, but as a fall back we'll also use
  // a mention as a prefix.
  // So the prefixes array lists 2 items, the prefix from the settings and
  // the bots user id (a mention).
  const prefixes = [settings.prefix, `<@!${client.user.id}>`];
  const prefix = prefixes.find(p => message.content.startsWith(p));
  if (message.content.indexOf(prefix.toLowerCase()) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(prefix.toLowerCase().length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Get the user or member's permission level from the elevation
  const level = client.permlevel(message);

  // Check whether the command, or alias, exist in the collections defined
  // in app.js.
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  // using this const varName = thing OR otherthing; is a pretty efficient
  // and clean way to grab one of 2 values!
  if (!cmd) return;

  // Some commands may not be useable in DMs. This check prevents those commands from running
  // and return a friendly error message.
  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

  if (level < client.levelCache[cmd.conf.permLevel]) {
    if (settings.systemNotice === "true") {
      return message.channel.send(`You do not have permission to use this command.
  Your permission level is ${level} (${client.config.permLevels.find(l => l.level === level).name})
  This command requires level ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
    } else {
      return;
    }
  }

  // To simplify message arguments, the author's level is now put on level (not member so it is supported in DMs)
  // The "level" command module argument will be deprecated in the future.
  message.author.permLevel = level;
  
  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }
  // If the command exists, **AND** the user has permission, run it.
  client.logger.log(`${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, "cmd");
  cmd.run(client, message, args, level);
};
