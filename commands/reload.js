const Command = require("../base/Command.js");

class Reload extends Command {
  constructor(client) {
    super(client, {
      name: "reload",
      description: "Reloads a command that has been modified.",
      category: "System",
      usage: "reload [command]",
      permLevel: "Bot Admin"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const replying = this.client.settings.get(message.guild.id).commandReply;
    if (!args || args.length < 1) return message.reply({ content: "Must provide a command to reload. Derp.", allowedMentions: { repliedUser: (replying === "true") }});    

    const commands = this.client.commands.get(args[0]) || this.client.commands.get(this.client.aliases.get(args[0]));
    if (!commands) return message.reply({ content: `The command \`${args[0]}\` does not exist, nor is it an alias.`, allowedMentions: { repliedUser: (replying === "true") }});

    let response = await this.client.unloadCommand(commands.conf.location, commands.help.name);
    if (response) return message.reply({ content: `Error Unloading: ${response}`, allowedMentions: { repliedUser: (replying === "true") }});

    response = this.client.loadCommand(commands.conf.location, commands.help.name);
    if (response) return message.reply({ content: `Error Loading: ${response}`, allowedMentions: { repliedUser: (replying === "true") }});

    message.reply({ content: `The command \`${commands.help.name}\` has been reloaded`, allowedMentions: { repliedUser: (replying === "true") }});
  }
}
module.exports = Reload;
