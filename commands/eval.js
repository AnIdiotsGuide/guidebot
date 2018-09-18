// The EVAL command will execute **ANY** arbitrary javascript code given to it.
// THIS IS PERMISSION LEVEL 10 FOR A REASON! It's perm level 10 because eval
// can be used to do **anything** on your machine, from stealing information to
// purging the hard drive. DO NOT LET ANYONE ELSE USE THIS


// However it's, like, super ultra useful for troubleshooting and doing stuff
// you don't want to put in a command.
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const code = args.join(" ");
  try {
    const evaled = eval(code);
    const clean = await client.clean(client, evaled);
    if (clean.length > 1990) {
      if (this.logLongOutput) {
        console.log(evaled);
        return message.channel.send("Execution complete and output to console");
      } else {
        return message.channel.send("Execution complete, output has been trimmed```\n" + clean.substring(0, 1949) + "```");
      }
    }
    message.channel.send("```js\n" + clean + "```");
  } catch (err) {
    if (err.length > 1990) {
      if (this.logLongOutput) {
        console.log(err);
        return message.channel.send("Execution failed and stacktrace logged");
      } else {
        return message.channel.semd("Execution failed, stacktrace has been trimmed```\n" + err.substring(0, 1947) + "```");
      }
    }
    message.channel.semd("```xl\n" + await client.clean(client, err) + "```");
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Owner",
  logLongOutput: false
};

exports.help = {
  name: "eval",
  category: "System",
  description: "Evaluates arbitrary javascript.",
  usage: "eval [...code]"
};
