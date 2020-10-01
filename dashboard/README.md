# DASHBOARD EXAMPLE
Dashboard, that is provided as is and help is very limited, and as this isn't HTML support, so you will be told to google your problem.

This is a very simple dashboard example, but even in its simple state, there are still a lot of moving parts working together to make this a reality.
- I shall attempt to explain those parts in as much details as possible, but be aware: there's still a lot of complexity ndd you shouldn't expect to really understand all of it instantly.
- Pay attention, be aware of the details, and read the comments. 
- Note that this *could* be split into multiple files, but for the purpose of this
example, putting it in one file is a little simpler. Just *a little*.

## Requirements
- Install the following for dashboard stuff.
```
npm install body-parser ejs express express-passport express-session helmet

npm install connect-sqlite3 level-session-store marked passport passport-discord node-fetch
```
- Enable dashboard by editing 
```js
// await require("../dashboard/app")(client);
```
to
```js
await require("../dashboard/app")(client);
```
in `events/ready.js`
- Fill `dashboard` settings in `config.js`


## Some helpful hints:
- `bot token` is from the application page (see above in Requirements)
- `bot owner's User ID` is obtained by right-clicking your username in Discord and selecting "Copy ID".
- `oauthSecret` The Client Secret code at the top of the app page that you have to click to reveal. 
- `Client Secret` is obtained from [your Discord Developer page](https://discord.com/developers/applications/), clicking your app, then copying the `Client Secret` on this page.
- `session security passphrase` is your own choice. It acts like an internal password for sessions data storage. It should be a long sentence, without spaces or special characters.
- `domain` should be your publicly accessible URL without the `/callback` at the end, or the http/https at the beginning. But it should have a port if you have one.
- `callbackURL` that will be called after the login. This URL must be available from your PC for now, but must be available publically if you're ever to use this dashboard in an actual bot. 
- `mongodb connection string` is the one obtained from the mongo section above.
