
const os = require('os')
const path = require('path')
const {ArgumentParser} = require('argparse');

const version = '1.0.0'
const description = 'nodeJS http2 server w/ Koa and GraphQL for performance testing'

var host = os.hostname();

const argParser = new ArgumentParser({
  version,
  description,
  addHelp: true,
});
argParser.addArgument(['--port', '-p'], {
  type: Number,
  defaultValue: 443,
  help: 'Port number. Defaults to 443.',
});
argParser.addArgument(['--home'], {
  type: String,
  defaultValue: '../public',
  help: "Home directory to serve assets, equates to / url. Defaults to '../public'.",
});
argParser.addArgument(['--hostname'], {
  type: String,
  defaultValue: host,
  help: `Home directory to serve assets, equates to / url. Defaults to '${host}'.`,
});

const args = argParser.parseArgs();

if (!args.home.startsWith('/')) {             // Relative Path detected
  args.home = path.join(__dirname, args.home)
}


module.exports = args;
