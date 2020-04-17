
const fs = require('fs');
const http2 = require('http2');

const args = require('./args')
const genApp = require('./genKoaApp')
const h2PushStatic = require('./h2PushStatic')


const pushStatic = h2PushStatic(args.home)
const app = genApp(args.home);

const options = {
    key: fs.readFileSync(`./ssl/${args.hostname}.key`),
    cert: fs.readFileSync(`./ssl/${args.hostname}.crt`),
    allowHTTP1: true
  };

const server = http2.createSecureServer(options, (req, res) => {
  const { socket: { alpnProtocol } } = req.httpVersion === "2.0" ? req.stream.session : req;
  console.log(`http ver: ${req.httpVersion} protocol: ${alpnProtocol}    ${req.url}`)

  let done = false;
  if (req.httpVersion === "2.0") {
    done = pushStatic(req, res);
  }

  if (!done) app(req, res);
});

  server.listen(args.port, (err) => {
    if (err) {
      console.error(err)
      return
    }

    console.log(`Server listening on ${args.port}`)
  })




