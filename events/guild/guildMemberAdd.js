// This event executes when a new member joins a server. Let's welcome them!
// If this event isn't firing, you need to enable the `GUILD_MEMBERS` privileged intent
// in your bot's application page.

const Event = require("../../base/Event.js");

module.exports = class guildMemberAdd extends Event {
  constructor(client) {
    super(client, {
      name: "guildMemberAdd"
    });
  }

  async run(member) {
    
    // Load the guild's settings
    const settings = this.client.getSettings(member.guild);
  
    // If welcome is off, don't proceed (don't welcome the user)
    if (settings.welcomeEnabled !== "true") return;

    // Replace the placeholders in the welcome message with actual data
    const welcomeMessage = settings.welcomeMessage.replace("{{user}}", member.user.tag);

    // Send the welcome message to the welcome channel
    // There's a place for more configs here.
    member.guild.channels.cache.find(c => c.name === settings.welcomeChannel).send(welcomeMessage).catch(console.error);
  }
};