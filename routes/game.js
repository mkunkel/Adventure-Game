var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var _ = require('lodash');

var colors = require('colors');
var mongoose = require('mongoose');
var Game = mongoose.model('Game');
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
    game = hidePrincessAndGold(game);
    console.log("Game before res.send");
    console.log(game);
    res.send(game);
  });
};

// PUT /
exports.move = function(req, res){
  console.log('game.move'.italic.underline.bold.yellow);


  res.send(req.body); // req.body contains {x:n, y:n, gameId:___, personId:___}, where n is -1, 0, or 1
  Person.findById(req.body.id, function(err, person) {
    person.position.x += req.body.x;
    person.position.y += req.body.y;
    checkCollisions(person.position.x, person.position.y, gameId);
  });

}

function checkCollisions(x, y, gameId) {
  var collisions = [];
  Game.findById(gameId).populate('movingPieces').populate('stationaryPieces').exec(function(err, game){
    for (var i = 0; i < game.movingPieces.length; i++) {
      if (game.movingPieces[i].position.x === x && game.movingPieces[i].position.y === y) {
        collisions.push(game.movingPieces[i]);
      }

      if (game.stationaryPieces[i].position.x === x && game.stationaryPieces[i].position.y === y) {
        collisions.push(game.stationaryPieces[i]);
      }
    }
    Person.findById(game.person, function(err, person) {
      for (var n = 0; n < collisions.length; n++) {
        person.health += collisions[n].effect;
      }
    });
  });
}

function hidePrincessAndGold(game){
  // This function checks to see whether princess and treasure have been found.
  // If they have not been found, they are removed from the game object passed back
  // to the browser (so that they will not be displayed on the gameboard.)
  if(!game.foundPrincess){
    var princess = _.remove(game.stationaryPieces, function(piece){return piece.type == 'princess';});
  }

  if(!game.foundTreasure){
    var treasure = _.remove(game.stationaryPieces, function(piece){return piece.type == 'treasure';});
  }
  return game;
}
