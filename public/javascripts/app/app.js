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
    //clear contents of user form
    $('input[name=playerName]').val('');
    $('input[name=rows]').val('');
    $('input[name=columns]').val('');

    //hide last game's win or loss message
    $('#winLoseMessage').remove();

    //hide user form, adjust header columns
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

  $('#healthOuter').show();
  $('#checkboxes').show();

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
    // htmlAnimateMove($(game.movingPieces[i].type));
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

function htmlAnimateMove($old) {
  // var $old = $('#cell1 img');
  //First we copy the arrow to the new table cell and get the offset to the document
  var $new = $old.clone().appendTo('#cell2');
  var newOffset = $new.offset();
  //Get the old position relative to document
  var oldOffset = $old.offset();
  //we also clone old to the document for the animation
  var $temp = $old.clone().appendTo('body');
  //hide new and old and move $temp to position
  //also big z-index, make sure to edit this to something that works with the page
  $temp
    .css('position', 'absolute')
    .css('left', oldOffset.left)
    .css('top', oldOffset.top)
    .css('zIndex', 1000);
  $new.hide();
  $old.hide();
  //animate the $temp to the position of the new img
  $temp.animate( {'top': newOffset.top, 'left':newOffset.left}, 'slow', function(){
    //callback function, we remove $old and $temp and show $new
    $new.show();
    $old.remove();
    $temp.remove();
  });
}

function htmlUpdateHealth(health) {
  var original = $('td').length;
  // console.log(health / original);
  $('#healthInner').css('width', ((health / original) * 100) + '%');
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
  // remove board squares, hide health bar, checkboxes.
  $('#gameBoard').children().remove();
  $('#healthOuter').hide();
  $('#princessFound, #treasureFound').prop('checked', false); // will uncheck the checkbox with id check1
  $('#checkboxes').hide();

  // show New Game form
  $('#headColumn').removeClass('small-12').addClass('small-9');
  $('#formColumn').addClass('small-3');
  $('#formColumn').show();

  //display Won or Lost message
  var message = '<h1 class="small-12 columns"></h1>';
  var $message = $(message);
  if(game.didWin){
    $message.text('Congratulations, you won!');
  } else {
    $message.text('You lost, better luck next time.');
  }
  var $row = $('<div class="row" id="winLoseMessage"></div>');
  $row.append($message);
  $('body').append($row);
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

