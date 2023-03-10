var qtree;
var rockSprite;
var paperSprite;
var scissorSprite;
var game;

/** Creates canvas */
function setup() {
  frameRate(FRAME_RATE);
  var canvas = createCanvas(300, 500);
  var canvas_x = (windowWidth - width) / 2;
  var canvas_y = (windowHeight - height) / 4;
  canvas.position(canvas_x, canvas_y);
  rockSprite = loadImage('graphics/rock.png');
  paperSprite = loadImage('graphics/paper.png');
  scissorSprite = loadImage('graphics/scissors.png');
  game = new Game(NUMBER_OF_POINTS);
  button = createButton("Reset");
  button.mousePressed(newGame);
  button.position(canvas_x + width / 2 - button.width / 2, canvas_y + height + OFFSET);
}

function windowResized() {
  var canvas_x = (windowWidth - width) / 2;
  var canvas_y = (windowHeight - height) / 4;
  canvas.position(canvas_x, canvas_y);
}

function draw() {
  background(255);
  game.update();
  game.show();
  drawBorder();
  // noLoop();
}

function drawBorder() {
  fill(0);
  rect(0, 0, width, 2);
  rect(0, 0, 2, height);
  rect(0, height - 2, width, 2);
  rect(width - 2, 0, 2, height);
}

function newGame() {
  game = new Game(NUMBER_OF_POINTS);
}
