// You can use either PIXI.WebGLRenderer or PIXI.CanvasRenderer
var renderer = new PIXI.WebGLRenderer(800, 600);

document.body.appendChild(renderer.view);

var stage = new PIXI.Stage;

var bunnyTexture = PIXI.Texture.fromImage("images/bunny.png");
var bunny = new PIXI.Sprite(bunnyTexture);

bunny.position.x = 0;
bunny.position.y = 0;

bunny.scale.x = 1;
bunny.scale.y = 1;

stage.addChild(bunny);

requestAnimationFrame(animate);

function animate() {
    renderer.render(stage);

    requestAnimationFrame(animate);
}

var socket = io();