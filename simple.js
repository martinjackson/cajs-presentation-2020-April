
const fs = require('fs');
const http2 = require('http2');
const koa = require('koa');
const helmet = require("koa-helmet");    // koa-helmet >=2.x (master branch) supports koa 2.x

const fqdn = require('./fqdn')

const app = new koa();
app.use(helmet());

// response
app.use(ctx => {
  ctx.body = 'Hello Koa';
});


fqdn().then( host => {
  const options = {
    key: fs.readFileSync(`./ssl/${host}.key`),
    cert: fs.readFileSync(`./ssl/${host}.crt`),
  };

  const server = http2.createSecureServer(options, app.callback());
  server.listen(443, (err) => {
    if (err) {
      console.error(err)
      return
    }

    console.log(`Server listening on 443`)
  })


})


