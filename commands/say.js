exports.run = (client, message, args) => {    
    let text = args.slice(1).join(" ");
    message.delete();
    message.channel.send(text);
};    