// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = (client, message) => {
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(client.config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.split(/\s+/g);
  const command = args.shift().slice(client.config.prefix.length).toLowerCase();

  // Get the user or member's permission level from the elevation
  let perms = client.permlevel(message);
  let cmd;
  
  // Check whether the command, or alias, exist in the collections defined
  // in app.js. 
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  // If the command exists, **AND** the user has permission, run it.
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    client.log("log", `${message.guild.name}/#${message.channel.name}: ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, "CMD");
    cmd.run(client, message, args, perms);
  }
  // Best Practice: **do not** reply with a message if the command does
  // not exist, or permissions lack.
};