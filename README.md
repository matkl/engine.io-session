engine.io-session
=================

[![Build Status](https://travis-ci.org/matkl/engine.io-session.png?branch=master)](https://travis-ci.org/matkl/engine.io-session)
[![Coverage Status](https://coveralls.io/repos/github/matkl/engine.io-session/badge.svg?branch=master)](https://coveralls.io/github/matkl/engine.io-session?branch=master)
[![npm version](http://img.shields.io/npm/v/engine.io-session.svg?style=flat)](https://npmjs.org/package/engine.io-session "View this project on npm")

**Deprecated**: This module will probably not work with Connect >= 3.0 and should no longer be needed. See [this post on Stack Overflow](http://stackoverflow.com/questions/23494016/socket-io-and-express-4-sessions) for information about accessing sessions in engine.io.

An [engine.io](https://github.com/LearnBoost/engine.io) plugin that allows you to read sessions created by the [Connect](http://senchalabs.github.com/connect) session middleware.

It obtains the session id from the HTTP request headers and fetches the session data from a specified session store.

## Installation

```
npm install engine.io-session
```

## Usage

### Example using Connect 2.x

```js
var http = require('http');
var connect = require('connect');
var eio = require('engine.io');
var eioSession = require('engine.io-session');

var app = connect();
var cookieParser = connect.cookieParser();
var sessionStore = new connect.session.MemoryStore();
var sessionKey = 'sid';
var sessionSecret = 'your secret here';

app.use(cookieParser);
app.use(connect.session({ store: sessionStore, key: sessionKey, secret: sessionSecret }));
app.use(function(req, res) {
  // Save variable to session.
  req.session.foo = 'bar';
  res.end();
});

var httpServer = http.createServer(app).listen(5000);
var server = eio.attach(httpServer);

server.on('connection', eioSession({
  cookieParser: cookieParser,
  store: sessionStore,
  key: sessionKey,
  secret: sessionSecret
}));

server.on('session', function(socket, session) {
  // Receive variable from session.
  console.log(session.foo); // bar
});
```

### Example using Express 3.x

Same as above. Replace `connect` with `express`.

## Events

The `session` events will be fired on the `Server` and `Socket` objects.

### Server

- `session`
    - Called when a session for a socket is available.
    - **Arguments**
      - `Socket`: the Socket object
      - `session`: the session data

### Socket

- `session`
    - Called when a session for this socket is available.
    - **Arguments**
      - `session`: the session data
