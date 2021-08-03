class Event {
  constructor(client, {
    name = null,
    location = ""
  }) {
    this.client = client;
    this.conf = { name, location };
  }
}
  
module.exports = Event;