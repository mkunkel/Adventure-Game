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
    game.person.position.x += parseInt(req.body.x, 10);
    game.person.position.y += parseInt(req.body.y, 10);
    game = checkCollisions(game.person.position.x, game.person.position.y, game);
    // isGameEnding correctly assigns game.didWin and game.gameOver
    game = isGameEnding(game);
    game = shuffleBoardSquaresArray(game);  // trying to call the function below to randomize pieces
    game.markModified('person');
    game.markModified('movingPieces');
    game.save(function(err, saveGame){
      saveGame = hidePrincessAndGold(saveGame);
      res.send(saveGame); // req.body contains {x:n, y:n, id:___}, where n is -1, 0, or 1
    });
  });
}

function checkCollisions(x, y, game) {
  var collisions = [];
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
    // If it is a ghost subtract ghost.effect from health.
    if (collisions[n].effect) {game.person.health += collisions[n].effect;}

    switch(collisions[n].type) {
    case 'death':
      game.person.health = 0;
      break;
    case 'princess':
      game.foundPrincess = true;
      break;
    case 'treasure':
      game.foundTreasure = true;
      break;
    case 'wormhole':
      // give person a new random position when they move onto a wormhole.
      game.person.position.x = Math.floor(Math.random() * game.columns);
      game.person.position.y = Math.floor(Math.random() * game.rows);
      break;
    case 'exit':
      // game.Gameover is assigned here for exit, and is assigned in isGameEnding for health
      game.gameOver = true;
      break;
    }

    // console.log(collisions[n].type + ', ' + collisions[n].effect);
  }
  // console.log('return ' + game.person.health);
  return game;
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

//This function is basically from the model prehook - It's not working, maybe someone could take a look at it.

function shuffleBoardSquaresArray(game){
  var columns = game.columns;
  var rows = game.rows;

  var squaresArray = [];
  for(var x = 0; x < columns; x++){
    for(var y = 0; y < rows; y++){
      squaresArray.push([x, y]);
    }
  }

  for (var i = 0; i < game.movingPieces.length; i++) {
    game.movingPieces[i].position.x = squaresArray[i][0];
    game.movingPieces[i].position.y = squaresArray[i][1];
    console.log(game.movingPieces[i].type + ' - ' + game.movingPieces[i].position.x + ', ' + game.movingPieces[i].position.y);
  }

  // var stationaryPositions = [];
  // for(var i=0; i< game.stationaryPieces.length; i++){
  //   var stationaryPosition = [game.stationaryPieces[i].position.x, game.stationaryPieces[i].position.y];
  //   stationaryPositions.push(stationaryPosition);
  // }

  // for(var i = 0; i < stationaryPositions.length; i++){
  //   var removePosition = _.find(squaresArray, function(){stationaryPositions[i];});
  //     // console.log('outcome of looping = ' + removePosition);
  // }
  return game;
}
  // console.log('whats in the db for array[0] x value if this code is right: ' + game.stationaryPieces[0].position.x);

  // console.log('stationaryPositions array = ' + stationaryPositions);
//   squaresArray = _.shuffle(squaresArray);
//   _.findby
//   var death = {type: 'death', position: {x: squaresArray[0][0], y: squaresArray[0][1]}};
//   var wormhole1 = {type: 'wormhole', position: {x: squaresArray[0][2], y: squaresArray[1][0]}};
//   var wormhole2 = {type: 'wormhole', position: {x: squaresArray[1][1], y: squaresArray[1][2]}};
//   var numberOfGhosts = Math.ceil((rows * columns) / 10);
//   game.movingPieces.push(death, wormhole1, wormhole2);
//   for(var z = 0; z < numberOfGhosts; z++){
//     var ghost = {type: 'ghost', position: {x: allBoardSquaresArray[z+7][0], y: allBoardSquaresArray[z+7][1]}, effect: -5};
//     game.movingPieces.push(ghost);
//   }
// });

function isGameEnding(game){
  // game.Gameover is assigned here for health and it is assigned for landing on exit in the checkCollisions function
  if (game.person.health <= 0) {
    game.gameOver = true;
  }

  // if the game is over, determine whether won or lost (e.g. game.didWin)
  if(game.gameOver === true){
    game.didWin = (game.person.health > 0) && game.foundPrincess && game.foundTreasure;
  }

  return game;
}
