engine.io-session
=================

An engine.io plugin that allows you to read sessions created by the Connect session middleware.

## Usage

### With Connect

TODO

### With Express

```js
var express = require('express');
var engine = require('engine.io');
var engineSession = require('engine.io-session');

var app = express();
var cookieParser = express.cookieParser();
var sessionStore = new MemoryStore();
var sessionKey = 'sid';
var sessionSecret = 'your secret here';

app.use(cookieParser);
app.use(express.session({ store: sessionStore, key: sessionKey, secret: sessionSecret }));

var httpServer = http.createServer(app).listen(3000);
var server = engine.attach(httpServer);

server.on('connection', engineSession({
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
