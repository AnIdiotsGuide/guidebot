exports.run = (client, message, args, config) => {    
	const adminRole = message.guild.roles.find("name", "Admin");
	const fs = require("fs");
	if(!args || args.size < 1) 
    	return message.reply("Must provide a new prefix to set to.");
    if(!message.member.roles.has(adminRole.id)) 
    	return message.channel.reply("Sorry you need to be admin to use this command.");
    let newPrefix = message.content.split(" ").slice(1, 2)[0];
    config.prefix = newPrefix;
    fs.writeFile("./../config.json", JSON.stringify(config), (err) => console.error);
    message.channel.send("Prefix Changed to " + config.prefix)    
    console.log ("Prefix Changed to " + config.prefix)
 };
