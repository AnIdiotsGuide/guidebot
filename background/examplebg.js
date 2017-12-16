const slug = "examplebg";

exports.conf = {
  slug: slug,
  interval: 3000 // milliseconds
};

exports.init = () => {
  console.log("Worker has been initialized.");
};

let ranTimes = 0;

exports.run = (client) => {
  console.log(`${slug} worker ran ${++ranTimes} times.`);
  if (ranTimes === 4) {
    console.log(`${slug} ran 4 times. Unloading..`);
    client.unloadBackgroundWorker(slug);
  }
};
