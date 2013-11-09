var mongoose = require('mongoose');

var Piece = mongoose.Schema({
  // e.g. 'ghost'
  type: String,
  //later i.e. position.x ... position.y
  position: {},
  effect: {type: Number, default: 0}
});

mongoose.model('Piece', Piece);