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
- `node` [Version 10.x or higher](https://nodejs.org)
- [Pre-requisites for Enmap](https://enmap.evie.codes/install#pre-requisites)

You also need your bot's token. This is obtained by creating an application in
the Developer section of discordapp.com. Check the [first section of this page](https://anidiots.guide/getting-started/the-long-version.html) 
for more info.

For session storage, Guidebot was setup to use mongodb. Fear not, it's fairly easy to setup, and freely hosted on mongodb.com! Here's a real quick howto:
- Get an account at [mongodb.com](https://www.mongodb.com/cloud/atlas)
- Once created, setup your cluster: 
  - Provider & Region: Up to you, I chose AWS in my test (but you might have a closer free region!). Make sure to select a "FREE TIER AVAILABLE" region!
  - Keep the M0 cluster tier (the only free one). You may select backups if you want, other additional options are paid.
  - Type in a cluster name of your choice. Something like `guidebot-cluster`.
  - Click **Create Cluster**.
  - Go make a sandwich, setup can take a while...
  - Click the Collection button in the middle of the page.
  - Click Create Database. Enter a name such as `guidebot-session` then a collection name such as `sessions`.
- Now that the cluster is created, we now need to get a connection string. But we need to create a user, which there's a wizard for. 
  - Click **Command Line Tools** at the top of the cluster window, then click **Connect Instructions**.
  - Click **Add your Current IP** if you're on the machine that will host your bot. Otherwise, click **Add a Different IP Address** and enter it on the left. Click **Add IP Address**.
  - Enter a database access *username* and *password*, then click **Create MongoDB User**.
  - Click **Choose a connection method**.
  - Click **Connect your Application**
  - Change the driver version to **2.2.12 or later** (connect-mongo uses an older mongo driver).
  - Your connection string is here! Keep the page open to copy it later in the setup stage.

## Downloading

In a command prompt in your projects folder (wherever that may be) run the following:

`git clone https://github.com/An-Idiots-Guide/guidebot.git`

You also need to switch to the `dashboard` branch, which is done with the following command:

`git checkout dashboard`

Once finished: 

- In the folder from where you ran the git command, run `cd guidebot` and then run `npm install`
- If any errors happen during install, check [Enmap's Docs](https://enmap.evie.codes/install) for troubleshooting tips.
- Once the installation is done, the setup will automatically run. Follow the instructions given to finalize everything.

Some helpful hints: 
- `bot token` is from the application page (see above in Requirements)
- `bot owner's User ID` is obtained by right-clicking your username in Discord and selecting "Copy ID".
- `Client Secret` is obtained from [your Discord Developer page](https://discordapp.com/developers/applications/), clicking your app, then copying the `Client Secret` on this page.
- `session security passphrase` is your own choice. It acts like an internal password for sessions data storage. It should be a long sentence, without spaces or special characters.
- `domain` should be your publicly accessible URL without the `/callback` at the end, or the http/https at the beginning. But it should have a port if you have one.
- `mongodb connection string` is the one obtained from the mongo section above.

## Starting the bot

To start the bot, in the command prompt, run the following command:
`node index.js`

## Inviting to a guild

To add the bot to your guild, you have to get an oauth link for it. See [this page in An Idiot's Guide](https://anidiots.guide/getting-started/getting-started-long-version#add-your-bot-to-a-server)
for details on how to do this.

You can use this site to help you generate a full OAuth Link, which includes a calculator for the permissions:
[https://finitereality.github.io/permissions-calculator/?v=0](https://finitereality.github.io/permissions-calculator/?v=0)
