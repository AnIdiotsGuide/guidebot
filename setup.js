const inquirer = require("inquirer");
const Enmap = require("enmap");
const fs = require("fs");

let baseConfig = fs.readFileSync("./config_base.txt", "utf8");

const defaultSettings = {
  "prefix": "~",
  "modLogChannel": "mod-log",
  "modRole": "Moderator",
  "adminRole": "Administrator",
  "systemNotice": "true",
  "welcomeChannel": "welcome",
  "welcomeMessage": "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D",
  "welcomeEnabled": "false"
};

const settings = new Enmap({
  name: "settings",
  cloneLevel: 'deep',
  ensureProps: true
});


let prompts = [
  {
    type: "list",
    name: "resetDefaults",
    message: "Do you want to reset default settings?",
    choices: ["Yes", "No"]
  },
  {
    type: "input",
    name: "token",
    message: "Please enter the bot token from the application page."
  },
  {
    type: "input",
    name: "ownerID",
    message: "Please enter the bot owner's User ID"
  },
  {
    type: "checkbox",
    name: "intents",
    message: "Which intents would you like? \n" +
      "By default GuideBot needs Guilds, Guild Messages and Direct Messages to work. \n" +
      "For join messages to work you need Guild Members, which is privileged and requires extra setup.\n" +
      "For more info about intents see the README.",
    choices: [
      { "name": "Guilds", "value": "GUILDS", "checked": true },
      { "name": "Guild Messages", "value": "GUILD_MESSAGES", "checked": true },
      { "name": "Direct Messages", "value": "DIRECT_MESSAGES", "checked": true },
      { "name": "Guild Bans", "value": "GUILD_BANS" },
      { "name": "Guild Emojis", "value": "GUILD_EMOJIS" },
      { "name": "Guild Integrations", "value": "GUILD_INTEGRATIONS" },
      { "name": "Guild Webhooks", "value": "GUILD_WEBHOOKS" },
      { "name": "Guild Invites", "value": "GUILD_INVITES" },
      { "name": "Guild Voice States", "value": "GUILD_VOICE_STATES" },
      { "name": "Guild Message Reactions", "value": "GUILD_MESSAGE_REACTIONS" },
      { "name": "Guild Message Typing", "value": "GUILD_MESSAGE_TYPING" },
      { "name": "Direct Message Reactions", "value": "DIRECT_MESSAGE_REACTIONS" },
      { "name": "Direct Message Typing", "value": "DIRECT_MESSAGE_TYPING" },
      { "name": "Guild Presences (privileged)", "value": "GUILD_PRESENCES" },
      { "name": "Guild Members (privileged)", "value": "GUILD_MEMBERS" },
    ]
  },
];

(async function () {
  console.log("Setting Up GuideBot Configuration...");
  await settings.defer;
  if (!settings.has("default")) {
    prompts = prompts.slice(1);
    console.log("First Start! Inserting default guild settings in the database...");
    await settings.set("default", defaultSettings);
  }

  const answers = await inquirer.prompt(prompts);

  if (answers.resetDefaults && answers.resetDefaults === "Yes") {
    console.log("Resetting default guild settings...");
    await settings.set("default", defaultSettings);
  }

  baseConfig = baseConfig
    .replace("{{ownerID}}", answers.ownerID)
    .replace("{{token}}", `"${answers.token}"`)
    .replace("{{intents}}", JSON.stringify(answers.intents));

  fs.writeFileSync("./config.js", baseConfig);
  console.log("REMEMBER TO NEVER SHARE YOUR TOKEN WITH ANYONE!");
  console.log("Configuration has been written, enjoy!");
  await settings.close();
}());