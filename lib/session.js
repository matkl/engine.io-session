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
      if (!socket.request.cookies[key]) return;
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
