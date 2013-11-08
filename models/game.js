// bring in required files
var mongoose = require('mongoose');
var _ = require('lodash');

// define game model
var Game = mongoose.Schema({
  playerName      : String,
  rows            : Number,
  columns         : Number,
  person          : { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
  movingPieces    : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Piece' }],
  stationaryPieces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Piece' }],
  gameOver        : {type: Boolean, default: false},
  didWin          : Boolean
});

mongoose.model('Game', Game);