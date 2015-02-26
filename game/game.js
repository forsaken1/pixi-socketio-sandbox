module.exports.Game = function (io, User) {
  $game = this
  this.users = []

  this.step = function() {
    io.emit('step', JSON.stringify($game.users))
  }

  this.init_io = function() {
    io.on('connection', function(socket){
      console.log('a user connected')
      var id = $game.users.length
      var user = new User(id)
      $game.users[id] = user
      $game.step()

      socket.on('move', function(msg) {
        user.move(msg.keyCode)
        $game.step()
        console.log('user moved')
      })

      socket.on('disconnect', function(){
        $game.users[id] = null
        $game.step()
        console.log('user disconnected')
      })
    })
  }

  this.start = function() {
    $game.init_io()
  }

  return this
}