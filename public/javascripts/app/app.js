$(document).ready(initialize);

function initialize(){
  $(document).foundation();
  $('html').on('keydown', keyHandler);
}

function keyHandler(e) {
  var keyCode = e.which;
  var key = String.fromCharCode(keyCode);

  // based on direction, sendMove(x, y)
  // on server, add these coords to current position
  // to determine new position
  switch (key.toUpperCase()) {
  case 'Q': // Up/Left
    sendMove(-1, -1);
    break;
  case 'W': // Up
    sendMove(0, -1);
    break;
  case 'E': // Up/Right
    sendMove(1, -1);
    break;
  case 'A': // Left
    sendMove(-1, 0);
    break;
  case 'D': // Right
    sendMove(1, 0);
    break;
  case 'Z': // Down/Left
    sendMove(-1, 1);
    break;
  case 'X': // Down
    sendMove(0, 1);
    break;
  case 'C': // Down/Right
    sendMove(1, 1);
  }
}

function sendMove(x, y) {

}