const inquirer = require("inquirer");
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const fs = require("fs");

let baseConfig = fs.readFileSync("./setup_base.txt", "utf8");

const defaultSettings = `{
  "prefix": "~",
  "modLogChannel": "mod-log",
  "modRole": "Moderator",
  "adminRole": "Administrator",
  "systemNotice": "true",
  "welcomeChannel": "welcome",
  "welcomeMessage": "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D",
  "welcomeEnabled": "false"
}`;

const settings = new Enmap({provider: new EnmapLevel({name: "settings"})});

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
    type: "input",
    name: "oauthSecret",
    message: "Please enter the Client Secret from the application page."
  },
  {
    type: "input",
    name: "saltyKey",
    message: "Please enter a session security passphrase (used to encrypt session data)."
  },
  {
    type: "input",
    name: "host",
    message: "Please enter your domain name and port (optional) : (e.g. localhost:8080 or www.example.com)"
  }
];

(async function() {
  console.log("Setting Up GuideBot Configuration...");
  await settings.defer;
  if (!settings.has("default")) {
    prompts = prompts.slice(1);
    console.log("First Start! Inserting default guild settings in the database...");
    await settings.setAsync("default", defaultSettings);
  }
  const isGlitch = await inquirer.prompt([{type: "confirm", name: "glitch", message: "Are you hosted on Glitch.com?", default: false}]);

  if (isGlitch.glitch) {
    baseConfig = baseConfig
      .replace("{{fullURL}}", "${process.env.PROJECT_DOMAIN}")
      .replace("{{domain}}", "`${process.env.PROJECT_DOMAIN}.glitch.me`")
      .replace("{{port}}", "process.env.PORT")
      .replace("{{token}}", "process.env.TOKEN")
      .replace("{{oauthSecret}}", "process.env.SECRET")
      .replace("{{sessionSecret}}", "process.env.SESSION_SECRET");
    console.log("REMEMBER TO PLACE THE TOKEN, SECRET AND SESSION_SECRET IN YOUR .ENV FILE!!!");
    const ownerID = await inquirer.prompt([{name: "data", message: "Please enter your User ID for the bot's Owner."}]);
    baseConfig = baseConfig.replace("{{ownerID}}", ownerID.data);
    fs.writeFileSync("./config.js", baseConfig);
    console.log("Configuration has been written, enjoy!");
    return;
  }

  const answers = await inquirer.prompt(prompts);

  if (answers.resetDefaults && answers.resetDefaults === "Yes") {
    console.log("Resetting default guild settings...");
    await settings.setAsync("default", defaultSettings);
  }

  const port = answers.host.split(":")[1] || "81";

  baseConfig = baseConfig
    .replace("{{ownerID}}", answers.ownerID)
    .replace("{{fullURL}}", answers.host)
    .replace("{{domain}}", `"${answers.host.split(":")[0]}"`)
    .replace("{{port}}", port)
    .replace("{{token}}", `"${answers.token}"`)
    .replace("{{oauthSecret}}", `"${answers.oauthSecret}"`)
    .replace("{{sessionSecret}}", `"${answers.saltyKey}"`);
  
  fs.writeFileSync("./config.js", baseConfig);
  console.log("REMEMBER TO NEVER SHARE YOUR TOKEN WITH ANYONE!");
  console.log("Configuration has been written, enjoy!");
  await settings.close();
}());