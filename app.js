
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');

var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Logic

function User(id)
{
  SPEED = 10
  this.id = id
  this.x = Math.floor((Math.random() * 700) + 1)
  this.y = Math.floor((Math.random() * 500) + 1)
  this.move = function(keyCode){
    switch(keyCode)
    {
      case 37:
        this.x -= SPEED
      break
      case 38:
        this.y -= SPEED
      break
      case 39:
        this.x += SPEED
      break
      case 40:
        this.y += SPEED
      break
    }
  }
}

var users = []

function step()
{
  io.emit('step', JSON.stringify(users))
}

// Routes

app.get('/', routes.index)

io.on('connection', function(socket){
  console.log('a user connected')
  var id = users.length
  var user = new User(id)
  users[id] = user
  step()

  socket.on('move', function(msg) {
    user.move(msg.keyCode)
    step()
    console.log('user moved')
  })

  socket.on('disconnect', function(){
    users[id] = null
    step()
    console.log('user disconnected')
  })
})

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env)
})
