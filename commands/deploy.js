const Command = require("../base/Command.js");

module.exports = class Deploy extends Command {
  constructor(client) {
    super(client, {
      name: "deploy",
      description: "This will deploy all slash commands.",
      category: "System",
      usage: "deploy",
      permLevel: "Bot Owner",
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars

    // We'll partition the slash commands based on the guildOnly boolean.
    // Separating them into the correct objects defined in the array below.
    const [guildCmds, globalCmds] = this.client.slashcmds.partition(c => c.guildOnly);

    // Give the user a notification the commands are deploying.
    await message.channel.send("Deploying commands!");

    // We'll use set but please keep in mind that `set` is overkill for a singular command.
    // Set the guild commands like this.
    await this.client.guilds.cache.get(message.guild.id)?.commands.set(guildCmds.map(c => c.commandData));

    // Then set the global commands like this.
    await this.client.application?.commands.set(globalCmds.map(c => c.commandData)).catch(e => console.log(e));

    // Reply to the user that the commands have been deployed.
    await message.channel.send("All commands deployed!");
  }
};