exports.run = async (client, message, args, level) => {// eslint-disable-line no-unused-vars
  await message.reply("Bot is shutting down.");
  client.commands.forEach( async cmd => {
    if (cmd.shutdown) cmd.shutdown(client);
  });
  process.exit(1);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "reboot",
  category: "System",
  description: "Shuts down the bot. If running under PM2, bot will restart automatically.",
  usage: "reboot"
};
