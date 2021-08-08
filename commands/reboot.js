exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const replying = client.settings.ensure(message.guild.id, client.config.defaultSettings).commandReply;
  await message.reply({ content: "Bot is shutting down.", allowedMentions: { repliedUser: (replying === "true") }});
  await Promise.all(client.commands.map(cmd =>
    client.unloadCommand(cmd)
  ));
  process.exit(0);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["restart"],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "reboot",
  category: "System",
  description: "Shuts down the bot. If running under PM2, bot will restart automatically.",
  usage: "reboot"
};
