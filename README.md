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
and 99% compatible with commands from [York's TutorialBot](https://github.com/AnIdiotsGuide/Tutorial-Bot/tree/Episode-9).

## Requirements

- `git` command line ([Windows](https://git-scm.com/download/win)|[Linux](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)|[MacOS](https://git-scm.com/download/mac)) installed
- `node` [Version 8.0.0 or higher](https://nodejs.org)

You also need your bot's token. This is obtained by creating an application in
the Developer section of discordapp.com. Check the [first section of this page](https://anidiots.guide/getting-started/the-long-version.html) 
for more info.

## Downloading

In a command prompt in your projects folder (wherever that may be) run the following:

`git clone https://github.com/An-Idiots-Guide/guidebot.git`

Once finished: 

- In the folder from where you ran the git command, run `cd discordjs-bot-handler` and then run `npm install`
- Rename `config.json.example` to `config.json`
- Edit `config.json` and enter your token and other details as indicated. It should look like this afterwards: 

![](http://proof.evie-banned.me/WhaRsa6)


## Starting the bot

To start the bot, in the command prompt, run the following command:
`node index.js`

## Inviting to a guild

To add the bot to your guild, you have to get an oauth link for it. 

You can use this site to help you generate a full OAuth Link, which includes a calculator for the permissions:
[https://finitereality.github.io/permissions](https://finitereality.github.io/permissions)
