const { permLevels } = require("../config.js");
/**
 * PERMISSION LEVEL FUNCTION
 * This is a very basic permission system for commands which uses "levels"
 * "spaces" are intentionally left blank so you can add them if you want.
 * NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
 * command including the VERY DANGEROUS `eval` command!
 */
function permLevel(message) {
  let permlvl = 0;

  const permOrder = permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

  while (permOrder.length) {
    const currentLevel = permOrder.shift();
    if (message.guild && currentLevel.guildOnly) continue;
    if (currentLevel.check(message)) {
      permlvl = currentLevel.level;
      break;
    }
  }
  return permlvl;
}

/**
 * SINGLE-LINE AWAIT MESSAGE
 * A simple way to grab a single reply, from the user that initiated
 * the command. Useful to get "precisions" on certain things...
 * USAGE
 * const response = await client.awaitReply(msg, "Favourite Color?");
 * msg.reply(`Oh, I really love ${response} too!`);
 */
async function awaitReply(msg, question, limit = 60000) {
  const filter = m => m.author.id === msg.author.id;
  await msg.channel.send(question);
  try {
    const collected = await msg.channel.awaitMessages({ filter, max: 1, time: limit, errors: ["time"] });
    return collected.first().content;
  } catch (e) {
    return false;
  }
}

/**
 * MISCELLANEOUS NON-CRITICAL FUNCTIONS
 * EXTENDING NATIVE TYPES IS BAD PRACTICE. Why? Because if JavaScript adds this
 * later, this conflicts with native code. Also, if some other lib you use does
 * this, a conflict also occurs. KNOWING THIS however, the following methods
 * are, we feel, very useful in code. So let's just Carpe Diem.
 */

// <String>.toProperCase() returns a proper-cased string such as: 
// "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
String.prototype.toProperCase = function() {
  return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
// <Array>.random() returns a single random element from an array
// [1, 2, 3, 4, 5].random() can return 1, 2, 3, 4 or 5.
Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
};

module.exports = { permLevel, awaitReply };
