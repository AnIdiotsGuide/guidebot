// This event fires everytime a debug message is emitted by Discord.js.

module.exports = (client, info) => {
  // To enable debug mode, set "debug" to true in the `../config.js` file.
  if (!client.config.debug) return;
  client.log("log", info, "Debug");
};