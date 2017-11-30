exports.run = (client, message) => {
message.channel.send({embed: {
    color: 3447003,
    author: {
      name: "nathanielcwm#3522",
      icon_url: client.user.avatarURL
    },
    title: "Rules:",
    fields: [{
        name: "Rule 1",
        value: "**No Means Of Pornography** Are Permitted On This Server *This Includes Hentai*"
      },
      {
        name: "Rule 2",
        value: "Swearing is totally allowed provided that it is **__not offensive or at someone__**."
      },
      {
        name: "Rule 3",
        value: "No trolling or acting stupid"
      }
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "Rules of The Server"
    }
  }
});
};
