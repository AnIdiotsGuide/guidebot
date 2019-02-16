const prefix = "//"
exports.run = async (client, message, level) => {
  if (!message.content.startsWith(prefix)) return;

  message.channel.send('**TOU A FUMAR, PÁ!**').then(async msg => {
    setTimeout(() => {
      msg.edit('🚬');
    }, 500);
    setTimeout(() => {
      msg.edit('🚬 ☁ ');
    }, 1000);
    setTimeout(() => {
      msg.edit('🚬 ☁☁ ');
    }, 1500);
    setTimeout(() => {
      msg.edit('🚬 ☁☁☁ ');
    }, 2000);
    setTimeout(() => {
      msg.edit('🚬 ☁☁');
    }, 2500);
    setTimeout(() => {
      msg.edit('🚬 ☁');
    }, 3000);
    setTimeout(() => {
      msg.edit('🚬 ');
    }, 3500);
    setTimeout(() => {
      msg.edit(`Acabas-te de fumar, ó viciado!`);
    }, 4000);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "fumar",
  category: "Diversão",
  description: "Fuma todos os dias! :dab:",
  usage: "fumar"
};