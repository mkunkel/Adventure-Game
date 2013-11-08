var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var _ = require('lodash');

var colors = require('colors');
// Colors
// bold, italic, underline, inverse, yellow, cyan,
// white, magenta, green, red, grey, blue, rainbow,
// zebra, random

// GET /
exports.index = function(req, res){
  console.log('game.index'.italic.underline.bold.magenta);

  res.render('game/index', {title: 'Game'});
};

// POST /
exports.create = function(req, res){
  // req.body is { playerName: 'Tommy', columns: '4', rows: '8' }
  //Need to create and save a new game in database
  new Game(req.body).save(function(err, game){
    //in callback pass the game object back to the browser
    res.send(game);
  });
};

// PUT /
exports.move = function(req, res){
  console.log('game.move'.italic.underline.bold.yellow);
  res.send(req.body); // req.body contains {x:n, y:n}, where n is -1, 0, or 1
};
