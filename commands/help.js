exports.run = (client, message, params, level) => {
  if (!params[0]) {
    const myCommands = client.commands.filter(c=>c.conf.permLevel <= level);
    const commandNames = myCommands.keyArray();
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
    let currentCategory = "";
    let output = `= Command List =\n\n[Use ${client.config.prefix}help <commandname> for details]\n`;
    const sorted = myCommands.sort((p, c) => p.help.category > c.help.category);
    sorted.forEach( c => { 
      if(currentCategory !== c.help.category) {
        output += `\n== ${c.help.category}\n`;
        currentCategory = c.help.category;
      }
     output += `${client.config.prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
    });
    message.channel.send(output, {code:'asciidoc'});
  } else {
    let command = params[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      message.channel.send(`= ${command.help.name} = \n${command.help.description}\nusage::${command.help.usage}`, {code:'asciidoc'});
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['h', 'halp'],
  permLevel: 0
};

exports.help = {
  name: 'help',
  category: 'system',
  description: 'Displays all the available commands for your permission level.',
  usage: 'help [command]'
};