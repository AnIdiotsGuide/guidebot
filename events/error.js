const logger = require("../modules/logger.js");
module.exports = async (client, error) => {
  logger.log(`An error event was sent by Discord.js: \n${JSON.stringify(error)}`, "error");
};
