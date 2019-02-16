exports.run = async (client, message, args, level) => {
  if (message.content.startsWith('//' + 'id')) {
    if (message.channel.type === "dm") return;   
    message.channel.sendMessage(`**${message.author.username} **` + "O teu ID do Discord: " + `__${message.author.id}__`);
  }
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "id",
  category: "Outros",
  description: "Mostra o teu id do discord.",
  usage: "id"
};
