// module.exports = class {
//   constructor(client) {
//     this.client = client;
//   }

//   async run(error) {
//     this.client.logger.log(`An error event was sent by Discord.js: \n${JSON.stringify(error)}`, "error");
//   }
// };


const Event = require("../base/Event");

class Error extends Event {
  constructor(client) {
    super(client, {
      name: "error"
    });
  }

  async run(error) {
    this.client.logger.log(`An error event was sent by Discord.js: \n${JSON.stringify(error)}`, "error");
  }
}

module.exports = Error;