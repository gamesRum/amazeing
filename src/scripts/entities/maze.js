'use strict';

var Map = require('./map'),
  tiles = require('../tiles'),
  utils = require('../utils');

var Maze = module.exports = function(size, corridorSize) {
  Map.call(this, size);
  this.corridorSize = corridorSize || 1;
};

Maze.prototype = Object.create(Map.prototype);
Maze.prototype.constructor = Maze;

/*
 * @desc generates an maze type map
 * @return bool - success or failure
 */
Maze.prototype.generate = function() {
  this.map = this.generateEmpty();

  var startPoint = this.getStartPoint();
  this.map[startPoint.row][startPoint.column] = tiles.walkable;

  this.generateOneStep(startPoint.row, startPoint.column);
  // Growth code goes here...
  return true;
};

/*
 * @desc get a starting point within the map avoiding borders
 * @return object - coordinates of starting point
 */
Maze.prototype.getStartPoint = function() {
  var row = utils.randomInt(this.size - 1, 1);
  while (row % 2 === 0) {
    row = utils.randomInt(this.size - 1, 1);
  }
  var column = utils.randomInt(this.size - 1, 1);
  while (column % 2 === 0) {
    column = utils.randomInt(this.size - 1, 1);
  }
  return {
    row: row,
    column: column
  };
};

/*
 * @desc perform calculations to decide if cast a tile into walkable or not
 * @param int row - row where current step is located
 * @param int col - column where current step is located
 */
Maze.prototype.generateOneStep = function(row, col) {
  var randDirs = this.getRandomDirections(),
    size = this.size,
    map = this.map;
  for (var i = 0; i < randDirs.length; i += 1) {
    switch (randDirs[i]) {
      case 1: /* UP */
        if (row - 2 < 0) {
          continue;
        }
        if (map[row - 2][col] !== tiles.walkable) {
          map[row - 2][col] = tiles.walkable;
          map[row - 1][col] = tiles.walkable;
          this.generateOneStep(row - 2, col);
        }
        break;
      case 2: /* RIGHT */
        if (col + 2 > size - 1) {
          continue;
        }
        if (map[row][col + 2] !== tiles.walkable) {
          map[row][col + 2] = tiles.walkable;
          map[row][col + 1] = tiles.walkable;
          this.generateOneStep(row, col + 2);
        }
        break;
      case 3: /* DOWN */
        if (row + 2 > size - 1) {
          continue;
        }
        if (map[row + 2][col] !== tiles.walkable) {
          map[row + 2][col] = tiles.walkable;
          map[row + 1][col] = tiles.walkable;
          this.generateOneStep(row + 2, col);
        }
        break;
      case 4: /* LEFT */
        if (col - 2 <= 0) {
          continue;
        }
        if (map[row][col - 2] !== tiles.walkable) {
          map[row][col - 2] = tiles.walkable;
          map[row][col - 1] = tiles.walkable;
          this.generateOneStep(row, col - 2);
        }
        break;
    }
  }
};

/*
 * @desc generates a random sequence for numbers [1, 2, 3, 4]
 * @return int[] - random sequence
 */
Maze.prototype.getRandomDirections = function() {
  var seq = [1, 2, 3, 4];
  for (var j, x, i = seq.length; i; j = Math.floor(Math.random() * i), x = seq[--i], seq[i] = seq[j], seq[j] = x) {
    continue;
  }
  return seq;
};
