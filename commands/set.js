// This command is to modify/edit guild configuration. Perm Level 3 for admins
// and owners only. Used for changing prefixes and role names and such.

// Note that there's no "checks" in this basic version - no config "types" like
// Role, String, Int, etc... It's basic, to be extended with your deft hands!

// Note the **destructuring** here. instead of `args` we have :
// [action, key, ...value]
// This gives us the equivalent of either:
// const action = args[0]; const key = args[1]; const value = args.slice(2);
// OR the same as:
// const [action, key, ...value] = args;
const Command = require("../base/Command.js");
const { codeBlock } = require("@discordjs/builders");
const { settings } = require("../util/settings.js");
const { awaitReply } = require("../util/functions.js");

module.exports = class SetCMD extends Command {
  constructor(client) {
    super(client, {
      name: "set",
      description: "View or change settings for your server.",
      category: "System",
      usage: "set <view/get/edit> <key> <value>",
      guildOnly: true,
      aliases: ["setting", "settings"],
      permLevel: "Administrator"
    });
  }

  async run(message, [action, key, ...value], level) { // eslint-disable-line no-unused-vars

    // First we need to retrieve current guild settings
    const defaults = settings.get("default");
    const guildSettings = settings.get(message.guild.id);
    const replying = guildSettings.commandReply;
    if (!settings.has(message.guild.id)) settings.set(message.guild.id, {});
  
    // Secondly, if a user does `-set edit <key> <new value>`, let's change it
    if (action === "edit") {
      // User must specify a key.
      if (!key) return message.reply({ content: "Please specify a key to edit", allowedMentions: { repliedUser: (replying === "true") } });
      // User must specify a key that actually exists!
      if (!defaults[key]) return message.reply({ content: "This key does not exist in the settings", allowedMentions: { repliedUser: (replying === "true") } });
      // User must specify a value to change.
      const joinedValue = value.join(" ");
      if (joinedValue.length < 1) return message.reply({ content: "Please specify a new value", allowedMentions: { repliedUser: (replying === "true") } });
      // User must specify a different value than the current one.
      if (joinedValue === guildSettings[key]) return message.reply({ content: "This setting already has that value!", allowedMentions: { repliedUser: (replying === "true") } });

      // If the guild does not have any overrides, initialize it.
      if (!settings.has(message.guild.id)) settings.set(message.guild.id, {});

      // Modify the guild overrides directly.
      settings.set(message.guild.id, joinedValue, key);
      message.reply({ content: `${key} successfully edited to ${joinedValue}`, allowedMentions: { repliedUser: (replying === "true") } });
    } else
  
    // If a user does `-set del <key>`, let's ask the user if they're sure...
    if (action === "del" || action === "reset") {
      if (!key) return message.reply({ content: "Please specify a key to reset.", allowedMentions: { repliedUser: (replying === "true") } });
      if (!defaults[key]) return message.reply({ content: "This key does not exist in the settings", allowedMentions: { repliedUser: (replying === "true") } });
      if (!guildSettings[key]) return message.reply({ content: "This key does not have an override and is already using defaults.", allowedMentions: { repliedUser: (replying === "true") } });

      // Throw the 'are you sure?' text at them.
      const response = await awaitReply(message, `Are you sure you want to reset \`${key}\` to the default \`${defaults[key]}\`?`);

      // If they respond with y or yes, continue.
      if (["y", "yes"].includes(response)) {

        // We reset the `key` here.
        settings.delete(message.guild.id, key);
        message.reply({ content: `${key} was successfully reset to default.`, allowedMentions: { repliedUser: (replying === "true") } });
      } else

      // If they respond with n or no, we inform them that the action has been cancelled.
      if (["n","no","cancel"].includes(response)) {
        message.reply({ content: `Your setting for \`${key}\` remains as \`${guildSettings[key]}\``, allowedMentions: { repliedUser: (replying === "true") } });
      }
    } else
  
    // Using `-set get <key>` we simply return the current value for the guild.
    if (action === "get") {
      if (!key) return message.reply({ content: "Please specify a key to view", allowedMentions: { repliedUser: (replying === "true") } });
      if (!defaults[key]) return message.reply({ content: "This key does not exist in the settings", allowedMentions: { repliedUser: (replying === "true") } });
      const isDefault = !guildSettings[key] ? "\nThis is the default global default value." : "";
      message.reply({ content: `The value of ${key} is currently ${guildSettings[key]}${isDefault}`, allowedMentions: { repliedUser: (replying === "true") } });
      
    } else {
      // Otherwise, the default action is to return the whole configuration;
      const array = Object.entries(guildSettings).map(([key, value]) => `${key}${" ".repeat(20 - key.length)}::  ${value}`);
      await message.channel.send(codeBlock("asciidoc", `= Current Guild Settings =
${array.join("\n")}`));    }
  }
};