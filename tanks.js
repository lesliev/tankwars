

var keys = {};
var state = 'menu';
var canvasWidth = 1802;
var canvasHeight = 900;
var background = new Image();
var bulletImage = new Image();
var crashSound = new Audio('crash.mp3');

var tankTypes = [
  {name: 'hotchkiss', fileName: 'hotchkiss.png'}, 
  {name: 'panther',   fileName: 'panther.png'}, 
  {name: 'panzer',    fileName: 'panzer.png'}, 
  {name: 't34',       fileName: 't34.png'}
]


var tanks = [
  {
    type: tankTypes[0],
    image: new Image(),
    x: canvasWidth/4,
    y: canvasHeight - canvasHeight/4,
    r: 0,
    dotStyle: "#00ffff",
    keys: {
      left: 65,
      right: 68,
      forward: 87,
      backward: 83,
      fire: 32
    }
  },
  {
    type: tankTypes[2],
    image: new Image(),
    x: canvasWidth - canvasWidth/4,
    y: canvasHeight - canvasHeight/4,
    r: 0,
    dotStyle: "#ff0000",
    keys: {
      left: 37,
      right: 39,
      forward: 38,
      backward: 40,
      fire: 80
    }
  }
]

var bullets = [];

var tankNum = tanks.length;


window.onkeyup = function(e) { 
  console.log("key up: ", e.keyCode);
  keys[e.keyCode] = false; 
}

window.onkeydown = function(e) { 
  console.log("key down: ", e.keyCode);
  keys[e.keyCode] = true; 
}

function init() {

  for(i = 0; i < tankNum; i+=1) {
    tanks[i].image.src = tanks[i].type.fileName;
  }

  background.src = 'infinigrass.jpg';
  bulletImage.src = 'apple_small.png'

  window.requestAnimationFrame(draw);
}

function rotateAndPaintImage ( context, image, angleInRad , positionX, positionY, axisX, axisY ) {
  context.translate( positionX, positionY );
  context.rotate( angleInRad );
  context.drawImage( image, -axisX, -axisY );
  context.rotate( -angleInRad );
  context.translate( -positionX, -positionY );
}

function draw() {
  var canvas = document.getElementById("tankscene");
  var ctx = canvas.getContext("2d");

  ctx.globalCompositeOperation = 'destination-under';
      
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.beginPath();
  ctx.rect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = "#66c2ff";
  ctx.fill();
  ctx.closePath();

  ctx.drawImage(background, 0, 0);
  
  if(state == 'menu') {
    if((keys[32] == true))
    {
      // reset
      state = 'playing';
    }
    else
    {
      ctx.font = "32px Georgia";
      ctx.fillStyle = "white";
      ctx.fillText("Press Space to play", (canvasWidth/2)-150, canvasHeight/2);
      // do nothing
    }
  } else {

    // if(close){
    //   crashSound.play();
    // }

    distance = 
      Math.sqrt(
        ((tanks[1].x - tanks[0].x) * (tanks[1].x - tanks[0].x)) +
        ((tanks[1].y - tanks[0].y) * (tanks[1].y - tanks[0].y))
      )

    if(distance < 30){
      crashSound.play();
    }

    for(i = 0; i < tankNum; i += 1) {
      if((keys[tanks[i].keys.left] == true)) { tanks[i].r -= 0.1; }
      if((keys[tanks[i].keys.right] == true)) { tanks[i].r += 0.1; }
      if(keys[tanks[i].keys.forward] == true) {
        tanks[i].x += 2 * Math.sin(tanks[i].r);
        tanks[i].y -= 2 * Math.cos(tanks[i].r);
      }
      if(keys[tanks[i].keys.backward] == true) {
        tanks[i].x -= 2 * Math.sin(tanks[i].r);
        tanks[i].y += 2 * Math.cos(tanks[i].r);
      }
      if(keys[tanks[i].keys.fire] == true) {
        bullets.push( 
          {
            x: tanks[i].x,
            y: tanks[i].y, 
            r: tanks[i].r, 
            image: bulletImage
          }
        );
      }
    }

    for(i = 0; i < tankNum; i += 1) {
      if(tanks[i].x < 0){ tanks[i].x = 0; }
      if(tanks[i].x > canvasWidth){ tanks[i].x = canvasWidth; }

      if(tanks[i].y < 0){ tanks[i].y = 0; }
      if(tanks[i].y > canvasHeight){ tanks[i].y = canvasHeight; }
    }
    
    // paint tanks
    for(tankNumber = 0; tankNumber < tankNum; tankNumber++) {
      rotateAndPaintImage(ctx, tanks[tankNumber].image, tanks[tankNumber].r, 
        tanks[tankNumber].x, tanks[tankNumber].y, 
        17, 36.5);

      // ctx.beginPath();
      // ctx.rect(tanks[tankNumber].x, tanks[tankNumber].y, 8, 8);
      
      // ctx.fillStyle = tanks[tankNumber].dotStyle;

      // ctx.fill();
      // ctx.closePath();
    }

    // paint bullets
    for(bulletNumber = 0; bulletNumber < bullets.length; bulletNumber++) {
      rotateAndPaintImage(ctx, bullets[bulletNumber].image, bullets[bulletNumber].r, 
        bullets[bulletNumber].x, bullets[bulletNumber].y, 
        8, 9);            
    }

    // 

    // draw game here
  }

  window.requestAnimationFrame(draw);
}

init();