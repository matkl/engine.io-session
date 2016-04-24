var expect = require('chai').expect;
var http = require('http');
var connect = require('connect');
var eio = require('engine.io');
var eioc = require('engine.io-client');
var eioSession = require('..');
var request = require('superagent');

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

describe('engine.io-session', function() {
  it('should return a session', function(done) {
    var server = listen(function(port) {
      var req = request.get('http://localhost:' + port);
      req.end(function(err, res) {
        var cookie = res.headers['set-cookie'];
        var socket = eioc('ws://localhost:' + port, {
          extraHeaders: {
            'Cookie': cookie
          }
        });
      });
    });

    server.on('session', function(socket, session) {
      expect(session.foo).to.equal('bar');
      done();
    });
  });

  it('should generate an empty session if none exists', function(done) {
    var server = listen(function(port) {
      var socket = eioc('ws://localhost:' + port);
    });
    server.on('session', function(socket, session) {
      done();
    });
  });
});
