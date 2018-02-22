// The EVAL command will execute **ANY** arbitrary javascript code given to it.
// THIS IS PERMISSION LEVEL 10 FOR A REASON! It's perm level 10 because eval
// can be used to do **anything** on your machine, from stealing information to
// purging the hard drive. DO NOT LET ANYONE ELSE USE THIS

// However it's, like, super ultra useful for troubleshooting and doing stuff
// you don't want to put in a command.
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const { output, error } = this.tryEval(args.join(" "));
  const cleaned = await client.clean(client, output);
  // sends output as a file if it exceeds the character limit
  // note: if the output is an error, it will have the ERROR heading, hence the extra 7 
  const MAX_CHARS = error ? 3 + 2 + 7 + cleaned.length + 2 + 3 : 3 + 2 + cleaned.length + 2 + 3;
  if (MAX_CHARS > 2000) {
    message.channel.send("Output exceeded 2000 characters. Sending as a file.", { files: [{ attachment: Buffer.from(cleaned), name: "output.txt" }] });
  }
  return message.channel.send(error ? `\`ERROR\` \`\`\`js\n${cleaned}\n\`\`\`` : `\`\`\`js\n${cleaned}\n\`\`\``);
};

// evals code and returns the output
// if it evaluates succesfully, it will return the output and "error" as false
// if it errors, it will return the output as the error and "error" as true
exports.tryEval = code => {
  let output, error;
  try {
    output = eval(code);
    error = false;
  } catch (e) {
    output = e;
    error = true;
  }
  
  return {
    output,
    error,
  };
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
