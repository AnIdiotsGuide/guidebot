exports.run = async (client, message, args, level) => {// eslint-disable-line no-unused-vars
  await message.reply("Bot is shutting down.");
  client.commands.forEach( async cmd => {
    await client.unloadCommand(cmd);
  });
  process.exit(1);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "MASTER"
};

exports.help = {
  name: "reboot",
  category: "Sistema",
  description: "Desliga o bot. Se ele estiver a rodar em PM2, o bot vai reiniciar automáticamente.",
  usage: "reboot"
};
