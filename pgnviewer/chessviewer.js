/** 

A chess game viewer, using the Google Visualization API.

Data Format
  Two columns of string (text) data.
  Column 0 is the moves of the White.
  Column 1 is the moves of the Black.
  The number of rows is unlimited.
  
Configuration options:
  none
  
Methods
  none

Events
  none

*/

Chess = function(container) {
  this.container = container;
};

Chess.prototype.draw = function(data, options) {
  // Validate data format
  var columns = data.getNumberOfColumns();
  var isValid = columns == 2;
  
  if (!isValid) {
    this.container.innerHTML = 'Chess Error: Invalid data format. ' +
        'Expecting two columns, first with the White moves, second with the Black moves.';
    return;
  }

  var urlstr = '?AllowNullMove=0&SetBGColor=E0E0F6&SetBorder=1&SetPgnMoveText=';

  for (var r = 0; r < data.getNumberOfRows(); r++) {
    urlstr += (r + 1) + '.' + 
        data.getValue(r, 0) + ' ' +
        data.getValue(r, 1) + ' ';
  }
  
  this.container.src = 'http://www.lutanho.net/pgn/ltpgnboard.html'+urlstr;
  
}
