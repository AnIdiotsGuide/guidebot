/*
Logger class for easy and aesthetically pleasing console logging 
*/
const chalk = require("chalk");
const moment = require("moment");
const types = ["log","warn","error","debug","cmd","ready"];

exports.log = (...args) => {
  let type = args[args.length-1];
  if (!types.includes(type)) args.push(type = "log");
  args = args.slice(0, -1);
  let color;
  switch (type) {
    case "log":
      color = chalk.bgBlue(type.toUpperCase());
      break;
    case "warn":
      color = chalk.black.bgYellow(type.toUpperCase());
      break;
    case "error":
      color = chalk.bgRed(type.toUpperCase());
      break;
    case "debug":
      color = chalk.green(type.toUpperCase());
      break;
    case "cmd":
      color = chalk.black.bgWhite(type.toUpperCase());
      break;
    case "ready":
      color = chalk.black.bgGreen(type.toUpperCase());
      break;
  }
  return console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`, color, ...args);
}; 

exports.error = (...args) => this.log(...args, "error");

exports.warn = (...args) => this.log(...args, "warn");

exports.debug = (...args) => this.log(...args, "debug");

exports.cmd = (...args) => this.log(...args, "cmd");
