$(document).ready(initialize);

function initialize(){
  $(document).foundation();
  $('*').on('keypress', keyHandler);
}

function keyHandler(e) {
  var keyCode = e.which;
  var key = String.fromCharCode(keyCode);
  console.log(key);
}
var game = {};
game.columns = 5;//game.columns;
game.rows = 6;//game.rows;
//#gameBoard

//function buildGameBoard(game.columns, game.rows){
for(var i = 0; i < game.rows; i++){
  var $tr = $('<tr></tr>').attr('data-y', i);
  for(var a = 0; a < game.columns; a++){
    var $td = $('<td></td>').attr('data-x', a);
    $($tr).append($td);
  };
  $('#gameBoard').append($tr);
};

