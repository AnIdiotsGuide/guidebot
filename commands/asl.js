exports.run = (client, message, args) => {    
    let [age, sex, location] = args;
    message.reply(`Hello ${message.author.username}, I see you're a ${age} year old ${sex} from ${location}. Wanna date?`).catch(console.error);
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "Age Sex Location",
  category: "Normal",
  description: "Testing with args",
  usage: "asl"
};