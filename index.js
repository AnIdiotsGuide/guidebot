// This will check if the node version you are running is the required
// Node version, if it isn't it will throw the following error to inform
// you.
if (Number(process.version.slice(1).split(".")[0]) < 16) throw new Error("Node 16.x or higher is required. Update Node on your system.");

// Load up the discord.js library
const { Client, Collection } = require("discord.js");
// We also load the rest of the things we need in this file:
const { readdirSync } = require("fs");
const config = require("./config.js");
const Enmap = require("enmap");
const path = require("path");

// Let's create an array for some promises we'll want to resolve later.
const promises = [];

class GuideBot extends Client {
  constructor(options) {
    super(options);
    
    // Here we load the config.js file that contains our token and our prefix values.
    this.config = config;
    // client.config.token contains the bot's token
    // client.config.prefix contains the message prefix

    // Aliases, commands and slash commands are put in collections where they can be read from,
    // catalogued, listed, etc.
    this.commands = new Collection();
    this.aliases = new Collection();
    this.slashcmds = new Collection();
    this.events = new Collection();

    this.owners = new Array();

    // Now we integrate the use of Evie's awesome Enhanced Map module, which
    // essentially saves a collection to disk. This is great for per-server configs,
    // and makes things extremely easy for this purpose.
    this.settings = new Enmap({ name: "settings" });

    //requiring the Logger class for easy console logging
    this.logger = require("./util/logger.js");

    // Basically just an async shortcut to using a setTimeout. Nothing fancy!
    this.wait = require("util").promisify(setTimeout);
  }

