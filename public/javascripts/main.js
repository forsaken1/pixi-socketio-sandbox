var renderer = new PIXI.WebGLRenderer(800, 600);

document.body.appendChild(renderer.view);

var bunnyTexture = PIXI.Texture.fromImage("images/bunny.png");
var stage = new PIXI.Stage;

requestAnimationFrame(animate);

function animate() {
  renderer.render(stage);
  requestAnimationFrame(animate);
}

var socket = io()

socket.on('tick', function(msg){
  while(stage.children[0]) { stage.removeChild(stage.children[0]); }
  users = eval(msg)

  for(var i in users)
  {
    user = users[i]
    if(!user)
      continue

    var bunny = new PIXI.Sprite(bunnyTexture)

    bunny.position.x = user.x
    bunny.position.y = user.y

    stage.addChild(bunny)
  }
  console.log(msg)
})

document.addEventListener('keypress', function(event){
  socket.emit('move', { keyCode: event.keyCode })
});