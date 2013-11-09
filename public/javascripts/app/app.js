$(document).ready(initialize);

function initialize(){
  $(document).foundation();
  $('html').on('keydown', keyHandler);
  $('form#newGameForm').on('submit', startNewGame);
}

//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
//-----HANDLERS---------------------------------------------------------------------------

function startNewGame(e){
  // this is the form that posted
  submitAjaxForm(e, this, function(data, form){
    console.log(data);
  });
}

function keyHandler(e) {
  if (!$('#newGameForm').is(':hidden')) { return e }
  var keyCode = e.which;
  var key = String.fromCharCode(keyCode);
  // based on direction, sendMove(x, y)
  // on server, add these coords to current position
  // to determine new position
  switch (key.toUpperCase()) {
  case 'Q': // Up/Left
    sendMove(e, -1, -1);
    break;
  case 'W': // Up
    sendMove(e, 0, -1);
    break;
  case 'E': // Up/Right
    sendMove(e, 1, -1);
    break;
  case 'A': // Left
    sendMove(e, -1, 0);
    break;
  case 'D': // Right
    sendMove(e, 1, 0);
    break;
  case 'Z': // Down/Left
    sendMove(e, -1, 1);
    break;
  case 'X': // Down
    sendMove(e, 0, 1);
    break;
  case 'C': // Down/Right
    sendMove(e, 1, 1);
  }
  // console.log(key);
}


//---------------------------------------------------------------//
//---------------dummy variables for building board--------------//
//---------------------------------------------------------------//
var game = {};
game.columns = 4;//game.columns;
game.rows = 4;//game.rows;
game.stationaryPieces = [{type: 'princess', position: {x: 1, y: 2}}, {type: 'treasure', position: {x: 2, y: 3}}, {type: 'exit', position: {x: 3, y: 4}}];
game.movingPieces = [{type: 'death', position: {x: 1, y: 1}}, {type: 'ghost', position: {x: 2, y: 2}}, {type: 'wormhole', position: {x: 3, y: 3}}];
game.person = {};
game.person.position = {x: 3, y: 1};
buildGameBoard();
//#gameBoard

//---------------------------------------------------------------//
//-----------uncomment 'function' when model is ready------------//
//---------------------------------------------------------------//
function buildGameBoard(){
  for(var i = 0; i < game.rows; i++){
    var $tr = $('<tr></tr>').attr('data-y', i);
    for(var a = 0; a < game.columns; a++){
      var $td = $('<td></td>').attr('data-x', a);
      $($tr).append($td);
    }
    $('#gameBoard').append($tr);
  }
  htmlUpdatePieces();
}

function htmlUpdatePieces(){
  //affix person to board:
  var $square = $('tr[data-y="' + game.person.position.y + '"] td[data-x="' + game.person.position.x + '"]');
  var $person = $('<img class="piece" src="../images/person.png"/>');
  $square.append($person);
  //affix moving pieces to board:
  for(var i = 0; i < game.movingPieces.length; i++){
    var $square = $('tr[data-y="' + game.movingPieces[i].position.y + '"] td[data-x="' + game.movingPieces[i].position.x + '"]');
    var $piece = $('<img class="piece" src="../images/'+ game.movingPieces[i].type +'.png"/>');
    $square.append($piece);
  };
  //affix stationary pieces to board:
  for(var i = 0; i < game.stationaryPieces.length; i++){
    var $square = $('tr[data-y="' + game.stationaryPieces[i].position.y + '"] td[data-x="' + game.stationaryPieces[i].position.x + '"]');
    var $piece = $('<img src="../images/' + game.stationaryPieces[i].type +'.png"/>').addClass('piece');
    $square.append($piece);
  };

}
//---------------------------------------------------------------//
//---------------------------------------------------------------//
//---------------------------------------------------------------//

//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
//-----MAIN-FUNCTIONS---------------------------------------------------------------------


function sendMove(event, x, y) {
  var data = { x: x, y: y, gameId: null, personID: null };

  sendGenericAjaxRequest('/', data, 'POST', 'PUT', event, updateBoard);
}

//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
//------HTML-FUNCTIONS--------------------------------------------------------------------

function updateBoard(data) {
  // Gets called when server responds to sendMove
  console.log(data);
}


//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
//------AJAX-FUNCTIONS--------------------------------------------------------------------

function submitAjaxForm(event, form, fn) {
  // debugger;
  console.log(event);
  console.log(form);
  var url = $(form).attr('action');
  var data = $(form).serialize();

  var options = {};
  options.url = url;
  options.type = 'POST';
  options.data = data;
  console.log('data = ' + options.data);
  options.success = function(data, status, jqXHR){
    console.log('success');
    fn(data, form);
  };
  options.error = function(jqXHR, status, error){
    console.log(error);
  };
  $.ajax(options);

  event.preventDefault();

}

function sendGenericAjaxRequest(url, data, verb, altVerb, event, fn){
  var options = {};
  options.url = url;
  options.type = verb;
  options.data = data;
  options.success = function(data, status, jqXHR){
    fn(data);
  };
  options.error = function(jqXHR, status, error){console.log(error);};

  if(altVerb) options.data._method = altVerb;
  $.ajax(options);
  if(event) event.preventDefault();
}

