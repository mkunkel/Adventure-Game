// bring in required files
var mongoose = require('mongoose');
var _ = require('lodash');

// define game model
var Game = mongoose.Schema({
  playerName      : String,
  rows            : Number,
  columns         : Number,
  person          : {},
  movingPieces    : [{}],
  stationaryPieces: [{}],
  foundPrincess   : {type: Boolean, default: false},
  foundGold       : {type: Boolean, default: false},
  gameOver        : {type: Boolean, default: false},
  didWin          : Boolean
});

Game.pre('save', function(next){
  //initializes person, movingPieces, and stationaryPieces.
  // the if conditions below ensure that these arrays are only created
  // when the game is FIRST saved (i.e. first created).
  var columns = this.columns;
  var rows = this.rows;
  var allBoardSquaresArray = createAllBoardSquaresArray(columns, rows);

  if(_.isEmpty(this.person)){
    this.person = {};
    this.person.health = columns * rows;
    this.person.position = {};
    this.person.position.x = allBoardSquaresArray[0][0];
    this.person.position.y = allBoardSquaresArray[0][1];
  }

  if(!this.stationaryPieces.length){
    var exit = {type: 'exit', position: {x: allBoardSquaresArray[1][0], y: allBoardSquaresArray[1][1]}};
    var princess = {type: 'princess', position: {x: allBoardSquaresArray[2][0], y: allBoardSquaresArray[2][1]}};
    var treasure = {type: 'treasure', position: {x: allBoardSquaresArray[3][0], y: allBoardSquaresArray[3][1]}};
    this.stationaryPieces.push(exit, princess, treasure);
  }

  if(!this.movingPieces.length){
    var death = {type: 'death', position: {x: allBoardSquaresArray[4][0], y: allBoardSquaresArray[4][1]}};
    var wormhole1 = {type: 'wormhole', position: {x: allBoardSquaresArray[5][0], y: allBoardSquaresArray[5][1]}};
    var wormhole2 = {type: 'wormhole', position: {x: allBoardSquaresArray[6][0], y: allBoardSquaresArray[6][1]}};
    var numberOfGhosts = Math.ceil((rows * columns) / 10);
    this.movingPieces.push(death, wormhole1, wormhole2);
    for(var z = 0; z < numberOfGhosts; z++){
      var ghost = {type: 'ghost', position: {x: allBoardSquaresArray[z+7][0], y: allBoardSquaresArray[z+7][1]}};
      this.movingPieces.push(ghost);
    }
  }

  next();
});

mongoose.model('Game', Game);

function createAllBoardSquaresArray(columns, rows){
  var squaresArray = [];
  for(var x = 0; x < columns; x++){
    for(var y = 0; y < rows; y++){
      squaresArray.push([x, y]);
    }
  }
  squaresArray = _.shuffle(squaresArray);
  return squaresArray;
}