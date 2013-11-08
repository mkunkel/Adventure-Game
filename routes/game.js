var colors = require('colors');
// Colors
// bold, italic, underline, inverse, yellow, cyan,
// white, magenta, green, red, grey, blue, rainbow,
// zebra, random

// GET /
exports.index = function(req, res){
  console.log('game.index'.italic.underline.bold.magenta);
  res.render('game/index', {title: 'Express'});
};

// POST /
exports.create = function(req, res){
  console.log('game.create'.italic.underline.bold.green);
};

// PUT /
exports.move = function(req, res){
  console.log('game.move'.italic.underline.bold.yellow);
  res.send(req.body); // req.body contains {x:n, y:n}, where n is -1, 0, or 1
};