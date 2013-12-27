var signature = require('cookie-signature');

function parseSignedCookie(str, secret) {
  return 0 == str.indexOf('s:')
    ? signature.unsign(str.slice(2), secret)
    : str;
}

module.exports = function session(options) {
  var cookieParser = options.cookieParser;
  var key = options.key;
  var secret = options.secret;
  var store = options.store;

  return function(socket) {
    cookieParser(socket.request, null, function(err) {
      if (!socket.request.cookies[key]) {
        store.generate(socket.request);
        socket.request.sessionStore = store;
        socket.transport.on('headers', function(header){
          var val = 's:' + signature.sign(socket.request.sessionID, secret);
          val = socket.request.session.cookie.serialize(key, val);
          header['Set-Cookie'] = val;
        });
        socket.request.session.save(function(){
          socket.server.emit('session', socket, socket.request.session);
          socket.emit('session', socket.request.session);
        });
        return;
      }
      var sessionId = parseSignedCookie(socket.request.cookies[key], secret);
      store.get(sessionId, function(err, session) {
        if (session) {
          socket.server.emit('session', socket, session);
          socket.emit('session', session);
        }
      });
    });
  };
};
