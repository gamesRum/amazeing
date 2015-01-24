'use strict';

var Mapa = require('./mapa'),
  tiles = require('../tiles'),
  utils = require('../utils');

var Maze = module.exports = function(size, corridorSize) {
  Mapa.call(this, size);
  this.corridorSize = corridorSize || 1;
};

Maze.prototype = Object.create(Mapa.prototype);
Maze.prototype.constructor = Maze;

/*
 * @desc generates an maze type map
 * @return bool - success or failure
 */
Maze.prototype.generate = function() {
  this.map = this.generateEmpty();

  var startPoint = this.getRandomCell();
  this.map[startPoint.row][startPoint.column] = tiles.walkable;

  this.generateOneStep(startPoint.row, startPoint.column);
  // Growth code goes here...

  this.addDoors();
  return true;
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

/*
 * @desc insert into map one enter and one exit
 */
Maze.prototype.addDoors = function() {
  var enter, exit;

  enter = this.getRandomCell();
  exit = this.getRandomCell();

  this.enter = {
    row: enter.row,
    column: enter.column
  };

  this.map[enter.row][enter.column] = tiles.enter;
  this.map[exit.row][exit.column] = tiles.exit;
};
