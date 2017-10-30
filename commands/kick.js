exports.run = (client, message, [mention, ...reason]) => {
  if (message.mentions.users.size === 0) {
    return message.reply("Please mention a user to kick");

    if (!message.guild.me.hasPermission("KICK_MEMBERS"))
      return message.reply("Bot does not have permission to kick");

    const kickMember = message.mentions.members.first();

    kickMember.kick(reason.join(" ")).then(member => {
      message.reply(`${member.user.username} was succesfully kicked.`);
    });
  }
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "Kick",
  category: "Moderation",
  description: "Kicks a member of your guild",
  usage: "mention, ...reason"
