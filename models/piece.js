var mongoose = require('mongoose');

var Piece = mongoose.Schema({
  // e.g. 'ghost'
  type: String,
  //later i.e. position.x ... position.y
  position: {}
});

mongoose.model('Piece', Piece);