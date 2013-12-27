var http = require('http');
var connect = require('connect');
var eio = require('engine.io');
var eioc = require('engine.io-client');
var eioSession = require('..');
var superagent = require('superagent');

function listen(callback) {
  var cookieParser = connect.cookieParser();
  var app = connect();
  var sessionStore = new connect.session.MemoryStore();
  var sessionKey = 'sid';
  var sessionSecret = 'keyboard cat';

  app.use(connect.cookieParser());
  app.use(connect.session({ store: sessionStore, key: sessionKey, secret: sessionSecret }));
  app.use(function(req, res) {
    req.session.foo = 'bar';
    req.session.save();
    res.end('test');
  });

  var httpServer = http.createServer(app).listen();
  var server = eio.attach(httpServer);

  server.on('connection', eioSession({
    cookieParser: cookieParser,
    store: sessionStore,
    key: sessionKey,
    secret: sessionSecret
  }));

  callback(httpServer.address().port);

  return server;  
}

function request(port, callback) {
  var agent = superagent.agent();
  agent.get('http://localhost:' + port).end(function(err, res) {
    process.nextTick(function() {
      callback(agent);
    });
  });
}

function HttpAgent(agent) {
  this.agent = agent;
}

HttpAgent.prototype.addRequest = function(req, host, port, localAddress) {
  var url = 'http://' + host + ':' + port + req.path;
  this.agent.get(url).end();
};

describe('engine.io-session', function() {
  it('should get a session', function(done) {
    var server = listen(function(port) {
      request(port, function(agent) {
        var socket = eioc('ws://localhost:' + port, { agent: new HttpAgent(agent) });
      });
    });

    server.on('session', function(socket, session) {
      done();
    });
  });
  it('should generate a session if none exists', function(done) {
    var server = listen(function(port) {
      var socket = eioc('ws://localhost:' + port);
    });
    server.on('session', function(socket, session) {
      done();
    });
  });
});
