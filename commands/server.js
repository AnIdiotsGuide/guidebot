const { RichEmbed } = require("discord.js");

const verLevel = {
    0: "None",
    1: "Low",
    2: "Medium",
    3: "High",
    4: "Very High"
};

const guildRegion = {
    "brazil": "Brazil",
    "central-europe": "Central Europe",
    "hong-kong": "Hong Kong",
    "russia": "Russia",
    "singapore": "Singapore",
    "sydney": "Sydney",
    "us-central": "US Central",
    "us-east": "US East",
    "us-south": "US South",
    "us-west": "US West",
    "western-europe": "Western Europe"
};

// had guildRegion and verLevel objects in my config file

exports.run = (bot, message, args, level) => {

    const server = new RichEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL)
        .setThumbnail(message.guild.iconURL)
        .setColor("#00a8ff")
        .setFooter(message.guild.memberCount + " members, " + message.guild.members.filter(m => m.presence.status !== "offline").size + " online")
        .addField("ID:", message.guild.id, true)
        .addField("Region:", bot.config.guildRegion[guildRegion], true)
        .addField("Owner:", message.guild.owner.user.tag, true)
        .addField("Verification Level:", bot.config.verLevel[verLevel], true)
        .addField("Channels:", message.guild.channels.array().length, true)
        .addField("Roles:", message.guild.roles.array().length, true)
        .addField("Text Channels:", message.guild.channels.filterArray(c => c.type === "text").length, true)
        .addField("Voice Channels:", message.guild.channels.filterArray(c => c.type === "voice").length, true)

    return message.channel.send({embed: server});
};

exports.config = {
    enabled: true,
    guildOnly: true,
    aliases: ["serverinfo"],
    permLevel: "User"
};

exports.help = {
    name: "server",
    category: "Info",
    desc: "Displays server info",
    usage: "server"
};
