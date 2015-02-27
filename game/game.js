var User = require('./user')
var Map = require('./map')

var Game = function (io) {
  var $game = this
  this.users = []
  this.map = new Map()

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
    $game.users = $game.users.filter(function(e) { return e })
    console.log('user disconnected')
  }

  this.loop = function() {
    $game.tick()
  }

  this.send_map = function() {
    io.emit('send_map', JSON.stringify($game.map))
  }

  this.init_io = function() {
    io.on('connection', function(socket){
      var id = $game.users.length
      var user = new User(id)
      $game.users[id] = user
      $game.send_map()

      // todo: хак с передачей переменных контекста, исправить
      socket.on('move', function(msg) { $game.move(msg, user) })
      socket.on('shoot', function(msg) { $game.shoot(msg) })
      socket.on('disconnect', function() { $game.disconnect(id) })

      console.log('a user connected')
    })
  }

  this.start = function() {
    $game.init_io()
    setInterval($game.loop, 30)
  }
}

module.exports = Game