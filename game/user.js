module.exports.User = function(id) {
  $this = this
  SPEED = 10
  this.id = id
  this.x = Math.floor((Math.random() * 700) + 1)
  this.y = Math.floor((Math.random() * 500) + 1)

  this.move = function(keyCode){
    switch(keyCode)
    {
      case 37:
        $this.x -= SPEED
      break
      case 38:
        $this.y -= SPEED
      break
      case 39:
        $this.x += SPEED
      break
      case 40:
        $this.y += SPEED
      break
    }
  }
}