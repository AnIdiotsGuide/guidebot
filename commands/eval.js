const Discord = require("discord.js");

// The EVAL command will execute **ANY** arbitrary javascript code given to it.
// THIS IS PERMISSION LEVEL 10 FOR A REASON! It's perm level 10 because eval
// can be used to do **anything** on your machine, from stealing information to
// purging the hard drive. DO NOT LET ANYONE ELSE USE THIS


// However it's, like, super ultra useful for troubleshooting and doing stuff
// you don't want to put in a command.
exports.run = async (client, msg, args, level) => {
  const code = args.join(" ");
  try {
      const evaled = eval(code);
      const clean = await client.clean(client, evaled);
      msg.channel.send(`\`\`\`xl\n${clean}\n\`\`\``
      );        
  } catch(err) {
      msg.channel.send(`\`ERROR\` \`\`\`xl\n${await client.clean(client, err)}\n\`\`\``);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 10 // DO NOT LOWER THIS!!!!!!!!
};

exports.help = {
  name: 'eval',
  category: 'system',
  description: 'Evaluates arbitrary javascript.',
  usage: 'eval [...code]'
};
