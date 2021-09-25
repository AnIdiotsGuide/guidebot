const { Permissions } = require("discord.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply();
  if (!interaction.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) 
    return await interaction.editReply("I do not have permission to kick members in this server.");
  await interaction.member.send("You requested to leave the server, if you change your mind you can rejoin at a later date.");
  await interaction.member.kick(`${interaction.member.displayName} wanted to leave.`);
  await interaction.editReply(`${interaction.member.displayName} left in a hurry!`);
};

exports.commandData = {
  name: "leave",
  description: "Make's the user leave the guild.",
  options: [],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: true
};