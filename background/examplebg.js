const slug = "examplebg";

exports.conf = {
  slug: slug,
  interval: 3000 // milliseconds
};

exports.init = async (client) => {
  console.log("Worker has been initialized.");
};

exports.shutdown = async (client) => {
  console.log("Worker is shutting down. Make sure you saved your changes.");
};

let ranTimes = 0;

exports.run = (client) => {
  console.log(`${slug} worker ran ${++ranTimes} times.`);
  if (ranTimes === 4) {
    console.log(`${slug} ran 4 times. Unloading..`);
    client.unloadBackgroundWorker(slug);
  }
};
