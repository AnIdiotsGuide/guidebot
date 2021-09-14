const Enmap = require("enmap");
/**
 * Now we integrate the use of Evie's awesome Enhanced Map module, which
 * essentially saves a collection to disk. This is great for per-server configs,
 * and makes things extremely easy for this purpose.
 */

const settings = new Enmap({ name: "settings" });
 
/**
 * SETTINGS FUNCTIONS
 * These functions are used by any and all location in the bot that wants to either
 * read the current *complete* guild settings (default + overrides, merged) or that
 * wants to change settings for a specific guild.
 */

// getSettings merges the client defaults with the guild settings. guild settings in
// enmap should only have *unique* overrides that are different from defaults.
function getSettings(guild) {
  const defaults = settings.get("default") || {};
  const guildData = guild ? settings.get(guild.id) || {} : {};
  const returnObject = {};
  Object.keys(defaults).forEach((key) => {
    returnObject[key] = guildData[key] ? guildData[key] : defaults[key];
  });
  return returnObject;
}

// writeSettings overrides, or adds, any configuration item that is different
// than the defaults. This ensures less storage wasted and to detect overrides.
function writeSettings(id, newSettings) {
  const defaults = settings.get("default");
  let guildSettings = settings.get(id);
  if (typeof guildSettings != "object") guildSettings = {};
  for (const key in newSettings) {
    if (defaults[key] !== newSettings[key]) {
      guildSettings[key] = newSettings[key];
    } else {
      delete guildSettings[key];
    }
  }
  settings.set(id, guildSettings);
}

module.exports = { settings, getSettings, writeSettings };