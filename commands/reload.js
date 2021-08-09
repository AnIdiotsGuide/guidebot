const Command = require("../base/Command.js");

module.exports = class Reload extends Command {
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

    const replying = this.client.settings.ensure(message.guild.id, this.client.config.defaultSettings).commandReply;
    
    const type = args[0];
    const module = args[1];
    
    if (!type || args.length < 1) return message.reply({ content: "What kind of module are you trying to reload? You can reload commands, events, or slash commands.", allowedMentions: { repliedUser: (replying === "true") } });
    if (!module) return message.reply({ content: "Must provide a module to reload. Derp.", allowedMentions: { repliedUser: (replying === "true") }});  

    switch (type) {
      case "command": {
        const command = this.client.commands.get(module) || this.client.commands.get(this.client.aliases.get(module));
        
        let response = await this.client.unloadCommand(command.conf.location, command.help.name);
        if (response) return message.reply({ content: `Error Unloading: ${response}`, allowedMentions: { repliedUser: (replying === "true") }});

        response = this.client.loadCommand(command.conf.location, command.help.name);
        if (response) return message.reply({ content: `Error Loading: ${response}`, allowedMentions: { repliedUser: (replying === "true") }});

        return message.reply({ content: `The command \`${command.help.name}\` has been reloaded`, allowedMentions: { repliedUser: (replying === "true") }});
      }

      case 'slash': {
        const command = this.client.slashcmds.get(module);

        let response = await this.client.unloadSlashCommand('./slash', command.commandData.name);
        if (response) return message.reply({ content: `Error Unloading: ${response}`, allowedMentions: { repliedUser: (replying === "true") }});

        response = this.client.loadSlashCommand('./slash', command.commandData.name);
        if (response) return message.reply({ content: `Error Loading: ${response}`, allowedMentions: { repliedUser: (replying === "true") }});

        return message.reply({ content: `The slash command \`${command.commandData.name}\` has been reloaded`, allowedMentions: { repliedUser: (replying === "true") }});
      }

      case "event": {
        const event = this.client.events.get(module);
        if (!event) return message.reply({ content: `${module} is neither a command, a command alias, or an event. Please check your spelling and try again.`, allowedMentions: { repliedUser: (replying === "true") }});

        const response = await this.client.reloadEvent(this.client, event.conf.name);
        if (response) return message.reply({ content: `Error Unloading: ${response}`, allowedMentions: { repliedUser: (replying === "true") }});

        return message.reply({ content: `The event \`${event.conf.name}\` has been reloaded`, allowedMentions: { repliedUser: (replying === "true") }});
      }
    }
  }
};
