// bring in required files
var mongoose = require('mongoose');
var _ = require('lodash');

// define game model
var Game = mongoose.Schema({
  playerName      : String,
  rows            : Number,
  columns         : Number,
  person          : [{}],
  movingPieces    : [{}],
  stationaryPieces: [{}],
  foundPrincess   : {type: Boolean, default: false},
  foundGold       : {type: Boolean, default: false},
  gameOver        : {type: Boolean, default: false},
  didWin          : Boolean
});


Game.pre('save', function(next){
  //initializes the movingPieces and stationaryPieces
  // the if conditions below ensure that these arrays are only created
  // when the game is FIRST saved (i.e. first created).
  if(!this.stationaryPieces.length){
    // create the stationaryPieces array.
    // e.g. this.stationaryPieces = ...
    // var test = new Piece
  }

  // if(!this.movingPieces.length){
  //   this.board = _.range(this.size).concat(_.range(this.size));
  //   this.board = _.shuffle(this.board);
  //   this.board = _.map(this.board, function(n){return {match: false, value: n};});
  // }

  next();
});

mongoose.model('Game', Game);