exports.run = async (client, msg, args, perms) => {
  msg.reply("Your permission level is: " + perms);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'mylevel',
  category: 'Miscelaneous',
  description: 'Tells you your permission level for the current message location.',
  usage: 'mylevel'
};
