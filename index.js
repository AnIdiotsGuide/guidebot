// Load up the discord.js library
const Discord = require("discord.js");
// We also load the rest of the things we need in this file:
const { promisify } = require('util');
const readdir = promisify(require("fs").readdir);

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, 
// or `bot.something`, this is what we're refering to. Your client.
const client = new Discord.Client();


// Here we load the config.json file that contains our token and our prefix values. 
client.config = require("./config.json");
// client.config.token contains the bot's token
// client.config.prefix contains the message prefix

// Here we login the client. Yes, this line can be at the start of the bot, 
// because... everything else is async so it's fine!
client.login(client.config.token);

// Let's start by getting some useful functions that we'll use throughout
// the bot, like logs and elevation features.
require("./modules/functions.js")(client);

// Here we load **commands** into memory, as a collection, so they're accessible
// here and everywhere else. 
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

readdir('./commands/').then(files => {
  client.log("log", `Loading a total of ${files.length} commands.`);
  files.forEach(f => {
    try {
      let props = require(`./commands/${f}`);
      client.log("log", `Loading Command: ${props.help.name}. 👌`);
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
    } catch (e) {
      client.log(`Unable to load command ${f}: ${e}`);
    }
  });
}).catch(console.error);

// Then we load events, which will include our message and ready event.
readdir('./events/').then(files => {
  client.log("log", `Loading a total of ${files.length} events.`);
  files.forEach(file => {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    // This line is awesome by the way. Just sayin'.
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
}).catch(console.error);

// Yep. That's it for the main file. Everything else is done in sub files!