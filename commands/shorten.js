const shorten = require('isgd');

exports.run = (client, message, args, tools) => {
  message.channel.startTyping();
  // The command will take one require argument, and one optional (link, title)

  // We also want to check if they typed anything at all, if not run this
  if (!args[0]) return message.channel.send('**Proper Usage: !shorten <URL> [title]**')

  // First, we need to check if they entered an optional title
  if (!args[1]) { // If the second argument in the message is undefined, run this

    shorten.shorten(args[0], function(res) { // This will run the shorten function and pass it 'res'
      if (res.startsWith('Error:')) return message.channel.send('**Please enter a valid URL**'); // The only possible error here would be that it's not a valid URL.

      message.channel.send(`**<${res}>**`); // If no error encountered, it will return with the response in the res variable

    })

  } else { // If the second argument IS defined, run this

    shorten.custom(args[0], args[1], function(res) { // This is sort of the same thing from earlier, although this will pass the first and second arguments to the shortener, then return 'res'

      // There are a few possible error messages, so we can just tell them what the shortener says
      if (res.startsWith('Error:')) return message.channel.send(`**${res}**`); // This will return the full error message
      // Make sure you return, so it doesn't run the rest of the code

      message.channel.send(`**<${res}>**`); // If no errors encountered, it will return the link.
      message.channel.stopTyping(true);


    }) // We also can use <> to make sure it doesn't show an embed, now let's test it!

  }

}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "shorten",
  category: "Miscelaneous",
  description: "link shortener",
  usage: "shorten 1f1.xyz/shortenme"
};
