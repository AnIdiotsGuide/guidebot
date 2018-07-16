const Discord = require('discord.js');

exports.run = (client, message, args, tools) => {

	const embed = new Discord.MessageEmbed()
		.setAuthor(message.guild.name, message.guild.iconURL())
		.setColor('#0099ff')
		.setThumbnail(message.guild.iconURL())
		.addField('Members', `**${message.guild.memberCount}**`, true)
		.addBlankField(true)
		.addField('Humans', `**${message.guild.members.filter(member => !member.user.bot).size}**`, true)
		.addField('Bots', `**${message.guild.members.filter(member => member.user.bot).size}**`, true)
		.addField('Member Status', `**${message.guild.members.filter(o => o.presence.status === 'online').size}** Online\n**${message.guild.members.filter(i => i.presence.status === 'idle').size}** Idle/Away\n**${message.guild.members.filter(dnd => dnd.presence.status === 'dnd').size}** Do Not Disturb\n**${message.guild.members.filter(off => off.presence.status === 'offline').size}** Offline/Invisible\n**${message.guild.members.filter(s => s.presence.status === 'streaming').size}** Streaming`)
		.setFooter(`Owner: ${message.guild.owner.user.tag}`)
	message.channel.send(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "membercount",
  category: "Miscelaneous",
  description: "read it and weep",
  usage: "membercount"
};
