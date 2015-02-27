var User = function(id) {
  var $user = this
  var SPEED = 100

  this.id = id
  this.x = Math.floor((Math.random() * 700) + 1)
  this.y = Math.floor((Math.random() * 500) + 1)

  this.move = function(keyCode){
    switch(keyCode)
    {
      case 37:
        $user.x -= SPEED
      break
      case 38:
        $user.y -= SPEED
      break
      case 39:
        $user.x += SPEED
      break
      case 40:
        $user.y += SPEED
      break
    }
  }
}

module.exports = User