const slug = "examplebg";

module.exports.conf = {
  slug: slug,
  interval: 3000 // milliseconds
};

module.exports.init = () => {
  console.log("Worker has been initialized.");
};

var ranTimes = 0;

module.exports.run = (client) => {
  console.log(`${slug} worker ran ${++ranTimes} times.`);
  if (ranTimes == 4) {
    console.log(`${slug} ran 4 times. Unloading..`);
    client.unloadBackgroundWorker(slug);
  }
};