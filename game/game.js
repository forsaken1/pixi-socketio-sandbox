var User = require('./user')
var Map = require('./map')

var FPS = 30

var Game = function (io) {
  var $game = this
  this.users = []
  this.map = new Map()

  this.tick = function() {
    io.emit('tick', JSON.stringify($game.each_user(function(user) { return user.to_json() })))
  }

  this.disconnect = function(id) {
    $game.users[id] = null
    $game.users = $game.users.filter(function(e) { return e })
    console.log('user disconnected')
  }

  this.each_user = function(func) {
    var result = []
    for(var i in $game.users) {
      $game.users[i] && (result[result.length] = func($game.users[i]))
    }
    return result
  }

  this.loop = function() {
    $game.each_user(function(user) { user.tick($game.map) })
    $game.tick()
  }

  this.send_map = function() {
    io.emit('send_map', JSON.stringify($game.map.get_raw()))
  }

  this.init_io = function() {
    io.on('connection', function(socket) {
      var id = $game.users.length
      var user = new User(id)
      $game.users[id] = user
      $game.send_map()

      // todo: хак с передачей переменных контекста, исправить
      socket.on('move_start', function(msg) { user.move_start(msg.direction); console.log('user move started') })
      socket.on('move_stop', function(msg) { user.move_stop(); console.log('user move stopped') })
      socket.on('shoot', function(msg) { user.shoot() })
      socket.on('disconnect', function() { $game.disconnect(id) })
      socket.on('terminal', function(msg) { user.terminal(msg) })

      console.log('a user connected')
    })
  }

  this.start = function() {
    $game.init_io()
    setInterval($game.loop, 1000 / FPS)
  }
}

module.exports = Game