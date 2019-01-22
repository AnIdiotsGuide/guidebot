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
exports.run = async (client, message, [action, key, ...value], level) => { // eslint-disable-line no-unused-vars

  // Retrieve current guild settings (merged) and overrides only.
  const settings = message.settings;
  const defaults = client.config.defaultSettings;
  const overrides = client.settings.get(message.guild.id);
  if (!client.settings.has(message.guild.id)) client.settings.set(message.guild.id, {});
  
  // Edit an existing key value
  if (action === "edit") {
    // User must specify a key.
    if (!key) return message.reply("Por favor especifica uma chave para setar.");
    // User must specify a key that actually exists!
    if (!defaults[key]) return message.reply("Esta chave não existe nas definições!");
    const joinedValue = value.join(" ");
    // User must specify a value to change.
    if (joinedValue.length < 1) return message.reply("Por favor especifica um novo valor para esta chave.");
    // User must specify a different value than the current one.
    if (joinedValue === settings[key]) return message.reply("Esta definição já tem esse valor!");
    
    // If the guild does not have any overrides, initialize it.
    if (!client.settings.has(message.guild.id)) client.settings.set(message.guild.id, {});

    // Modify the guild overrides directly.
    client.settings.set(message.guild.id, joinedValue, key);

    // Confirm everything is fine!
    message.reply(`${key} editado com sucesso para ${joinedValue}`);
  } else
  
  // Resets a key to the default value
  if (action === "del" || action === "reset") {
    if (!key) return message.reply("Por favor especifica uma chave para resetar.");
    if (!defaults[key]) return message.reply("Esta chave não existe nas definições!");
    if (!overrides[key]) return message.reply("Esta chave não tem um override ou já está no modo standart.");
    
    // Good demonstration of the custom awaitReply method in `./modules/functions.js` !
    const response = await client.awaitReply(message, `Tens a certeza de que quer resetar ${key} para o valor original?`);

    // If they respond with y or yes, continue.
    if (["s", "sim"].includes(response.toLowerCase())) {
      // We delete the `key` here.
      client.settings.delete(message.guild.id, key);
      message.reply(`${key} foi resetada para o modo standart com sucesso!`);
    } else
    // If they respond with n or no, we inform them that the action has been cancelled.
    if (["n","não","cancelar"].includes(response)) {
      message.reply(`A definição para \`${key}\` permanece em \`${settings[key]}\``);
    }
  } else
  
  if (action === "get") {
    if (!key) return message.reply("Por favor especifica uma chave para a ver.");
    if (!defaults[key]) return message.reply("Esta chave não existe nas definições!");
    const isDefault = !overrides[key] ? "\nEste é o valor original global desta definição." : "";
    message.reply(`O valor de ${key} é ${settings[key]}${isDefault}`);
  } else {
    // Otherwise, the default action is to return the whole configuration;
    const array = [];
    Object.entries(settings).forEach(([key, value]) => {
      array.push(`${key}${" ".repeat(20 - key.length)}::  ${value}`); 
    });
    await message.channel.send(`= Definições atuais deste servidor: =\n${array.join("\n")}`, {code: "asciidoc"});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["setting", "settings", "conf"],
  permLevel: "MASTER"
};

exports.help = {
  name: "set",
  category: "Sistema",
  description: "Ver ou modificar as definições deste server..",
  usage: "set <view/get/edit> <key> <value>"
};