  /*
  PERMISSION LEVEL FUNCTION

  This is a very basic permission system for commands which uses "levels"
  "spaces" are intentionally left black so you can add them if you want.
  NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
  command including the VERY DANGEROUS `eval` command!

  */
  permlevel(message) {
    let permlvl = 0;

    const permOrder = this.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

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

  /* 
  COMMAND LOAD AND UNLOAD
  
  To simplify the loading and unloading of commands from multiple locations
  including the index.js load loop, and the reload function, these 2 ensure
  that unloading happens in a consistent manner across the board.
  */

  async loadModule(type, modulePath, moduleName) {
    try {
      switch (type) {
        case "command": {
          const props = new (require(modulePath))(this);
          props.conf.location = modulePath;
          if (props.init) {
            props.init(this);
          }
      
          this.commands.set(props.help.name, props);
          props.conf.aliases.forEach(alias => {
            this.aliases.set(alias, props.help.name);
          });
          return false;
        }
  
        case "slash": {
          const props = new (require(modulePath))(this);
          this.logger.log(`Loading slash command: ${moduleName}. 👌`, "log");
          props.conf.location = modulePath;
          client.slashcmds.set(props.commandData.name, props);
          break;
        }
  
        case "event": {
          client.logger.log(`Loading event: ${moduleName}. 👌`, "log");
          const event = new(require(modulePath))(this);
          client.events.set(event.conf.name, event);
  
          // This line is awesome by the way. Just sayin'.
          client.on(moduleName, (...args) => event.run(...args));
          delete require.cache[require.resolve(modulePath)];
        }
      }
    } catch (e) {
      return `Unable to load ${type} ${moduleName}: ${e}`
    }
  }

  async unloadModule(type, commandPath, commandName) {
    switch (type) {
      case "command": {
        let command;
        if (this.commands.has(commandName)) {
          command = this.commands.get(commandName);
        } else if (this.aliases.has(commandName)) {
          command = this.commands.get(this.aliases.get(commandName));
        }
        if (!command) return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`;

        if (command.shutdown) {
          await command.shutdown(this);
        }
        delete require.cache[require.resolve(commandPath)];
        return false;
      }

      case "slash": {
        let command;
        if (this.slashcmds.has(commandName)) command = this.slashcmds.get(commandName);
        if (!command) return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`;
        delete require.cache[require.resolve(`${commandPath}${path.sep}${commandName}.js`)];
        return false;
      }
    }
  }

  async reloadEvent(client, eventName) {
    client.removeAllListeners(eventName);
    delete require.cache[require.resolve(`./events/${eventName}.js`)];
    const event = new(require(`./events/${eventName}.js`))(client);
    client.on(eventName, (...args) => event.run(...args));
    delete require.cache[require.resolve(`./events/${eventName}.js`)];
  }

  /*
  MESSAGE CLEAN FUNCTION
  "Clean" removes @everyone pings, as well as tokens, and makes code blocks
  escaped so they're shown more easily. As a bonus it resolves promises
  and stringifies objects!
  This is mostly only used by the Eval and Exec commands.
  */
  async clean(text) {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof text !== "string")
      text = require("util").inspect(text, { depth: 1 });

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));

    text = this.replaceAll(text, config.token, "[REDACTED]");

    return text;
  }

  /**
  This function will take an input string, split it
  at the needle, and replace it with the supplied string.
  */

  replaceAll(haystack, needle, replacement) {
    return haystack.split(needle).join(replacement);
  }

  /* SETTINGS FUNCTIONS
  These functions are used by any and all location in the bot that wants to either
  read the current *complete* guild settings (default + overrides, merged) or that
  wants to change settings for a specific guild.
  */

  // getSettings merges the client defaults with the guild settings. guild settings in
  // enmap should only have *unique* overrides that are different from defaults.
  getSettings(guild) {
    const defaults = this.settings.get("default") || {};
    const guildData = guild ? this.settings.get(guild.id) || {} : {};
    const returnObject = {};
    Object.keys(defaults).forEach((key) => {
      returnObject[key] = guildData[key] ? guildData[key] : defaults[key];
    });
    return returnObject;
  }

  // writeSettings overrides, or adds, any configuration item that is different
  // than the defaults. This ensures less storage wasted and to detect overrides.
  writeSettings(id, newSettings) {
    const defaults = this.settings.get("default");
    let settings = this.settings.get(id);
    if (typeof settings != "object") settings = {};
    for (const key in newSettings) {
      if (defaults[key] !== newSettings[key]) {
        settings[key] = newSettings[key];
      } else {
        delete settings[key];
      }
    }
    this.settings.set(id, settings);
  }

  /*
  SINGLE-LINE AWAIT MESSAGE
  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get "precisions" on certain things...
  USAGE
  const response = await client.awaitReply(msg, "Favourite Color?");
  msg.reply(`Oh, I really love ${response} too!`);
  */
  async awaitReply(msg, question, limit = 60000) {
    const filter = m => m.author.id === msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages({ filter, max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  }
}

// Default Intents the bot needs.
// By default GuideBot needs Guilds, Guild Messages and Direct Messages to work.
// For join messages to work you need Guild Members, which is privileged and requires extra setup.
// For more info about intents see the README.

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`,
// or `bot.something`, this is what we're referring to. Your client.
const client = new GuideBot({ intents: config.intents, partials: config.partials });

// We're doing real fancy node 8 async/await stuff here, and to do that
// we need to wrap stuff in an anonymous function. It's annoying but it works.

const init = async () => {
  async function getEvents(dir) {
    for (const dirent of readdirSync(dir, { withFileTypes: true })) {
      const loc = path.resolve(dir, dirent.name);

      if (dirent.isFile()) {
        const eventName = dirent.name.split(".")[0];
        client.loadModule("event", loc, eventName);
      } else if (dirent.isDirectory()) {
        promises.push(getEvents(loc));
      }
    }
  }

  // Let's load the slash commands, we're using a recursive method so you can have
  // folders within folders, within folders, within folders, etc and so on.
  async function getSlashCommands(dir) {
    for (const dirent of readdirSync(dir, { withFileTypes: true })) {
      const loc = path.resolve(dir, dirent.name);
    
      if (dirent.isFile()) {
        const commandName = dirent.name.split(".")[0];
        client.loadModule("slash", loc, commandName);
      } else if (dirent.isDirectory()) {
        promises.push(getSlashCommands(loc));
      }
    }
  }

  // Here we load **commands** into memory, as a collection, so they're accessible
  // here and everywhere else, and like the slash commands, sub-folders for days!
  async function getCommands(dir) {
    for (const dirent of readdirSync(dir, { withFileTypes: true })) {
      const loc = path.resolve(dir, dirent.name);
    
      if (dirent.isFile()) {
        const commandName = dirent.name.split(".")[0];
        client.logger.log(`Loading command: ${commandName}. 👌`, "log");
        client.loadModule("command", loc, commandName);
      } else if (dirent.isDirectory()) {
        promises.push(getCommands(loc));
      }
    }
  }

  // Now let's call the functions to actually load up the commands!
  await getEvents("./events");
  await getCommands("./commands");
  await getSlashCommands("./slash");

  // Now let's resolve those promises, loading all the commands at once.
  await Promise.all(promises);

  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  // Here we login the client.
  client.login(client.config.token);

  // End top-level async/await function.
};

init();

client.on("disconnect", () => client.logger.warn("Bot is disconnecting..."))
  .on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
  .on("error", e => client.logger.error(e))
  .on("warn", info => client.logger.warn(info));

/* MISCELLANEOUS NON-CRITICAL FUNCTIONS */

// EXTENDING NATIVE TYPES IS BAD PRACTICE. Why? Because if JavaScript adds this
// later, this conflicts with native code. Also, if some other lib you use does
// this, a conflict also occurs. KNOWING THIS however, the following methods
// are, we feel, very useful in code. So let's just Carpe Diem.

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

// These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
process.on("uncaughtException", (err) => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  console.error("Uncaught Exception: ", errorMsg);
  // Always best practice to let the code crash on uncaught exceptions. 
  // Because you should be catching them anyway.
  process.exit(1);
});

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: ", err);
});
