# Guide Bot
An example of a Discord.js Bot Handler. Updated and Maintained by the Idiot's Guide Community.

Ages ago, Guide Bot was actually a little bot I had on the official discord.js server.
It helped me link to the d.js bot making guide I was building, with links.
This bot grew into something that I could show new coders and bot makers, but
over time it grew into a full framework - one that is now under the hands of a 
group of contributors, and no longer easily "understandable" by the majority
of our newbies. So I've pulled the original Guide Bot out of the mothballs,
gave it a fresh coat of paint and grease, and here it is back in its full glory!

This command handler is 98% compatible with [my selfbot](https://github.com/eslachance/evie.selfbot) 
and 99% compatible with commands from [York's Tutorial Bot](https://github.com/AnIdiotsGuide/Tutorial-Bot/tree/Episode-10-Part-1).

## Requirements

- `git` command line ([Windows](https://git-scm.com/download/win)|[Linux](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)|[MacOS](https://git-scm.com/download/mac)) installed
- `node` [Version 8.0.0 or higher](https://nodejs.org)
- `rethinkdb` [Version 2.3.6 or higher](https://www.rethinkdb.com/)

You also need your bot's token. This is obtained by creating an application in
the Developer section of discordapp.com. Check the [first section of this page](https://anidiots.guide/getting-started/the-long-version.html)
for more info.

## Downloading

In a command prompt in your projects folder (wherever that may be) run the following:

`git clone https://github.com/An-Idiots-Guide/guidebot.git`

Once finished:

- In the folder from where you ran the git command, run `cd guidebot` and then run `npm install`
- Rename `config.json.example` to `config.json`
- Edit `config.json` and enter your token and other details as indicated. It should look like this afterwards:

```json
{
  "ownerID": "139412744439988224",
  "token": "MzUzOTUxODYwOTA3OTY2NDY0.DI3K3w.VN1Gvsl7CSh2IYIELJDJAFejH4w",
  "defaultSettings" : {
    "prefix": "-",
    "modLogChannel": "mod-log",
    "modRole": "Moderator",
    "adminRole": "Administrator",
    "welcomeEnabled": "false",
    "welcomeChannel": "welcome",
    "welcomeMessage": "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D"
  }
}
```
> The token in the above example belongs to a deleted bot.

## Setting up the Database

The database needs to be running before you continue, if you're running Windows:

- Download the zipped *.EXE from the RethinkDB [website](https://www.rethinkdb.com/docs/install)
- Extract and run the *.EXE

If you're running Linux:

- Use the following [https://www.rethinkdb.com/docs/start-on-startup/](guide) to run RethinkDB as a process in the background, that way you will not have to worry about running it every single time.

Once you've installed RethinkDB for your Operating System you will need to create the Database **guidebot** and Table **settings**

> If you have access to the Administration Console [Accessible by going to **127.0.0.1:8080**] continue by following these steps:

- Go to the **Tables** tab
- Click **+ Add Database**
- Set the name as **guidebot**
- In the database, click **+ Add Table**
- Set the name as **settings**

> If you do not have access to the Administration Console, use the following code in a Node console to add the tables.

```
r = require("rethinkdbdash")();

r.dbCreate("guidebot").run();

r.db("guidebot").tableCreate("settings").run();
```

Once the following steps are complete, the bot will function as normal.

## Starting the bot

To start the bot, in the command prompt, run the following command:
`node index.js`

## Inviting to a guild

To add the bot to your guild, you have to get an oauth link for it. 

You can use this site to help you generate a full OAuth Link, which includes a calculator for the permissions:
[https://finitereality.github.io/permissions-calculator/?v=0](https://finitereality.github.io/permissions-calculator/?v=0)
