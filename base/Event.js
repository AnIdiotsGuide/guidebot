class Event {
  constructor(client, {
    name = null
  }) {
    this.client = client;
    this.conf = { name };
  }
}
  
module.exports = Event;