const { Permissions } = require("discord.js");
const slashCommand = require("../base/slashCommand.js");

module.exports = class Leave extends slashCommand {
  constructor(client) {
    super(client, {
      name: "leave",
      description: "Makes the user leave the guild.",
      options: [],
      guildOnly: true // Set this to false if you want it to be global.
    });
  }

  async run(interaction) {
    await interaction.deferReply();
    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) 
      return await interaction.editReply("I do not have permission to kick members in this server.");
    await interaction.member.send("You requested to leave the server, if you change your mind you can rejoin at a later date.");
    await interaction.member.kick(`${interaction.member.displayName} wanted to leave.`);
    await interaction.editReply(`${interaction.member.displayName} left in a hurry!`);
  }
};