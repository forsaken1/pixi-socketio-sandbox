var User = function(id) {
  var $user = this
  var SPEED = 0.08
  var ACCELERATE = 0.001

  this.id = id
  this.tank_type = Math.floor((Math.random() * 8) + 1)
  this.x = Math.floor((Math.random() * 15) + 1)
  this.y = Math.floor((Math.random() * 11) + 1)
  this.dx = 0
  this.dy = 0
  this.direction = 'u'

  this.move = {
    l: function() {
      $user.dx = - SPEED
      $user.dy = 0
      $user.direction = 'l'
    },
    u: function() {
      $user.dx = 0
      $user.dy = - SPEED
      $user.direction = 'u'
    },
    r: function() {
      $user.dx = SPEED
      $user.dy = 0
      $user.direction = 'r'
    },
    d: function() {
      $user.dx = 0
      $user.dy = SPEED
      $user.direction = 'd'
    }
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

  this.is_collision = function(borders) {
    return {
      l: function() { return borders[parseInt($user.y)][parseInt($user.x - 1)] },
      u: function() { return borders[parseInt($user.y - 1)][parseInt($user.x)] },
      r: function() { return borders[parseInt($user.y)][parseInt($user.x + 1)] },
      d: function() { return borders[parseInt($user.y + 1)][parseInt($user.x)] }
    }[$user.direction]()
  }

  this.tick = function(borders) {
    if(!$user.is_collision(borders)) {
      $user.x += $user.dx
      $user.y += $user.dy
    }
  }

  this.to_json = function() {
    return {
      x: $user.x,
      y: $user.y,
      direction: $user.direction,
      tank_type: $user.tank_type
    }
  }
}

module.exports = User