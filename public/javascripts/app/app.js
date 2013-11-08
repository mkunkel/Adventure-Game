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