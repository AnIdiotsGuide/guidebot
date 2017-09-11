module.exports = {
  ownerID: "139412744439988224",
  token: "MjczOTk0ODg2MjAwNTU3NTY4.DJhByQ.BeYG0Y2ZtpEoSFTsxIXJPP25N7k",
  defaultSettings : {
    prefix: "%",
    modLogChannel: "mod-log",
    modRole: "Moderator",
    adminRole: "Administrator",
    welcomeEnabled: "false",
    welcomeChannel: "welcome",
    welcomeMessage: "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D"
  },
  permLevels: [
    { level: 0,
      name: "User", 
      check: () => true
    },

    { level: 2,
      name: "Moderator", 
      check: (message) => {
        try {
          const modRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.modRole.toLowerCase());
          if (modRole && message.member.roles.has(modRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },

    { level: 3,
      name: "Administrator", 
      check: (message) => {
        try {
          const adminRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.adminRole.toLowerCase());
          return (adminRole && message.member.roles.has(adminRole.id));
        } catch (e) {
          return false;
        }
      }
    },

    { level: 4,
      name: "Server Owner", 
      check: (message) => message.guild.owner.user.id === message.author.id
    },

    { level: 10,
      name: "Bot Owner", 
      check: (message) => message.client.config.ownerID === message.author.id
    }
  ]
};
