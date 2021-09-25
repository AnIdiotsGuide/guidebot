// This will check if the node version you are running is the required
// Node version, if it isn't it will throw the following error to inform
// you.
if (Number(process.version.slice(1).split(".")[0]) < 16) throw new Error("Node 16.x or higher is required. Update Node on your system.");
require("dotenv").config();
// Load up the discord.js library, but only require the things we need.
const { Client, Collection } = require("discord.js");
// We also load the rest of the things we need in this file:
const { readdirSync } = require("fs");
// Grab hold of the intents, partials and permLevels from the config file.
const { intents, partials, permLevels } = require("./config.js");
// Add the logger.
const logger = require("./util/logger.js");
// Create an empty object for later.
const levelCache = {};

class GuideBot extends Client {
  constructor(options) {
    super(options);

    // To reduce client pollution we'll create a single container property
    // that we can attach everything we need to.
    this.container = {
      // This is our commands collection.
      commands: new Collection(),
      // Aliases
      aliases: new Collection(),
      // Slash Commands
      slashcmds: new Collection(),
      // And to make the levelCache available everywhere, pin it here.
      levelCache
    };
  }
}

for (let i = 0; i < permLevels.length; i++) {
  const thisLevel = permLevels[i];
  levelCache[thisLevel.name] = thisLevel.level;
}


// Default Intents the bot needs.
// By default GuideBot needs Guilds, Guild Messages and Direct Messages to work.
// For join messages to work you need Guild Members, which is privileged and requires extra setup.
// For more info about intents see the README.

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`,
// or `bot.something`, this is what we're referring to. Your client.
const client = new GuideBot({ intents, partials });

// We're doing real fancy node 8 async/await stuff here, and to do that
// we need to wrap stuff in an anonymous function. It's annoying but it works.
const init = async () => {
  // Here we load **commands** into memory, as a collection, so they're accessible
  // here and everywhere else.
  const commands = readdirSync("./commands/").filter(file => file.endsWith(".js"));
  // A nice little loop.
  for (const file of commands) {
    // Require the file into memory.
    const props = new (require(`./commands/${file}`))(client);
    // Add the details into the commands collection.
    client.container.commands.set(props.help.name, props);
    // Loop and add every alias into the aliases collection.
    props.conf.aliases.forEach(alias => {
      client.container.aliases.set(alias, props.help.name);
    });
    // Output to the console.
    logger.log(`Loading Command: ${props.help.name}. 👌`, "log");
  }

  // Repeat the above but for slash commands!
  const slashFiles = readdirSync("./slash").filter(file => file.endsWith(".js"));
  for (const file of slashFiles) {
    const command = new (require(`./slash/${file}`))(client);
    const commandName = file.split(".")[0];
    // Now set the name of the command with it's properties.
    client.container.slashcmds.set(command.commandData.name, command);
    logger.log(`Loading Slash command: ${commandName}. 👌`, "log");
  }

  // Aaaaaand repeat it a third time for events!
  const eventFiles = readdirSync("./events/").filter(file => file.endsWith(".js"));
  for (const file of eventFiles) {
    const eventName = file.split(".")[0];
    const event = new (require(`./events/${file}`))(client);
    // This line is awesome by the way. Just sayin'.
    client.on(eventName, (...args) => event.run(...args));
    delete require.cache[require.resolve(`./events/${file}`)];
    logger.log(`Loading Event: ${eventName}. 👌`, "log");
  }

  // Here we login the client.
  client.login();
  // End top-level async/await function.
};

init();

client.on("disconnect", () => logger.warn("Bot is disconnecting..."))
  .on("reconnecting", () => logger.log("Bot reconnecting...", "log"))
  .on("error", e => logger.error(e))
  .on("warn", info => logger.warn(info));

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
