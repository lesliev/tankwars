

var keys = {};
var state = 'menu';
var canvasWidth = 1802;
var canvasHeight = 900;
var background = new Image();
var bulletImage = new Image();
var kblamImage = new Image();

var crashSound = new Audio('crash.mp3');
var boomSound = new Audio('boom.mp3');

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
    lastShot: 0,
    dotStyle: "#00ffff",
    health: 1,
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
    lastShot: 0,
    dotStyle: "#ff0000",
    health: 1,
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

var frame = 0;


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
  kblamImage.src = 'kblam.png';

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
  frame += 1;

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
    if((keys[13] == true))
    {
      // reset
      state = 'playing';
    }
    else
    {
      ctx.fillStyle = "White";
      ctx.font = "92px Arial";
      ctx.fillText("Apple Wars!", (canvasWidth/2)-180, canvasHeight/4);
      ctx.font = "62px Arial";
      ctx.fillText("Player 1: WASD/space  Player 2: Arrows/P", (canvasWidth/2)-500, canvasHeight/3);
      ctx.fillText("Press Enter to play", (canvasWidth/2)-225, canvasHeight/2);
      // do nothing
    }
  }
  else if(state == 'death') {
    ctx.font = "62px Arial";
    ctx.fillStyle = "White";


    if(tanks[0].health < 1) {
      ctx.fillText("Player 1 died!", (canvasWidth/2)-170, canvasHeight/3);
    }
    if(tanks[1].health < 1) {
      ctx.fillText("Player 2 died!", (canvasWidth/2)-170, canvasHeight/3);
    }

    ctx.fillText("Press F5 to play again", (canvasWidth/2)-275, canvasHeight/2);
    // do nothing
  } else {

    distance = 
      Math.sqrt(
        ((tanks[1].x - tanks[0].x) * (tanks[1].x - tanks[0].x)) +
        ((tanks[1].y - tanks[0].y) * (tanks[1].y - tanks[0].y))
      )

    // Make smashing noises when tanks are close 

    if(distance < 30){
      crashSound.play();
    }

    // Check keys and move tanks accordingly

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
        if((frame - tanks[i].lastShot) > 40) {

          tanks[i].lastShot = frame;

          bullets.push( 
            {
              x: tanks[i].x,
              y: tanks[i].y, 
              r: tanks[i].r, 
              image: bulletImage,
              dead: false,
              owner: i
            }
          );
        }
      }
    }

    // Clip movement at borders

    for(i = 0; i < tankNum; i += 1) {
      if(tanks[i].x < 0){ tanks[i].x = 0; }
      if(tanks[i].x > canvasWidth){ tanks[i].x = canvasWidth; }

      if(tanks[i].y < 0){ tanks[i].y = 0; }
      if(tanks[i].y > canvasHeight){ tanks[i].y = canvasHeight; }
    }

    // Move bullets

    for(bulletNumber = 0; bulletNumber < bullets.length; bulletNumber++) {
      bullets[bulletNumber].x += 3 * Math.sin(bullets[bulletNumber].r);
      bullets[bulletNumber].y -= 3 * Math.cos(bullets[bulletNumber].r);

      if(bullets[bulletNumber].x > canvasWidth) { bullets[bulletNumber].dead = true; }
      if(bullets[bulletNumber].x < 0) { bullets[bulletNumber].dead = true; }

      if(bullets[bulletNumber].y > canvasHeight) { bullets[bulletNumber].dead = true; }
      if(bullets[bulletNumber].y < 0) { bullets[bulletNumber].dead = true; }


      for(i = 0; i < tankNum; i += 1) {

        if(bullets[bulletNumber].owner != i) {
          bulletDistance = 
            Math.sqrt(
            ((tanks[i].x - bullets[bulletNumber].x) * (tanks[i].x - bullets[bulletNumber].x)) +
            ((tanks[i].y - bullets[bulletNumber].y) * (tanks[i].y - bullets[bulletNumber].y))
            );

          if(bulletDistance < 20) {
            tanks[i].health -= 1;
            if (tanks[i].health < 1) {
              boomSound.play();
              state = 'death';
            }
          }
        }

      }

    }


    bullets = bullets.filter(function(bullet){
      return !bullet.dead;
    });
        
    // Paint tanks

    for(tankNumber = 0; tankNumber < tankNum; tankNumber++) {

      var image;

      if  (tanks[tankNumber].health < 1) { 
        image = kblamImage;
      } 
      else {
        image = tanks[tankNumber].image;
      }

      rotateAndPaintImage(ctx, image, tanks[tankNumber].r, 
        tanks[tankNumber].x, tanks[tankNumber].y, 
        17, 36.5);

      // PAINT DOTS

      // ctx.beginPath();
      // ctx.rect(tanks[tankNumber].x, tanks[tankNumber].y, 8, 8);
      
      // ctx.fillStyle = tanks[tankNumber].dotStyle;

      // ctx.fill();
      // ctx.closePath();
    }

    // Paint bullets

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