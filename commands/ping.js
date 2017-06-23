exports.run = async (client, msg, args) => {
  const m = await msg.channel.send("Ping?");
  m.edit(`Pong! Latency is ${m.createdTimestamp - msg.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`) );
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'ping',
  description: 'It... like... pings. Then Pongs. And it\'s not Ping Pong.',
  usage: 'ping'
};
