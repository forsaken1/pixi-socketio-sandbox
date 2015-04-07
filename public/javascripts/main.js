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

    $game.sprites = {
      t1: function() { return new PIXI.Sprite(PIXI.Texture.fromImage("images/t1.png")) },
      t2: function() { return new PIXI.Sprite(PIXI.Texture.fromImage("images/t2.png")) },
      t3: function() { return new PIXI.Sprite(PIXI.Texture.fromImage("images/t3.png")) },
      t4: function() { return new PIXI.Sprite(PIXI.Texture.fromImage("images/t4.png")) },
      t5: function() { return new PIXI.Sprite(PIXI.Texture.fromImage("images/t5.png")) },
      t6: function() { return new PIXI.Sprite(PIXI.Texture.fromImage("images/t6.png")) },
      t7: function() { return new PIXI.Sprite(PIXI.Texture.fromImage("images/t7.png")) },
      t8: function() { return new PIXI.Sprite(PIXI.Texture.fromImage("images/t8.png")) },
      '&': function() { return new PIXI.Sprite(PIXI.Texture.fromImage("images/beton.png")) },
      '#': function() { return new PIXI.Sprite(PIXI.Texture.fromImage("images/brick.png")) },
      '$': function() { return new PIXI.Sprite(PIXI.Texture.fromImage("images/water.png")) },
      '*': function() { return new PIXI.Sprite(PIXI.Texture.fromImage("images/tree.png")) }
    }
    $game.stage = new PIXI.Stage
    $game.stage.setBackgroundColor(0xFFFFFF)

    requestAnimationFrame(animate);

    function animate() {
      renderer.render($game.stage);
      requestAnimationFrame(animate);
    }
    console.log('pixi initialized')
  }

  this.init_event_listeners = function() {
    var direction = { 
      37: 'l', 38: 'u', 39: 'r', 40: 'd',
      65: 'l', 87: 'u', 68: 'r', 83: 'd'
    }

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

  function to_rad(degree) {
    return degree * Math.PI / 180
  }

  this.add_user = function(hash) {
    var user = $game.sprites['t' + hash.tank_type]()
    
    user.pivot.x = 25
    user.pivot.y = 25
    user.rotation = { l: to_rad(270), u: 0, r: to_rad(90), d: to_rad(180) }[hash.direction]
    user.position.x = hash.x * BLOCK_SIZE// + BLOCK_SIZE / 2
    user.position.y = hash.y * BLOCK_SIZE// + BLOCK_SIZE / 2

    $game.stage.addChild(user)
  }

  this.paint_map = function() {
    if(!$game.map) return

    for(var i in $game.map) {
      var map_arr = $game.map[i]
      for(var j in map_arr) {
        var map_item = map_arr[j]
        if(map_item == '.' || map_item == '@') continue
        var map_sprite = $game.sprites[map_item]()
        map_sprite.position.x = j * BLOCK_SIZE
        map_sprite.position.y = i * BLOCK_SIZE
        $game.stage.addChild(map_sprite)
      }
    }
  }

  this.tick = function(msg) {
    $game.clear_stage()
    $game.paint_map()
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