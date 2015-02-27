var User = require('./user')

var Game = function (io) {
  var $game = this
  this.users = []

  this.tick = function() {
    io.emit('tick', JSON.stringify($game.users))
  }

  this.move = function(msg, user) {
    user.move(msg.keyCode)
    console.log('user moved')
  }

  this.shoot = function(msg) {
    console.log('user shooting!')
  }

  this.disconnect = function(id) {
    $game.users[id] = null
    $game.users = $game.users.filter(function(e) { return e !== null })
    console.log('user disconnected')
  }

  this.loop = function() {
    $game.tick()
  }

  this.init_io = function() {
    io.on('connection', function(socket){
      console.log('a user connected')
      var id = $game.users.length
      var user = new User(id)
      $game.users[id] = user

      setInterval($game.loop, 30)

      // todo: хак с передачей переменных контекста, исправить
      socket.on('move', function(msg) { $game.move(msg, user) })
      socket.on('shoot', function(msg) { $game.shoot(msg) })
      socket.on('disconnect', function() { $game.disconnect(id) })
    })
  }

  this.start = function() {
    $game.init_io()
  }
}

module.exports = Game