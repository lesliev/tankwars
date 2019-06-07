

var keys = {};
var state = 'menu';
var canvasWidth = 1802;
var canvasHeight = 900;
var background = new Image();

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
    dotStyle: "#00ffff"
  },
  {
    type: tankTypes[2],
    image: new Image(),
    x: canvasWidth - canvasWidth/4,
    y: canvasHeight - canvasHeight/4,
    r: 0,
    dotStyle: "#ff0000"
  }
]


window.onkeyup = function(e) { 
  console.log("key up: ", e.keyCode);
  keys[e.keyCode] = false; 
}

window.onkeydown = function(e) { 
  console.log("key down: ", e.keyCode);
  keys[e.keyCode] = true; 
}

function init() {

  for(i = 0; i < 2; i+=1) {
    tanks[i].image.src = tanks[i].type.fileName;
  }

  background.src = 'infinigrass.jpg';

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

    if((keys[37] == true)) { tanks[1].r -= 0.1; }
    if((keys[39] == true)) { tanks[1].r += 0.1; }
    if(keys[38] == true) {
      tanks[1].x += 2 * Math.sin(tanks[1].r);
      tanks[1].y -= 2 * Math.cos(tanks[1].r);
    }
    if(keys[40] == true) {
      tanks[1].x -= 2 * Math.sin(tanks[1].r);
      tanks[1].y += 2 * Math.cos(tanks[1].r);
    }

    if((keys[65] == true)) { tanks[0].r -= 0.1; }
    if((keys[68] == true)) { tanks[0].r += 0.1; }
    if(keys[87] == true) {
      tanks[0].x += 2 * Math.sin(tanks[0].r);
      tanks[0].y -= 2 * Math.cos(tanks[0].r);
    }
    if(keys[83] == true) {
      tanks[0].x -= 2 * Math.sin(tanks[0].r);
      tanks[0].y += 2 * Math.cos(tanks[0].r);
    }

    for(tankNumber = 0; tankNumber < 2; tankNumber++) {
      rotateAndPaintImage(ctx, tanks[tankNumber].image, tanks[tankNumber].r, 
        tanks[tankNumber].x, tanks[tankNumber].y, 
        17, 36.5);

        ctx.beginPath();
        ctx.rect(tanks[tankNumber].x, tanks[tankNumber].y, 8, 8);
        
        ctx.fillStyle = tanks[tankNumber].dotStyle;

        ctx.fill();
        ctx.closePath();
    }

    // 

    // draw game here
  }

  window.requestAnimationFrame(draw);
}

init();