exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  try {
    await interaction.deferReply();
    const reply = await interaction.editReply("Ping?");
    await interaction.editReply(`Pong! Latency is ${reply.createdTimestamp - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms.`);
      
  } catch (e) {
    console.log(e);
    return await interaction.editReply(`There was a problem with your request.\n\`\`\`${e.message}\`\`\``);
  }
};

exports.commandData = {
  name: "ping",
  description: "Pongs when pinged.",
  options: [],
  defaultPermission: true,
};

// Set this to false if you want it to be global.
exports.guildOnly = false;