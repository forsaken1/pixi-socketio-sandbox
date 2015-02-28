function Game() {
  $game = this
  var BLOCK_SIZE = 50;

  this.map = [[]]
  this.users = []
  this.stage = null
  this.key_down_code = undefined

  this.init_pixi = function() {
    var renderer = new PIXI.WebGLRenderer(800, 600);

    document.body.appendChild(renderer.view);

    $game.user_texture = PIXI.Texture.fromImage("images/t1.png");
    $game.stage = new PIXI.Stage;
    $game.stage.setBackgroundColor(0xFFFFFF)

    requestAnimationFrame(animate);

    function animate() {
      renderer.render($game.stage);
      requestAnimationFrame(animate);
    }
    console.log('pixi initialized')
  }

  this.init_event_listeners = function() {
    var direction = { 37: 'l', 38: 'u', 39: 'r', 40: 'd' }

    document.addEventListener('keydown', function(event) {
      $game.socket.emit('move_start', { direction: direction[event.keyCode] })
      $game.key_down_code = event.keyCode
    });

    document.addEventListener('keyup', function(event) {
      if($game.key_down_code == event.keyCode) {
        $game.socket.emit('move_stop')
        $game.key_down_code = undefined
      }
    });
  }

  this.init_io = function() {
    $game.socket = io()
    $game.socket.on('tick', $game.tick)
    $game.socket.on('send_map', $game.send_map)
  }

  this.clear_stage = function() {
    while($game.stage.children[0]) { $game.stage.removeChild($game.stage.children[0]); }
  }

  this.add_user = function(hash) {
    var user = new PIXI.Sprite($game.user_texture)

    user.position.x = hash.x * BLOCK_SIZE
    user.position.y = hash.y * BLOCK_SIZE

    $game.stage.addChild(user)
  }

  this.tick = function(msg) {
    $game.clear_stage()
    $game.users = eval(msg)

    for(var i in $game.users) {
      user = $game.users[i]
      user && $game.add_user(user)
    }
    console.log(msg)
  }

  this.send_map = function(msg) {
    $game.map = eval(msg)
    console.log('map loaded')
  }

  this.start = function() {
    $game.init_pixi()
    $game.init_io()
    $game.init_event_listeners()
  }
}

var game = new Game()
game.start()