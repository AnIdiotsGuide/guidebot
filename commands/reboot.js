let hasPM2;

/* retired until I can find an easy way to check it globally
try {
  require.resolve("pm2");
  hasPM2 = "PM2 is installed, hopefully that means this bot will reboot in a moment!";
} catch (e) {
  hasPM2 = "Cannot find PM2. You must restart this bot manually from the command prompt.";
}
*/

exports.run = async (client, message, args, level) => {// eslint-disable-line no-unused-vars
  await message.reply(`Bot is shutting down.`);
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
