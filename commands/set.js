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
const { codeBlock } = require("@discordjs/builders");
const { settings } = require("../modules/settings.js");
const { awaitReply } = require("../modules/functions.js");

exports.run = async (client, message, [action, key, ...value], level) => { // eslint-disable-line no-unused-vars

  // Retrieve current guild settings (merged) and overrides only.
  const serverSettings = message.settings;
  const defaults = settings.get("default");
  const overrides = settings.get(message.guild.id);
  const replying = serverSettings.commandReply;
  if (!settings.has(message.guild.id)) settings.set(message.guild.id, {});
  
  // Edit an existing key value
  if (action === "edit") {
    // User must specify a key.
    if (!key) return message.reply({ content: "Please specify a key to edit", allowedMentions: { repliedUser: (replying === "true") }});
    // User must specify a key that actually exists!
    if (!defaults[key]) return message.reply({ content: "This key does not exist in the settings", allowedMentions: { repliedUser: (replying === "true") }});
    const joinedValue = value.join(" ");
    // User must specify a value to change.
    if (joinedValue.length < 1) return message.reply({ content: "Please specify a new value", allowedMentions: { repliedUser: (replying === "true") }});
    // User must specify a different value than the current one.
    if (joinedValue === serverSettings[key]) return message.reply({ content: "This setting already has that value!", allowedMentions: { repliedUser: (replying === "true") }});
    
    // If the guild does not have any overrides, initialize it.
    if (!settings.has(message.guild.id)) settings.set(message.guild.id, {});

    // Modify the guild overrides directly.
    settings.set(message.guild.id, joinedValue, key);

    // Confirm everything is fine!
    message.reply({ content: `${key} successfully edited to ${joinedValue}`, allowedMentions: { repliedUser: (replying === "true") }});
  } else
  
  // Resets a key to the default value
  if (action === "del" || action === "reset") {
    if (!key) return message.reply({ content: "Please specify a key to reset.", allowedMentions: { repliedUser: (replying === "true") }});
    if (!defaults[key]) return message.reply({ content: "This key does not exist in the settings", allowedMentions: { repliedUser: (replying === "true") }});
    if (!overrides[key]) return message.reply({ content: "This key does not have an override and is already using defaults.", allowedMentions: { repliedUser: (replying === "true") }});
    
    // Good demonstration of the custom awaitReply method in `./modules/functions.js` !
    const response = await awaitReply(message, `Are you sure you want to reset ${key} to the default value?`);

    // If they respond with y or yes, continue.
    if (["y", "yes"].includes(response.toLowerCase())) {
      // We delete the `key` here.
      settings.delete(message.guild.id, key);
      message.reply({ content: `${key} was successfully reset to default.`, allowedMentions: { repliedUser: (replying === "true") }});
    } else
    // If they respond with n or no, we inform them that the action has been cancelled.
    if (["n","no","cancel"].includes(response)) {
      message.reply({ content: `Your setting for \`${key}\` remains at \`${serverSettings[key]}\``, allowedMentions: { repliedUser: (replying === "true") }});
    }
  } else
  
  if (action === "get") {
    if (!key) return message.reply({ content: "Please specify a key to view", allowedMentions: { repliedUser: (replying === "true") }});
    if (!defaults[key]) return message.reply({ content: "This key does not exist in the settings", allowedMentions: { repliedUser: (replying === "true") }});
    const isDefault = !overrides[key] ? "\nThis is the default global default value." : "";
    message.reply({ content: `The value of ${key} is currently ${serverSettings[key]}${isDefault}`, allowedMentions: { repliedUser: (replying === "true") }});
  } else {
    // Otherwise, the default action is to return the whole configuration;
    const array = [];
    Object.entries(serverSettings).forEach(([key, value]) => {
      array.push(`${key}${" ".repeat(20 - key.length)}::  ${value}`); 
    });
    await message.channel.send(codeBlock("asciidoc", `= Current Guild Settings =
${array.join("\n")}`));    
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["setting", "settings", "conf"],
  permLevel: "Administrator"
};

exports.help = {
  name: "set",
  category: "System",
  description: "View or change settings for your server.",
  usage: "set <view/get/edit> <key> <value>"
};
