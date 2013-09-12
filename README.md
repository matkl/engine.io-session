engine.io-session
=================

An [engine.io](https://github.com/LearnBoost/engine.io) plugin that allows you to read sessions created by the [Connect](http://senchalabs.github.com/connect) session middleware.

## Installation

```
npm install engine.io-session
```

## Usage

### Example using Connect

```js
var connect = require('connect');
var eio = require('engine.io');
var eioSession = require('engine.io-session');

var cookieParser = connect.cookieParser();
var app = connect();
var sessionStore = new connect.session.MemoryStore();
var sessionKey = 'sid';
var sessionSecret = 'your secret here';

app.use(cookieParser);
app.use({ store: sessionStore, key: sessionKey, secret: sessionSecret });

var httpServer = http.createServer(app).listen(3000);
var server = eio.attach(httpServer);

server.on('connection', eioSession({
  cookieParser: cookieParser,
  store: sessionStore,
  key: sessionKey,
  secret: sessionSecret
});

server.on('session', function(socket, session) {
  // Output session data.
  console.log(session);
});
```

### Example using Express

```js
var express = require('express');
var eio = require('engine.io');
var eioSession = require('engine.io-session');

var app = express();
var cookieParser = express.cookieParser();
var sessionStore = new express.session.MemoryStore();
var sessionKey = 'sid';
var sessionSecret = 'your secret here';

app.use(cookieParser);
app.use(express.session({ store: sessionStore, key: sessionKey, secret: sessionSecret }));

var httpServer = http.createServer(app).listen(3000);
var server = engine.attach(httpServer);

server.on('connection', eioSession({
  cookieParser: cookieParser,
  store: sessionStore,
  key: sessionKey,
  secret: sessionSecret
});

server.on('session', function(socket, session) {
  // Output session data.
  console.log(session);
});
```

## Events

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
