exports.run = (client, message) => {
	message.channel.send('Meh.');
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "Blah",
  category: "Normal",
  description: "Another way to ping",
  usage: "blah"
