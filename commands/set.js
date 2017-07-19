const { inspect } = require("util");

exports.run = async (client, message, [action, key, ...value]) => {
  const settings = client.settings.get(message.guild.id);

  if(action === "edit") {
    if(!key) return message.reply("Please specify a key to edit");
    if(!settings[key]) return message.reply("This key does not exist in the settings");
    if(!value) return message.reply("Please specify a new value");

    settings[key] = value.join(" ");
    client.settings.set(message.guild.id, settings);
    message.reply(`${key} successfully edited to ${value}`);
  } else
  if(action === "get") {
    if(!key) return message.reply("Please specify a key to view");
    if(!settings[key]) return message.reply("This key does not exist in the settings");
    message.reply(`The value of ${key} is currently ${settings[key]}`);
  } else {
    message.channel.send(inspect(settings), {code: "json"});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["setting", "settings", "conf"],
  permLevel: 3
};

exports.help = {
  name: "set",
  category: "System",
  description: "View or change settings for your server.",
  usage: "set <view/get/edit> <key> <value>"
};
