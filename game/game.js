var User = require('./user')
var Map = require('./map')
//var Border = require('./border')

var Game = function (io) {
  var $game = this
  this.users = []
  this.borders = []
  this.map = new Map()

  for(var i in $game.map) {
    $game.borders[i] = []
    for(var j in $game.map[i]) {
      var letters = { '#': true, '&': true, '$': true }
      $game.borders[i][j] = letters[$game.map[i][j]] || false
    }
  }

  this.tick = function() {
    io.emit('tick', JSON.stringify($game.each_user(function(user) { return user.to_json() })))
  }

  this.move_start = function(msg, user) {
    user.move_start(msg.direction)
    console.log('user move started')
  }

  this.move_stop = function(msg, user) {
    user.move_stop()
    console.log('user move stopped')
  }

  this.shoot = function(msg, user) {
    user.shoot()
    console.log('user shooting!')
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
    $game.each_user(function(user) { user.tick($game.borders) })
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
      socket.on('move_start', function(msg) { $game.move_start(msg, user) })
      socket.on('move_stop', function(msg) { $game.move_stop(msg, user) })
      socket.on('shoot', function(msg) { $game.shoot(msg, user) })
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