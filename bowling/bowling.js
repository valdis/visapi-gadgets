/* 

A bowling score table, using the Google Visalization API.

Data Format
  An even number of columns, all are numbers.
  Column 0 is the number of pins hit by the first throw of player 1.
  Column 1 is the number pins hit by the second throw of player 1.
  Then 2 columns for player 2 etc.
  The player names of the labels of columns 0, 2, 4 etc.
  The number of rows can be up to 12.

Configuration options:
  none

Methods
  none

Events
  none

*/

Bowling = function(container) {
  this.container = container;
};

Bowling.prototype.escapeHtml = function(text) {
  if (text == null) {
    return '';
  }
  return text.replace(/&/g, '&amp;').
      replace(/</g, '&lt;').
      replace(/>/g, '&gt;').
      replace(/"/g, '&quot;');
};

Bowling.prototype.draw = function(data, options) {
  // Validate data format
  var columns = data.getNumberOfColumns();
  var isValid = columns > 0;
  var noPlayers = Math.ceil(columns / 2);
  
  // Handle spreadsheet case of only headers which is treated as string columns
  if (isValid && data.getNumberOfRows() == 1) {
    if (data.getColumnType(0) != 'number') {
      // One row of strings, use strings as labels, no values
      var data2 = new google.visualization.DataTable();
      for (var c = 0; c < columns; c++) {
        data2.addColumn('string', String(data.getValue(0, c)));
      }
      data = data2;
    } else {
      // Check for mixed numbers and strings, set strings to null
      for (var c = 0; c < columns; c++) {
        if (data.getColumnType(c) != 'number') {
          data.setValue(0, c, null);
        }  
      }
    }
  }
  
  if (isValid && data.getNumberOfRows() > 1) {
    if (columns % 2 != 0) {
      isValid = false;
    }
    for (var i = 0; isValid && i < columns; i++) {
      if (data.getColumnType(i) != 'number') {
        isValid = false;
      }
    }
  }
  
  if (!isValid) {
    this.container.innerHTML = 'Bowling Error: Invalid data format. Expecting an even number of columns, all are numbers';
    return;
  }

  var turnPlayer = -1;
  var turnRow = -1;
  var validRows = [];
  // Collect all valid hits until end of turn or end of game
  var rowLimit = 10;
  for (var i = 0; i < rowLimit && turnPlayer < 0; i++) {
    var row = [];
    validRows.push(row);
    for (var player = 0; player < noPlayers && turnPlayer < 0; player++) {
      var v1 = null;
      var v2 = null;
      if (i < data.getNumberOfRows()) {
        v1 = data.getValue(i, player * 2);
        v2 = data.getValue(i, player * 2 + 1);
      }
      var throw1 = null, throw2 = null;
      var canPlay = i < 10;
      if (i >= 10) {
        var tenthThrow = validRows[9][player];
        if (tenthThrow.first == 10) {  
          // Strike at round 10
          canPlay = (i == 10) || (i == 11 && validRows[10][player].first == 10);
        } else if (tenthThrow.first + tenthThrow.second == 10) {  
          // Spare at round 10
          canPlay = (i == 10 && v1 == null);
        }
      }
      if (v1 != null) {
        throw1 = Math.min(10, Math.max(0, Math.floor(v1)));
        if (throw1 == 10 && (i == 9 || (i == 10 && validRows[9][player].first == 10))) {
          rowLimit = i + 2; // In tenth/eleventh, strike means one more turn
        }
        if (v2 != null && throw1 < 10) { 
          throw2 = Math.min(10, Math.max(0, Math.floor(v2)));
          throw2 = Math.min(throw2, 10 - throw1);
          if (i == 9 && (throw1 + throw2) == 10) {
            rowLimit = i + 2; // In tenth, spare means one more turn
          }
        }
      }
      row[player] = {first: throw1, second: throw2};
      if (canPlay && (throw1 == null || (i <= 10 && throw1 < 10 && throw2 == null))) {
        turnPlayer = player;
        turnRow = i;
      }
    }
  }

  // Calculate scores
  var scores = [];
  for (player = 0; player < noPlayers; player++) {
    var score = 0;
    for (var i = 0; i < Math.min(10, validRows.length); i++) {
      var turnData = validRows[i][player];
      var first = turnData && turnData.first;
      var second = turnData && turnData.second;
      if (first != null && (player != turnPlayer || i != turnRow)) {
        second = second || 0;
        var total = first + second;
        if (total < 10) {
          score += total;
        } else {
          if (first == 10) {
            // Strike
            turnData = validRows[i + 1] && validRows[i + 1][player];
            first = turnData && turnData.first;
            if (first == 10) {
              // Strike after strike
              turnData = validRows[i + 2] && validRows[i + 2][player];
              second = turnData && turnData.first;
            } else {
              second = turnData && turnData.second;
            }
            if (first != null && second != null) {
              score += 10 + first + second;
            }
          } else {
            // Spare
            turnData = validRows[i + 1] && validRows[i + 1][player];
            first = turnData && turnData.first;
            if (first != null) {
              score += 10 + first;
            }
          }
        }
      }
    }
    scores.push(score);
  }

  // Draw the result
  var html = [];
  html.push('<table class="bowling-table">');

  // Player names
  html.push('<tr><td class="bowling-td"><img src="http://visapi-gadgets.googlecode.com/svn/trunk/bowling/bowling.png" width="25" height="24" /></td>');
  for (player = 0; player < noPlayers; player++) {
    var className = "bowling-td bowling-name";
    if (player == turnPlayer) {
      className += " bowling-turn";
    }
    var name = data.getColumnLabel(player * 2);
    html.push('<td class="', className, '">', this.escapeHtml(name || '?'), '</td>');
  }
  html.push('</tr>');

  // Games
  for (i = 0; i < Math.max(10, validRows.length); i++) {
    var row = validRows[i];
    html.push('<tr><td class="bowling-td bowling-seq">', (i + 1), '</td>');
    for (player = 0; player < noPlayers; player++) {
      var className = 'bowling-td';
      if (player == turnPlayer && i == turnRow) {
        className += ' bowling-turn';
      }
      html.push('<td class="', className, '">');
      var throws = '';
      var turnData = validRows[i] && validRows[i][player];
      var first = turnData && turnData.first;
      var second = turnData && turnData.second;
      if (first != null) {
        if (first == 10) {
          html.push('X<br /><span class="bowling-note">Strike!</span>');
        } else {
          html.push(first > 0 ? first : '-');
          if (second != null) {
            html.push('&nbsp;&nbsp;&nbsp;');
            if (first + second == 10) {
              html.push('/<br /><span class="bowling-note">spare</span>');
            } else {
              html.push(second > 0 ? second : '-');
            }
          }
        }
      }
      html.push('</td>');
    }
    html.push('</tr>');
  }

  // Total scores
  html.push('<tr><td class="bowling-td bowling-seq">Total</td>');
  for (player = 0; player < noPlayers; player++) {
    className = "bowling-td bowling-score";
    html.push('<td class="', className, '">', scores[player], '</td>');
  }
  html.push('</tr>');

  html.push('</table>');
  this.container.innerHTML = html.join('');
}
