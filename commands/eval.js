// The EVAL command will execute **ANY** arbitrary javascript code given to it.
// THIS IS PERMISSION LEVEL 10 FOR A REASON! It's perm level 10 because eval
// can be used to do **anything** on your machine, from stealing information to
// purging the hard drive. DO NOT LET ANYONE ELSE USE THIS

// However it's, like, super ultra useful for troubleshooting and doing stuff
// you don't want to put in a command.

const { inspect } = require("util");
const { post } = require("snekfetch");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const code = args.join(" ");
  const token = client.token.split("").join("[^]{0,2}");
  const rev = client.token.split("").reverse().join("[^]{0,2}");
  const filter = new RegExp(`${token}|${rev}`, "g");
  try {
    let output = eval(code);
    if (output instanceof Promise || (Boolean(output) && typeof output.then === "function" && typeof output.catch === "function")) output = await output;
    output = inspect(output, { depth: 0, maxArrayLength: null });
    output = output.replace(filter, "[TOKEN]");
    output = clean(output);
    if (output.length < 1950) {
      message.channel.send(`\`\`\`js\n${output}\n\`\`\``);
    } else {
      try {
        const { body } = await post("https://www.hastebin.com/documents").send(output);
        message.channel.send(`Output was to long so it was uploaded to hastebin https://www.hastebin.com/${body.key}.js `);
      } catch (error) {
        message.channel.send(`I tried to upload the output to hastebin but encountered this error ${error.name}:${error.message}`);
      }
    }
  } catch (error) {
    message.channel.send(`The following error occured \`\`\`js\n${error.stack}\`\`\``);
  }

  function clean(text)  {
    return text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "eval",
  category: "System",
  description: "Evaluates arbitrary javascript.",
  usage: "eval [...code]"
};
