exports.run = async (client, message, args, level) => {// eslint-disable-line no-unused-vars
        if (!args || args.size < 1) return message.reply('Must provide a command to reload.');
        var commands;
        if (this.client.commands.has(args[0])) {
            commands = this.client.commands.get(args[0]);
        } else if (this.client.aliases.has(args[0])) {
            commands = this.client.commands.get(this.client.aliases.get(args[0]));
        }
        if (!commands) return message.reply(`The command \`${args[0]}\` doesn't seem to exist, nor is it an alias. Try again!`);
        let response = await this.client.unloadCommand(`${commands.conf.location}`, commands.help.name);
        if (response) return message.reply(`Error Unloading: ${response}`);

        response = this.client.loadCommand(`${commands.conf.location}`, commands.help.name);
        if (response) return message.reply(`Error loading: ${response}`);

        message.reply(`The command \`${commands.help.name}\` has been reloaded`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "reload",
  category: "System",
  description: "Reloads a command that\"s been modified.",
  usage: "reload [command]"
};
