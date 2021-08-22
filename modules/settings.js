const Enmap = require("enmap");
// Now we integrate the use of Evie's awesome Enmap module, which
// essentially saves a collection to disk. This is great for per-server configs,
// and makes things extremely easy for this purpose.
module.exports = {
  settings: new Enmap({
    name: "settings",
  }),
};