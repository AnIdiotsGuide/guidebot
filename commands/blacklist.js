exports.run = async (client, message, [action, key], level) => {

  // These are our only valid actions.
  const validActions = ["add", "remove", "view"];

  // Check if the action argument is valid, if not remind the user how to use the command.
  if (!validActions.includes(action)) return message.reply("Usage Example: `-blacklist view|add|remove [mention|userid]`");

  // Load up the blacklist.
  const blacklist = client.blacklist.get(message.guild.id);

  // To utilise the client.permlevel check without rewriting, or copying a
  // big chunk of code, we'll create a `fake` message object to pass to it,
  // but using the mentioned user / supplied id as the author.

  // We create a new author and check to see if the user supplied a mention,
  // or a user id, without any messy regex.
  const author = message.mentions.users.first() || client.users.get(key);

  // Then we create the `message.member` aspect by using the author object
  // we created above.
  const member = message.guild.member(author);

  // Now we construct the fake message object to pass to the `client.permlevel`
  // check further down in the code.
  const msg = { author:author, member:member, guild: message.guild };

  // Usage example `-blacklist add @York#2400` or `-blacklist add 146048938242211840`.
  if (action === "add") {

    // If the user forgets to add a mention or user id.
    if (!author) return message.channel.send("You must supply a user id or mention to blacklist them.");

    // If the user is already blacklisted for this guild.
    if (blacklist.includes(author.id)) return message.reply("That user is already blacklisted.");

    // If the user attempts to blacklist themselves.
    if (message.author.id === author.id) return message.reply("You cannot blacklist yourself.");

    // This is where we perform the permlevel check with the fake message object we created above.
    if (level <= client.permlevel(msg)) return message.reply("You cannot black list someone of equal, or a higher permission level.");

    // Push the fake author id to the blacklist array.
    blacklist.push(author.id);

    // Update the blacklist collection with the modified blacklist array.
    client.blacklist.set(message.guild.id, blacklist);

    // Inform the user the action was performed successfully.
    message.channel.send("User successfully added to blacklist.");
  }

  // Usage example `-blacklist remove @York#2400` or `-blacklist remove 146048938242211840`.
  if (action === "remove") {

    // If the user forgets to add a mention or user id.
    if (!author) return message.channel.send("You must supply a user id or mention to blacklist them.");

    // If the user isn't already blacklisted for this guild.
    if (!blacklist.includes(author.id)) return message.reply("That user is not blacklisted.");

    // Remove the fake author id from the blacklist array.
    // This is a custom removal for arrays, please check out `/modules/functions.js#L107`.
    blacklist.remove(author.id);

    // Update the blacklist collection with the modified blacklist array.
    client.blacklist.set(message.guild.id, blacklist);

    // Inform the user the action was performed successfully.
    message.channel.send("User successfully removed from blacklist.");
  }

  if (action === "view") {

    // Basically if the blacklist is empty, return the message.
    if (blacklist.length < 1) return message.channel.send("No one is blacklisted.");

    // Make a custom promise that maps everyone in the blacklist then fetches their user
    // details for the command.
    const fetch = Promise.all(blacklist.map(r => client.fetchUser(r).then(u => u.tag)));

    // After we've `fetch`ed the users from the blacklist, join and send them to the channel.
    fetch.then(r => message.channel.send(`**❯ Blacklisted:**\n${r.join("\n")}`));
  }

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: "blacklist",
  category: "System",
  description: "blacklists a supplied user.",
  usage: "blacklist <mention/userid>",
};
