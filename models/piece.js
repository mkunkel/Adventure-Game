var mongoose = require('mongoose');

var Piece = mongoose.Schema({
  // e.g. 'ghost'
  type: String,
  //later i.e. position.x ... position.y
  position: {}
  //********************************************
  //should we add 'image: String' for the file path to the .png?
  //********************************************
});

mongoose.model('Piece', Piece);