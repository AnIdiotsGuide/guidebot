const Enmap = require("enmap");
let tags;

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (message.flags.length < 1) {
    const name = args[0];
    if (tags.has(name)) {
      const tag = tags.get(name);
      await message.channel.send(tag);
      return;
    }
  }

  const [name, ...content] = args;
  let answer;
  switch (message.flags[0]) {
    case "list":
      answer = [`**\`List of Available Tags\`**\n\`\`\`${tags.keyArray().map(key => `+${key}`).join(" ")}\`\`\``, null];
      break;
    case "add":
      if (tags.has(name)) return message.channel.send("That tag already exists");
      if (["eval", "tag", "list"].includes(name)) return message.reply("Cannot use reserved tag names.");
      tags.set(name, content.join(" "));
      answer = [null, "☑"];
      break;
    case "del":
      if (tags.has(name)) {
        tags.delete(name);
        answer = [null, "☑"];
      } else {
        answer = ["Tag name not found", null];
      }
      break;
    case "edit":
      if (tags.has(name)) {
        tags.set(name, content.join(" "));
        answer = [null, "☑"];
      } else {
        answer = ["Tag name not found", null];
      }
      break;
    case "rename":
      if (tags.has(name)) {
        const newName = content[0];
        const oldTag = tags.get(name);
        tags.set(newName, oldTag);
        tags.delete(name);
        answer = [null, "☑"];
      } else {
        answer = ["Tag name not found", null];
      }
      break;
    default:
      answer = [null, "⁉"];
  }
  if (answer[0]) message.channel.send(answer[0]);
  if (answer[1]) message.react(answer[1]);

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.init = async () => {
  tags = new Enmap({ name: "tags", persistent: true });
};

exports.shutdown = async () => {
  await tags.close();
};

exports.help = {
  name: "test",
  category: "Miscelaneous",
  description: "Testing testing 1 2 1 2. If you see this in a repo, I dun fucked up.",
  usage: "test"
};
