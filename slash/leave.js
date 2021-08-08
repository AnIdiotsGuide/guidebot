exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply();
  await interaction.member.send("You requested to leave the server, if you change your mind you can rejoin at a later date.");
  await interaction.member.kick(`${interaction.member.displayName} wanted to leave.`);
  await interaction.editReply(`${interaction.member.displayName} left in a hurry!`);
};

exports.commandData = {
  name: "leave",
  description: "Make's the user leave the guild.",
  options: [],
  defaultPermissions: true,
};

// Set this to false if you want it to be global.
exports.guildOnly = true;