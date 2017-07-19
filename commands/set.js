const { inspect } = require("util");

exports.run = async (client, msg, [action, key, ...value]) => {
  let settings = client.settings.get(msg.guild.id);
  
  if(action === "edit") {
    if(!key) return msg.reply("Please specify a key to edit");
    if(!settings[key]) return msg.reply("This key does not exist in the settings");
    if(!value) return msg.reply("Please specify a new value");
    
    settings[key] = value.join(" ");
    client.settings.set(msg.guild.id, settings);
    msg.reply(`${key} successfully edited to ${value}`);
  } else
  if(action === "get") {
    if(!key) return msg.reply("Please specify a key to view");
    if(!settings[key]) return msg.reply("This key does not exist in the settings");
    msg.reply(`The value of ${key} is currently ${settings[key]}`);
  } else {
    msg.channel.send(inspect(settings), {code: "json"});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["setting", "settings", "conf"],
  permLevel: 3
};

exports.help = {
  name: 'set',
  category: 'System',
  description: 'View or change settings for your server.',
  usage: 'set <view/get/edit> <key> <value>'
};
