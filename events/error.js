module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(error) {
    this.client.logger.log(`An error event was sent by Discord.js: \n${JSON.stringify(error)}`, "error");
  }
};