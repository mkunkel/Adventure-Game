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
    $('#formColumn').hide().removeClass('small-3');
    $('#headColumn').addClass('small-12').removeClass('small-9');
    buildGameBoard(data);
  });
}

function keyHandler(e) {
  if (!$('#newGameForm').is(':hidden')) { return e }
  var keyCode = e.which;
  var key = String.fromCharCode(keyCode);
  // based on direction, sendMove(x, y)
  // on server, add these coords to current position
  // to determine new position

  var person = {};
  person.x = $('#person').closest('td').data('x');
  person.y = $('#person').closest('tr').data('y');
  var rows = $('tr').length - 1;
  var cols = ($('td').length / $('tr').length) - 1;
  switch (key.toUpperCase()) {
  case 'Q': // Up/Left
    if (person.x > 0 && person.y > 0) {sendMove(e, -1, -1);}
    break;
  case 'W': // Up
    if (person.y > 0) {sendMove(e, 0, -1);}
    break;
  case 'E': // Up/Right
    if (person.x < cols && person.y > 0) {sendMove(e, 1, -1);}
    break;
  case 'A': // Left
    if (person.x > 0) {sendMove(e, -1, 0);}
    break;
  case 'D': // Right
    if (person.x < cols) {sendMove(e, 1, 0);}
    break;
  case 'Z': // Down/Left
    if (person.x > 0 && person.y < rows) {sendMove(e, -1, 1);}
    break;
  case 'X': // Down
    if (person.y < rows) {sendMove(e, 0, 1);}
    break;
  case 'C': // Down/Right
    if (person.x < cols && person.y < rows) {sendMove(e, 1, 1);}
  }
  // console.log(key);
}


//---------------------------------------------------------------//
//---------------------------------------------------------------//
//---------------------------------------------------------------//
function buildGameBoard(game){
  $('#gameRow').show();
  for(var i = 0; i < game.rows; i++){
    var $tr = $('<tr></tr>').attr('data-y', i);
    for(var a = 0; a < game.columns; a++){
      var $td = $('<td></td>').attr('data-x', a);
      $($tr).append($td);
    }
    $('#gameBoard').append($tr).data('id', game._id);
  }
  htmlPlacePieces(game);
  htmlUpdateHealth(game.person.health);
}

function htmlPlacePieces(game){
  //affix person to board:
  var $square = $('tr[data-y="' + game.person.position.y + '"] td[data-x="' + game.person.position.x + '"]');
  var $person = $('<img class="piece" id="person" src="../images/person.png"/>');
  $square.append($person);

  //affix moving pieces to board:
  for(var i = 0; i < game.movingPieces.length; i++){
    var $square = $('tr[data-y="' + game.movingPieces[i].position.y + '"] td[data-x="' + game.movingPieces[i].position.x + '"]');
    var $piece = $('<img class="piece" src="../images/'+ game.movingPieces[i].type +'.png"/>');
    $piece.addClass(game.movingPieces[i].type);
    $square.append($piece);
  }
  //affix stationary pieces to board:
  for(var i = 0; i < game.stationaryPieces.length; i++){
    var $square = $('tr[data-y="' + game.stationaryPieces[i].position.y + '"] td[data-x="' + game.stationaryPieces[i].position.x + '"]');
    var $piece = $('<img src="../images/' + game.stationaryPieces[i].type +'.png"/>').addClass('piece');
    $piece.addClass(game.stationaryPieces[i].type);
    $square.append($piece);
  }
  htmlUpdateHealth(game.person.health);//does this need to be called both here
  //and at the end of the function that calls this function (buildGameBoard)?//
}

function htmlUpdatePieces(game) {
  var $person = $('#person').detach();
  $('tr[data-y="' + game.person.position.y + '"] td[data-x="' + game.person.position.x + '"]').append($person);
  for (var i = 0; i < game.movingPieces.length; i++) {
    $(game.movingPieces[i].type).detach().append('tr[data-y="' + game.movingPieces[i].position.y + '"] td[data-x="' + game.movingPieces[i].position.x + '"]');
  }

  for(var i = 0; i < game.stationaryPieces.length; i++){
    if (game.stationaryPieces[i].type === 'princess' || game.stationaryPieces[i].type === 'treasure') {
      var $square = $('tr[data-y="' + game.stationaryPieces[i].position.y + '"] td[data-x="' + game.stationaryPieces[i].position.x + '"]');
      var $piece = $('<img src="../images/' + game.stationaryPieces[i].type +'.png"/>').addClass('piece');
      $piece.addClass(game.stationaryPieces[i].type);
      $square.append($piece);
    }
  }

  htmlUpdateHealth(game.person.health);
  htmlUpdateBoard(game);
}

function htmlUpdateHealth(health) {
  var original = $('td').length;
  // console.log(health / original);
  $('#healthInner').css('width', ((health / original) * 100) + '%');
  console.log($('#healthInner').css('width') + ', ' + health);
}

//---------------------------------------------------------------//
//---------------------------------------------------------------//
//---------------------------------------------------------------//

//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
//-----MAIN-FUNCTIONS---------------------------------------------------------------------


function sendMove(event, x, y) {
  var data = { x: x, y: y, id: $('#gameBoard').data('id')};

  sendGenericAjaxRequest('/', data, 'POST', 'PUT', event, isGameOver);
}

function isGameOver(game){
  if(!game.gameOver){
    htmlUpdatePieces(game);
  } else {
    endTheGame(game);
  }
}

function endTheGame(game){
  alert('Game is over.');
  console.log(game);
  $('#gameBoard').children().remove();
  $('#gameRow').hide();
}

//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
//------HTML-FUNCTIONS--------------------------------------------------------------------

function htmlUpdateBoard(game) {
  // Gets called when server responds to sendMove
  if(game.foundPrincess){
    $('#princessFound').prop('checked', true);
  }
  if(game.foundTreasure){
    $('#treasureFound').prop('checked', true);
  }
  // gameOver is checked in isGameOver function.
}


//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
//------AJAX-FUNCTIONS--------------------------------------------------------------------

function submitAjaxForm(event, form, fn) {
  // debugger;
  // console.log(event);
  // console.log(form);
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

