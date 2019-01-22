exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const msg = await message.channel.send("Ping?");
  msg.edit(`Pong! A Latência do Bot é: ${msg.createdTimestamp - message.createdTimestamp}ms. A Latência do API é: ${Math.round(client.ping)}ms`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "ping",
  category: "Outros",
  description: "Mostra a latência do bot e do API do Discord.",
  usage: "ping"
};
