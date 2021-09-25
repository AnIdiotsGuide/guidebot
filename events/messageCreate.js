// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

const { getSettings } = require("../util/settings.js");
const { permLevels } = require("../config.js");
const { permLevel } = require("../util/functions.js");
const logger = require("../util/logger.js");
module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {

    // It's good practice to ignore other bots. This also makes your bot ignore itself
    //  and not get into a spam loop (we call that "botception").
    if (message.author.bot) return;

    // Grab the settings for this server from the Enmap
    // If there is no guild, get default conf (DMs)
    const settings = message.settings = getSettings(message.guild);

    // Checks if the bot was mentioned via regex, with no message after it,
    // returns the prefix. The reason why we used regex here instead of
    // message.mentions is because of the mention prefix later on in the
    // code, would render it useless.
    const prefixMention = new RegExp(`^<@!?${this.client.user.id}> ?$`);
    if (message.content.match(prefixMention)) {
      return message.reply(`My prefix on this guild is \`${settings.prefix}\``);
    }

    // It's also good practice to ignore any and all messages that do not start
    // with our prefix, or a bot mention.
    const prefix = new RegExp(`^<@!?${this.client.user.id}> |^\\${settings.prefix}`).exec(message.content);
    // This will return and stop the code from continuing if it's missing
    // our prefix (be it mention or from the settings).
    if (!prefix) return;
    
    // Here we separate our "command" name, and our "arguments" for the command.
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(prefix[0].length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // If the member on a guild is invisible or not cached, fetch them.
    if (message.guild && !message.member) await message.guild.members.fetch(message.author);

    // Get the user or member's permission level from the elevation
    const level = permLevel(message);
    // Check whether the command, or alias, exist in the collections defined
    // in app.js.
    const cmd = this.client.container.commands.get(command) || this.client.container.commands.get(this.client.container.aliases.get(command));
    // using this const varName = thing OR otherThing; is a pretty efficient
    // and clean way to grab one of 2 values!
    if (!cmd) return;

    // Some commands may not be useable in DMs. This check prevents those commands from running
    // and return a friendly error message.
    if (cmd && !message.guild && cmd.conf.guildOnly)
      return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

    // Do a quick little check to see if the command is actually enabled, if it isn't stop.
    if (!cmd.conf.enabled) return;

    if (level < this.client.container.levelCache[cmd.conf.permLevel]) {
      if (settings.systemNotice === "true") {
        return message.channel.send(`You do not have permission to use this command.
Your permission level is ${level} (${permLevels.find(l => l.level === level).name})
This command requires level ${this.client.container.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
      } else {
        return;
      }
    }
      
    // To simplify message arguments, the author's level is now put on level (not member, so it is supported in DMs)
    // The "level" command module argument will be deprecated in the future.
    message.author.permLevel = level;

    message.flags = [];
    while (args[0] &&args[0][0] === "-") {
      message.flags.push(args.shift().slice(1));
    }
    
    // If the command exists, **AND** the user has permission, run it.
    try {
      await cmd.run(message, args, level);
      logger.log(`${permLevels.find(l => l.level === level).name} ${message.author.id} ran command ${cmd.help.name}`, "cmd");
    } catch (e) {
      console.log(e);
      message.channel.send({ content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\`` })
        .catch(e => console.error("An error occurred replying on an error", e));
    }
  }
};