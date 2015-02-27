var User = function(id) {
  var $user = this
  var SPEED = 0.08
  var ACCELERATE = 0.001

  this.id = id
  this.x = Math.floor((Math.random() * 8) + 1)
  this.y = Math.floor((Math.random() * 6) + 1)
  this.dx = 0
  this.dy = 0

  this.move = {
    l: function() { $user.dx = - SPEED },
    u: function() { $user.dy = - SPEED },
    r: function() { $user.dx = SPEED },
    d: function() { $user.dy = SPEED }
  }

  this.move_start = function(direction) {
    var op = $user.move[direction]
    op && op()
  }

  this.move_stop = function() {
    $user.dx = 0
    $user.dy = 0
  }

  this.shoot = function() {

  }

  this.tick = function() {
    $user.x += $user.dx
    $user.y += $user.dy
  }

  this.to_json = function() {
    return {
      x: $user.x,
      y: $user.y,
      dx: $user.dx,
      dy: $user.dy
    }
  }
}

module.exports = User