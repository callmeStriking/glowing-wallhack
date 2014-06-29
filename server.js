// Express
var express = require('express')
  , app = express()
  , stylus = require('stylus');

// Configure Express view engines and middleware
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.pretty = true;

app.use(stylus.middleware(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	res.render('index');
})

// Set up Socket.io communication

var server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
io.set('browser client gzip',true); //enable compression on socket.io.js

var port = process.env.PORT || 3000;
server.listen(port, function() {
console.log('Listening on port ' + port);
});