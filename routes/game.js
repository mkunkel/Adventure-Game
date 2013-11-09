var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var _ = require('lodash');

var colors = require('colors');
var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var Person = mongoose.model('Person');
var Piece = mongoose.model('Piece');
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

PUT /
exports.move = function(req, res){
  console.log('game.move'.italic.underline.bold.yellow);

  res.send(req.body); // req.body contains {x:n, y:n}, where n is -1, 0, or 1
};

  res.send(req.body); // req.body contains {x:n, y:n, gameId:___, personId:___}, where n is -1, 0, or 1
  Person.findById(req.body.id, function(err, person) {
    person.position.x += req.body.x;
    person.position.y += req.body.y;
    checkCollisions(person.position.x, person.position.y, gameId);
  });

}

function checkCollisions(x, y, gameId) {
  var collisions = [];
  Game.findById(gameId).populate('movingPieces').exec(function(err, game){
    for (var i = 0; i < game.movingPieces.length; i++) {
      if (game.movingPieces[i].position.x === x && game.movingPieces[i].position.y === y) {
        collisions.push(game.movingPieces[i]);
      }
      if (game.stationaryPieces[i].position.x === x && game.stationaryPieces[i].position.y === y) {
        collisions.push(game.stationaryPieces[i]);
      }
    }
  });
}