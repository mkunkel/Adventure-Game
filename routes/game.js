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
  console.log('req.body.playerName');
  console.log(req.body.playerName);
  console.log('req.body.columns');
  console.log(req.body.columns);
  console.log('req.body.rows');
  console.log(req.body.rows);
  res.send({ playerName: req.body.playerName});
  //Need to create and save a new game in database
  //in callback pass the game object back to the browser
};

// PUT /
exports.move = function(req, res){
  console.log('game.move'.italic.underline.bold.yellow);
  res.send(req.body); // req.body contains {x:n, y:n}, where n is -1, 0, or 1
};