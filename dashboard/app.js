module.exports = async client => {
  // Discord "recently" introduced Teams, where you can share bot applications between
  // a team of developers, so let's create a new array to push owner ids to.
  client.owners = new Array();

  // Why await here? Because the ready event isn't actually ready, sometimes
  // guild information will come in *after* ready. 1s is plenty, generally,
  // for all of them to be loaded.
  // NOTE: client.wait and client.log are added by ./modules/functions.js !
  await client.wait(1000);

  // This loop ensures that client.application always contains up to date data
  // about the app's status. This includes whether the bot is public or not,
  // its description, owner(s), etc. Used for the dashboard amongs other things.
  client.application = await client.fetchApplication();
  if (client.owners.length < 1) client.application.team ? client.owners.push(...client.application.team.members.keys()) : client.owners.push(client.application.owner.id);
  setInterval( async () => {
    client.owners = [];
    client.application = await client.fetchApplication();
    client.application.team ? client.owners.push(...client.application.team.members.keys()) : client.owners.push(client.application.owner.id);
  }, 60000);

  // Initializes the dashboard, which must be done on ready otherwise some data
  // may be missing from the dashboard. 
  require("./dashboard")(client);  
};
