'use strict';

var Map = require('./map');

var Cave = module.exports = function(size, seed, smoothness) {
  Map.call(this, size);
  this.seed = seed || Math.random();
  this.smoothness = smoothness || size / 10;
};

Cave.prototype = Object.create(Map.prototype);
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
      var x_range = {
        low: Math.max(0, x - 1),
        high: Math.min(size - 1, x + 1)
      };
      var y_range = {
        low: Math.max(0, y - 1),
        high: Math.min(size - 1, y + 1)
      };
      var wall_count = 0;
      for (var a = x_range.low; a <= x_range.high; a++) {
        for (var b = y_range.low; b <= y_range.high; b++) {
          if ((a == x) && (b == y)) {
            continue;
          }
          wall_count += 1 - map[a][b];
        }
      }

      if (((map[x][y] == 0) && (wall_count >= 4)) || ((map[x][y] == 1) && (wall_count >= 5)) ||
        ((x == 0) || (y == 0) || (x == size - 1) || (y == size - 1))) {
        map[x][y] = 0;
      }
      else {
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