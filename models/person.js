var mongoose = require('mongoose');

var Person = mongoose.Schema({
  // position is an empty object, aka "mixed-type", later in program can assign Person.position.x = 0
  position : {},
  health   : Number
});

mongoose.model('Person', Person);