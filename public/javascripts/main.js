function Game() {
  $game = this
  this.map = [[]]
  this.users = []
  this.stage = null

  this.init_pixi = function() {
    var renderer = new PIXI.WebGLRenderer(800, 600);

    document.body.appendChild(renderer.view);

    $game.bunnyTexture = PIXI.Texture.fromImage("images/bunny.png");
    $game.stage = new PIXI.Stage;

    requestAnimationFrame(animate);

    function animate() {
      renderer.render($game.stage);
      requestAnimationFrame(animate);
    }
    console.log('pixi initialized')
  }

  this.init_event_listeners = function() {
    document.addEventListener('keypress', function(event) {
      $game.socket.emit('move', { keyCode: event.keyCode })
    });
  }

  this.init_io = function() {
    $game.socket = io()
    $game.socket.on('tick', $game.tick)
    $game.socket.on('send_map', $game.send_map)
  }

  this.clearStage = function() {
    while($game.stage.children[0]) { $game.stage.removeChild($game.stage.children[0]); }
  }

  this.tick = function(msg) {
    $game.clearStage()
    $game.users = eval(msg)

    for(var i in $game.users) {
      user = $game.users[i]
      if(!user)
        continue

      var bunny = new PIXI.Sprite($game.bunnyTexture)

      bunny.position.x = user.x
      bunny.position.y = user.y

      $game.stage.addChild(bunny)
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