exports.run = async (client, message, args, level) => {// eslint-disable-line no-unused-vars
  if (!args || args.length < 1) return message.reply("Deves introduzir um comando para reiniciar.");

  let response = await client.unloadCommand(args[0]);
  if (response) return message.reply(`Erro de Unloading: ${response}`);

  response = client.loadCommand(args[0]);
  if (response) return message.reply(`Erro no carregamento: ${response}`);

  message.reply(`O comando \`${args[0]}\` foi reiniciado`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "reload",
  category: "Sistema",
  description: "Reinicia um comanando que foi modificado..",
  usage: "reload [comando]"
};
