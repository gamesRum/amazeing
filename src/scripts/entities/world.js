'use strict';

var tiles = require('../tiles'),
  utils = require('../utils');

var World = module.exports = function(size) {
  this.size = size || 64;
};

/*
 * @desc this method should be overwritten
 * @return []
 */
World.prototype.generate = function() {
  throw 'World.prototype.generateEmpty should be overwritten on ' + this.constructor;
};

/*
 * @desc this method should be overwritten
 * @return []
 */
World.prototype.getPlayerSpawnPoint = function() {
  throw 'World.prototype.generateEmpty should be overwritten on ' + this.constructor;
};

/*
 * @desc generates an empty and nonWalkable map
 * @param int size - size of map
 * @return []
 */
World.prototype.generateEmpty = function(size) {
  var map = [];
  size = size || this.size;
  for (var i = 0; i < size; i += 1) {
    map[i] = [];
    for (var j = 0; j < size; j += 1) {
      map[i][j] = tiles.nonWalkable;
    }
  }
  return map;
};

/*
 * @desc iterates over the map
 * @param function perItem - callback that receives current item, index-i, index-j
 * @param function perLine - callback that receives the complete row, index-i
 */
World.prototype.iterate = function(perItem, perLine) {
  var size = this.size, i, j;
  if (!perItem) {
    return;
  }
  for (i = 0; i < size; i += 1) {
    (perLine || utils.fnK).call(this, this.map[i], i);
    for (j = 0; j < size; j += 1) {
      perItem.call(this, this.map[i][j], i, j);
    }
  }
};

/*
 * @desc prints the map on console
 */
World.prototype.print = function() {
  var line = [];
  this.iterate(function(item) {
    line.push(item);
  }, function() {
    console.log(line.join(''));
    line = [];
  });
  console.log(line.join(''));
};

/*
 * @desc get a random coordinates within the map avoiding borders
 * @return object - coordinates of random cell
 */
World.prototype.getRandomCell = function() {
  var row = utils.randomInt(this.size - 2, 1);
  while (row % 2 === 0) {
    row = utils.randomInt(this.size - 2, 1);
  }
  var column = utils.randomInt(this.size - 2, 1);
  while (column % 2 === 0) {
    column = utils.randomInt(this.size - 2, 1);
  }
  return {
    row: row,
    column: column
  };
};
