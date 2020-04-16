'use strict'

const fs = require('fs')
const path = require('path')
// eslint-disable-next-line
const http2 = require('http2')

const helper = require('./helper')
const args = require('./args')

const { HTTP2_HEADER_PATH } = http2.constants

let publicFiles;

function init(homeDir) {
  publicFiles = helper.getFiles(homeDir)
  return onRequest;
}

// Server Push one file
function serverPush (stream, path) {
  // console.log('push:', path);

  const file = publicFiles.get(path)

  if (!file) {
    console.log('push file missing:', path);
    return
  }

  stream.pushStream({ [HTTP2_HEADER_PATH]: path }, (err, pushStream, headers) => {
    if (err) {
      // throw err;
      console.log(`error pushing: ${path}, let browser ask for asset later.`);
    } else {
    pushStream.respondWithFD(file.fileDescriptor, file.headers)
    }
  })
}

const keysStr = (obj) => {
  return Array.from(publicFiles.keys()).join(', ')
}

// Request handler
function onRequest (req, res) {
  const reqPath = req.url === '/' ? '/index.html' : req.url
  const file = publicFiles.get(reqPath)
  console.log(` ${reqPath}  ${(file) ? file.filePath : 'Not Found'}    push: ${res.stream.pushAllowed}`);

  // File not found in list
  if (!file) {
    // res.statusCode = 404
    // res.end()
    return false
  }

  // serverPush with index.html
  if (reqPath === '/index.html' && res.stream.pushAllowed) {
    console.log('   push:', keysStr(publicFiles));

    for (const f of publicFiles.keys()) {
      serverPush(res.stream, f)
      }
  }

  // Serve file
  res.stream.respondWithFD(file.fileDescriptor, file.headers)
  return true;
}

module.exports = init;
