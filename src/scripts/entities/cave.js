'use strict';

var PathFinder = require('./pathFinder'),
  World = require('./world'),
  tiles = require('../tiles'),
  pathfinder = new PathFinder();

var Cave = module.exports = function(size, seed, smoothness) {
  World.call(this, size);
  this.seed = seed || Math.random();
  this.smoothness = smoothness || size / 10;

  if (this.smoothness > 10) {
    this.smoothness = 10;
  }
};

Cave.prototype = Object.create(World.prototype);
Cave.prototype.constructor = Cave;

/*
 * @desc generates an cave type map
 * @return bool - success or failure
 */
Cave.prototype.generate = function() {
  this.map = this.generateEmpty(this.size);

  while (this.getRatio() < 0.45) {
    this.iterate(function(cell, x, y) {
      this.map[x][y] = ~~this.seededRandom(2, 0);
    });

    this.polish(this.smoothness);
  }

  this.addDoors();
  return true;
};

/*
 * @desc iterates over all map and applies simple rules to polish edges
 */
Cave.prototype.polish = function() {
  var map = this.map,
    size = this.size,
    smoothness = this.smoothness;

  for (var i = 0; i < smoothness; i++) {
    this.iterate(function(cell, x, y) {
      var xRange = {
        low: Math.max(0, x - 1),
        high: Math.min(size - 1, x + 1)
      };
      var yRange = {
        low: Math.max(0, y - 1),
        high: Math.min(size - 1, y + 1)
      };
      var wallCount = 0;
      for (var a = xRange.low; a <= xRange.high; a++) {
        for (var b = yRange.low; b <= yRange.high; b++) {
          if (a === x && b === y) {
            continue;
          }
          wallCount += 1 - map[a][b];
        }
      }

      if (map[x][y] === 0 && wallCount >= 4 || map[x][y] === 1 && wallCount >= 5 ||
        x === 0 || y === 0 || x === size - 1 || y === size - 1) {
        map[x][y] = 0;
      } else {
        map[x][y] = 1;
      }
    });
  }
};

/*
 * @desc calculates ratio between walkable & nonWalkable tiles
 * @return int - ratio
 */
Cave.prototype.getRatio = function() {
  var walkables = 0;
  this.iterate(function(tile) {
    walkables += tile;
  });
  return walkables / (this.size * this.size);
};

/*
 * @desc generates a seeded random number in the range
 * @param int max - top limit
 * @param int min - bottom limit
 * @return int - a seeded random number
 */
Cave.prototype.seededRandom = function(max, min) {
  max = max || 1;
  min = min || 0;
  this.seed = (this.seed * 9301 + 49297) % 233280;
  var rnd = this.seed / 233280;
  return min + rnd * (max - min);
};

/*
 * @desc insert into map one enter and one exit
 */
Cave.prototype.addDoors = function() {
  var areLinked = false,
    enter = {},
    exit = {};

  while(!areLinked) {
    enter = this.getRandomCell();
    exit = this.getRandomCell();
    if (pathfinder.findPath(this.map, [enter.row, enter.column], [exit.row,exit.column]).length > 0) {
      areLinked = true;
    }
  }

  this.map[enter.row][enter.column] = tiles.enter;
  this.map[exit.row][exit.column] = tiles.exit;
};
