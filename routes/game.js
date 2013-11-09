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
    res.send(game);
  });
};

// PUT /
exports.move = function(req, res){
  console.log('game.move'.italic.underline.bold.yellow);


  Game.findById(req.body.id, function(err, game) {
    console.log('before-' + game.person.position.x + ', ' + game.person.position.y);
    console.log(req.body.x + ', ' + req.body.y);
    game.person.position.x += parseInt(req.body.x, 10);
    game.person.position.y += parseInt(req.body.y, 10);
    console.log('after-' + game.person.position.x + ', ' + game.person.position.y);
    checkCollisions(game.person.position.x, game.person.position.y, game._id);
    game.save(function(err, saveGame){
      console.log(saveGame);
      res.send(saveGame); // req.body contains {x:n, y:n, id:___}, where n is -1, 0, or 1
    });
  });

}

function checkCollisions(x, y, gameId) {
  var collisions = [];
  Game.findById(gameId, function(err, game){
    for (var i = 0; i < game.movingPieces.length; i++) {
      if (game.movingPieces[i].position.x === x && game.movingPieces[i].position.y === y) {
        collisions.push(game.movingPieces[i]);
      }
    }

    for (var a = 0; a < game.stationaryPieces.length; a++) {
      if (game.stationaryPieces[a].position.x === x && game.stationaryPieces[a].position.y === y) {
        collisions.push(game.stationaryPieces[a]);
      }
    }
    for (var n = 0; n < collisions.length; n++) {
      game.person.health += collisions[n].effect;
    }
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
