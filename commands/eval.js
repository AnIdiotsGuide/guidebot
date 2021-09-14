// The EVAL command will execute **ANY** arbitrary javascript code given to it.
// THIS IS PERMISSION LEVEL 10 FOR A REASON! It's perm level 10 because eval
// can be used to do **anything** on your machine, from stealing information to
// purging the hard drive. DO NOT LET ANYONE ELSE USE THIS

const { codeBlock } = require("@discordjs/builders");

// However it's, like, super ultra useful for troubleshooting and doing stuff
// you don't want to put in a command.
const Command = require("../base/Command.js");

module.exports = class Eval extends Command {
  constructor(client) {
    super(client, {
      name: "eval",
      description: "Evaluates arbitrary Javascript.",
      category:"Owner",
      usage: "eval <expression>",
      aliases: ["ev"],
      permLevel: "Bot Owner"
    });
  }

  /*
  MESSAGE CLEAN FUNCTION
  "Clean" removes @everyone pings, as well as tokens, and makes code blocks
  escaped so they're shown more easily. As a bonus it resolves promises
  and stringifies objects!
  This is mostly only used by the Eval and Exec commands.
  */
  async clean(client, text) {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof text !== "string")
      text = require("util").inspect(text, { depth: 1 });

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));

    text.replaceAll(client.token, "[REDACTED]");
    return text;
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const code = args.join(" ");
    try {
      const evaled = eval(code);
      const clean = await this.clean(this.client, evaled);
      // sends evaled output as a file if it exceeds the maximum character limit
      // 6 graves, and 2 characters for "js"
      const MAX_CHARS = 3 + 2 + clean.length + 3;
      if (MAX_CHARS > 4000) {
        message.channel.send("Output exceeded 4000 characters. Sending as a file.", { files: [{ attachment: Buffer.from(clean), name: "output.txt" }] });
      }
      message.channel.send(codeBlock("js", clean));
    } catch (err) {
      console.log(err);
    }
  }

};