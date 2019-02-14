exports.run = (client, message, args)  => {
    
  var falas = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34]
  let user = message.mentions.users.first();
  var variavel = falas[Math.floor(Math.random() * falas.length)]
  if (message.mentions.users.size < 1) return message.reply('**Você Não Mencionou O Usuario Que Você Matar!**').catch(console.error);
  message.channel.send({embed: {
    description: "**<@" + message.author.id + "> Matou <@" + user.id + "*>*" ,
    color: "65535",
    timestamp: new Date(),
    image: {
      url: `https://i.pinimg.com/originals/f2/b9/ab/f2b9ab9e3b8d12f1e3c6a8dd390ff8b9.gif`
    } 
  }
  })
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "matar",
  category: "Outros",
  description: "Mata um jogador especificado",
  usage: "matar [jogador]"
};