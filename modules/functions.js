module.exports = (client) => {
  
  /* 
  PERMISSION LEVEL FUNCTION
  
  This is a very basic permission system for commands which uses "levels"
  "spaces" are intentionally left black so you can add them if you want.
  NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
  command including the VERY DANGEROUS `eval` and `exec` commands!
  
  */
  client.permlevel = message => {
    let permlvl = 0;
    
    // If bot owner, return max perm level
    if(message.author.id === client.config.ownerid) return 10;
    
    // If DMs or webhook, return 0 perm level.
    if(!message.guild || !message.member) return 0;
    
    // The rest of the perms rely on roles. If those roles are not found
    // in the config, or the user does not have it, their level will be 0
    try {
      let mod_role = message.guild.roles.find('name', client.config.modrolename);
      if (mod_role && message.member.roles.has(mod_role.id)) permlvl = 2;
      let admin_role = message.guild.roles.find('name', client.config.adminrolename);
      if (admin_role && message.member.roles.has(admin_role.id)) permlvl = 3;
    } catch (e) {
      // Mod names were not configured.
      permlvl = 0;
    }
    // Guild Owner gets an extra level, wooh!
    if(message.author.id === message.guild.owner.id) permlvl = 4;
    
    return permlvl;
  };
  
  
  /* 
  LOGGING FUNCTION
  
  Logs to console. Future patches may include time+colors
  */
  client.log = (type, msg, title) => {
    if(!title) title = "Log";
    console.log(`[${type}] [${title}]${msg}`);
  };
  
  
  /* 
  SINGLE-LINE AWAITMESSAGE
  
  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get "precisions" on certain things...
  
  USAGE
  
  const response = await client.awaitReply(msg, "Favourite Color?");
  msg.reply(`Oh, I really love ${response} too!`);
  
  */
  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m=>m.author.id = msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] });
      return collected.first().content;
    } catch(e) {
      return false;
    }
  };
  
  
  /* 
  MESSAGE CLEAN FUNCTION
  
  "Clean" removes @everyone pings, as well as tokens, and makes code blocks
  escaped so they're shown more easily. As a bonus it resolves promises
  and stringifies objects!
  This is mostly only used by the Eval and Exec commands.
  */
  client.clean = async (client, text) => {
    if (text && text.constructor.name == 'Promise')
      text = await text;
    if (typeof evaled !== 'string')
      text = require('util').inspect(text, {depth: 0});
    
    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");
    
    return text;
  };


  /* MISCELANEOUS NON-CRITICAL FUNCTIONS */
  
  
  // `await wait(1000);` to "pause" for 1 second. 
  global.wait = require('util').promisify(setTimeout);


  // Another semi-useful utility command, which creates a "range" of numbers
  // in an array. `range(10).forEach()` loops 10 times for instance. Why?
  // Because honestly for...i loops are ugly.
  global.range = (count, start = 0) => {
    const myArr = [];
    for(var i = 0; i<count; i++) {
      myArr[i] = i+start;
    }
    return myArr;
  };
  
  // These 2 simply handle unhandled things. Like Magic. /shrug
  process.on('uncaughtException', (err) => {
    let errorMsg = err.stack.replace(new RegExp(`${__dirname}\/`, 'g'), './');
    console.error("Uncaught Exception: ", errorMsg);
  });
  
  process.on("unhandledRejection", err => {
    console.error("Uncaught Promise Error: ", err);
  });
};