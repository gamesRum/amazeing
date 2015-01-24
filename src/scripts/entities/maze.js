'use strict';

var utils = require('../utils');

var walkable = 1,
  nonWalkable = 0;

module.exports = {
  generateMaze: function(size, corridorSize) {
    /* Generate blank map */
    var maze = [];
    for (var i = 0; i < size; i += 1) {
      maze[i] = [];
      for (var j = 0; j < size; j += 1) {
        maze[i][j] = nonWalkable;
      }
    }

    /* First point where our algorithm will start */
    var row = utils.nextInt(size);
    while (row % 2 === 0) {
      row = utils.nextInt(size);
    }
    var column = utils.nextInt(size);
    while (column % 2 === 0) {
      column = utils.nextInt(size);
    }
    maze[row][column] = 1;

    /* Start the magic, baby B-) */
    generateWorld(row, column, maze, size, size, 2);
    //maze = growIt(maze, corridorSize);
    return maze;
  }
};

function generateWorld(row, col, maze, size) {
  var randDirs = randomDirections();
  for (var i = 0; i < randDirs.length; i += 1) {
    switch (randDirs[i]) {
      case 1: // up
        if (row - 2 < 0) {
          continue;
        }
        if (maze[row - 2][col] !== 1) {
          maze[row - 2][col] = 1;
          maze[row - 1][col] = 1;
          generateWorld(row - 2, col, maze, size);
        }
        break;
      case 2: // right
        if (col + 2 > size - 1) {
          continue;
        }
        if (maze[row][col + 2] !== 1) {
          maze[row][col + 2] = 1;
          maze[row][col + 1] = 1;
          generateWorld(row, col + 2, maze, size);
        }
        break;
      case 3: // down
        if (row + 2 > size - 1) {
          continue;
        }
        if (maze[row + 2][col] !== 1) {
          maze[row + 2][col] = 1;
          maze[row + 1][col] = 1;
          generateWorld(row + 2, col, maze, size);
        }
        break;
      case 4: // left
        if (col - 2 <= 0) {
          continue;
        }
        if (maze[row][col - 2] !== 1) {
          maze[row][col - 2] = 1;
          maze[row][col - 1] = 1;
          generateWorld(row, col - 2, maze, size);
        }
        break;
    }
  }
}

function randomDirections() {
  function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }

  var randoms = [];
  for (var i = 0; i < 4; i += 1) {
    randoms.push(i + 1);
  }
  return shuffle(randoms);
}

