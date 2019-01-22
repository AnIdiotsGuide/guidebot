exports.run = async (client, message, args, level) => {
case 'say': if (message.startsWith("!say") == true) {
//Check if the message send starts with "say" 
var newMessage = message.replace("say ", "");
//Making a variable where "say " is removed 
bot.sendMessage({to: channelID, message:newMessage})
//Send the new variable. } break;
  
 exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "say",
  category: "Outros",
  description: "Faz o bot dizer aquilo que escreves.",
  usage: "say"
};
