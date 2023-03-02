let canvas;
let ctx;
let gameBoardArrayHeight = 20;
let gameBoardArrayWidth = 12;
let startX = 4;
let startY =0;
let score = 0;
let level = 1;
let winOrLose = "Playing";
let tetrisLogo;

let coordinateArray = [...Array(gameBoardArrayHeight)].map(e => Array(gameBoardArrayWidth).fill(0))
let curTetromino = [[1,0], [0,1], [1,1], [2,1]];

// 1. Will hold all the Tetrominos
let tetrominos = [];

// 2. The tetromino array with the colors matched to the tetrominos array
let tetrominosColor = ['purple', 'cyan', 'yellow', 'green', 'red', 'orange', 'blue']

// 3. Holds current Tetromino color
let curTetrominoColor;

// 4. Create gameboard array so we know where other squares are
let gameBoardArray = [...Array(gameBoardArrayHeight)].map(e => Array(gameBoardArrayWidth).fill(0))

// 6. Array for storing stopped shapes
// It will hold colors when a shape stops and is added
let stoppedShapeArray = [...Array(gameBoardArrayHeight)].map(e => Array(gameBoardArrayWidth).fill(0))

// 4. Created to track the direction I'm moving the Tetromino
// so that I can stop trying to move through walls
let DIRECTION = {
  IDLE: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
};

let direction;

class Coordinates{
  constructor(x,y){
  this.x = x;
  this.y = y;
  }
}

// Execute SetupCanvas when page loads
document.addEventListener('DOMContentLoaded', SetupCanvas);

function CreateCoordinateArray(){
  let i = 0, j = 0;
  for(let y = 9; y <= 446; y+= 23 ){
    for(let x = 11; x <= 264; x +=23 ){
      coordinateArray[i][j] = new Coordinates(x,y);
      i++;
    }
    j++
    i = 0;
  }
}

function SetupCanvas(){
  canvas = document.getElementById('my-canvas');
  ctx = canvas.getContext('2d');
  canvas.width = 936;
  canvas.height = 956;

  // Double the size of elements to fit the screen
  ctx.scale(2,2);

  // Draw Canvas background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw gameboard rectangle
  ctx.strokeStyle = 'black';
  ctx.strokeRect(8, 8, 280, 462);

  tetrisLogo = new Image(115,64.7);
  tetrisLogo.onLoad = DrawTetrisLogo;
  tetrisLogo.src = 'tetrislogo.png';

  // 2. Handle keyboard presses
  document.addEventListener('keydown', HandleKeyPress);

  // 3. Create the array of Tetromino arrays
  CreateTetrominos();
  // 3. Generate random Tetromino
  CreateTetromino();
  // Create the rectangle lookup table
  CreateCoordinateArray();
  DrawTetromino();
}

function DrawTetromino(){
  for(let i = 0; i < curTetromino.length; i++){
    let x = curTetromino[i][0] + startX;
    let y = curTetromino[i][1] + startY;

    //Put Tetromino shape in the gameboard array
    gameBoardArray[x][y] = 1;

    let coorX = coordinateArray[x][y].x;
    let coorY = coordinateArray[x][y].y;

    ctx.fillStyle = curTetrominoColor;
    ctx.fillRect(coorX, coorY, 21, 21);
  }
}
// ----- 2. Move & Delete Old Tetrimino -----
// Each time a key is pressed we change the either the starting
// x or y value for where we want to draw the new Tetromino
// We also delete the previously drawn shape and draw the new one
function HandleKeyPress(key){
  if(key.keyCode === 65){
    // a keycode (LEFT)
    // 4. Check if I'll hit the wall
      direction = DIRECTION.LEFT;
      if(!HittingTheWall()){
        DeleteTetromino();
        startX--;
        DrawTetromino();
        }
  } else if (key.keyCode === 68){
    // d keycode (RIGHT)
    // 4. Check if I'll hit the wall
      direction = DIRECTION.RIGHT;
      if(!HittingTheWall()){
        DeleteTetromino();
        startX++;
        DrawTetromino();
      }
  } else if (key.keyCode === 83){
     // s keycode (DOWN)
     // 9. e keycode calls for rotation of Tetromino
      direction = DIRECTION.DOWN;
      DeleteTetromino();
      startY++;
      DrawTetromino();
  }
}
// Clears the previously drawn Tetromino
// Do the same stuff when we drew originally
// but make the square white this time
function DeleteTetromino(){
  for(let i = 0; i < curTetromino.length; i++){
    let x = curTetromino[i][0] + startX;
    let y = curTetromino[i][1] + startY;

    // 4. Delete Tetromino square from the gameboard array
    gameBoardArray[x][y] = 0;

    // Draw white where colored squares used to be
    let coorX = coordinateArray[x][y].x;
    let coorY = coordinateArray[x][y].y;
    ctx.fillStyle = 'white';
    ctx.fillRect(coorX, coorY, 21, 21);
  }
}

// 3. Generate random Tetrominos with color
function CreateTetrominos(){
  //Push T
  tetrominos.push([[1, 0], [0, 1], [1, 1], [2, 1]]);
  //Push I
  tetrominos.push([[0, 0], [1, 0], [2, 0], [3, 0]]);
  //Push J
  tetrominos.push([[0, 0], [0, 1], [1, 1], [2, 1]]);
  //Push Square
  tetrominos.push([[0, 0], [1, 0], [0, 1], [1, 1]]);
  //Push L
  tetrominos.push([[2, 0], [0, 1], [1, 1], [2, 1]]);
  //Push S
  tetrominos.push([[1, 0], [2, 0], [0, 1], [1, 1]]);
  //Push Z
  tetrominos.push([[0, 0], [1, 0], [1, 1], [2, 1]]);
}

function CreateTetromino(){
  // Get a random tetromino index
  let randomTetromino = Math.floor(Math.random() * tetrominos.length);
  // Set the one to draw
  curTetromino = tetrominos[randomTetromino];
  // Get the color for it
  curTetrominoColor  = tetrominosColor[randomTetromino];
}

// 4. Check if the Tetromino hits the wall
// Cycle through the squares adding the upper left hand corner
// position to see if the value is <= to 0 or >= 11
// If they are also moving in a direction that would be off
// the board stop movement
function HittingTheWall(){
  for(let i = 0; i < curTetromino.length; i++){
    let newX = curTetromino[1][0] + startX;
    if (newX <= 0 && direction === DIRECTION.LEFT){
      return true;
    } else if(newX >= 11 && direction === DIRECTION.RIGHT){
      return true;
    }
  }
  return false;
}
