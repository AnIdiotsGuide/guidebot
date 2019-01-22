exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
if (!args) return message.reply("Tens de ter algo para votar! LOL")
if (!message.content.includes("?")) return message.reply("Inclui um ? na tua votação!")
message.channel.send(`:ballot_box:  ${message.author.username} Iniciou uma votação! Reage com os emojis para votar! :ballot_box: `);
const pollTopic = await message.channel.send(message.content.slice(2));
await pollTopic.react(`✅`);
await pollTopic.react(`⛔`);
// Create a reaction collector
const filter = (reaction) => reaction.emoji.name === '✅';
const collector = pollTopic.createReactionCollector(filter, { time: 15000 });
collector.on('collect', r => console.log(`Collected ${r.emoji.name}`));
collector.on('end', collected => console.log(`Collected ${collected.size} items`));
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "MASTER"
};

exports.help = {
  name: "poll",
  category: "Outros",
  description: "Cria uma votação.",
  usage: "poll [questão]"
};
