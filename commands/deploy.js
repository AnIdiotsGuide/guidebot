exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
// Filter the slash commands to find guild only ones.
  const guildCmds = client.slashcmds.filter(c => c.guildOnly).map(c => c.commandData);

  // Now we filter out global commands by inverting the filter.
  const globalCmds = client.slashcmds.filter(c => !c.guildOnly).map(c => c.commandData);

  // Give the user a notification the commands are deploying.
  await message.channel.send("Deploying commands!");

  // We'll use set but please keep in mind that `set` is overkill for a singular command.
  // Set the guild commands like 
  await client.guilds.cache.get(message.guild.id)?.commands.set(guildCmds);

  // Then set the global commands like 
  await client.application?.commands.set(globalCmds).catch(e => console.log(e));

  // Reply to the user that the commands have been deployed.
  await message.channel.send("All commands deployed!");
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "deploy",
  category: "System",
  description: "This will deploy all slash commands.",
  usage: "deploy"
};
