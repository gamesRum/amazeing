'use strict';

var Map = require('./map'),
  tiles = require('../tiles'),
  utils = require('../utils');

var Maze = module.exports = function(size, corridorSize) {
  Map.call(this, size);
  this.corridorSize = corridorSize;
};

Maze.prototype = Object.create(Map.prototype);
Maze.prototype.constructor = Maze;

/*
 * @desc generates an maze type map
 * @return bool - success or failure
 */
Maze.prototype.generate = function() {
  this.map = this.generateEmpty();

  /* First point where our algorithm will start */
  var row = utils.randomInt(this.size - 1, 1);
  while (row % 2 === 0) {
    row = utils.randomInt(this.size - 1, 1);
  }
  var column = utils.randomInt(this.size - 1, 1);
  while (column % 2 === 0) {
    column = utils.randomInt(this.size - 1, 1);
  }
  this.map[row][column] = tiles.walkable;

  /* Start the magic, baby B-) */
  generateWorld(row, column, this.map, this.size);
  // add grow it here...
  return true;
};

function generateWorld(row, col, maze, size) {
  var randDirs = randomDirections();
  for (var i = 0; i < randDirs.length; i += 1) {
    switch (randDirs[i]) {
      case 1: // up
        if (row - 2 < 0) {
          continue;
        }
        if (maze[row - 2][col] !== tiles.walkable) {
          maze[row - 2][col] = tiles.walkable;
          maze[row - 1][col] = tiles.walkable;
          generateWorld(row - 2, col, maze, size);
        }
        break;
      case 2: // right
        if (col + 2 > size - 1) {
          continue;
        }
        if (maze[row][col + 2] !== tiles.walkable) {
          maze[row][col + 2] = tiles.walkable;
          maze[row][col + 1] = tiles.walkable;
          generateWorld(row, col + 2, maze, size);
        }
        break;
      case 3: // down
        if (row + 2 > size - 1) {
          continue;
        }
        if (maze[row + 2][col] !== tiles.walkable) {
          maze[row + 2][col] = tiles.walkable;
          maze[row + 1][col] = tiles.walkable;
          generateWorld(row + 2, col, maze, size);
        }
        break;
      case 4: // left
        if (col - 2 <= 0) {
          continue;
        }
        if (maze[row][col - 2] !== tiles.walkable) {
          maze[row][col - 2] = tiles.walkable;
          maze[row][col - 1] = tiles.walkable;
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

