'use strict';

var tiles = require('../tiles');

var Map = module.exports = function(size) {
  this.size = size || 64;
};

/*
 * @desc generates an empty and nonWalkable map
 * @param int size - size of map
 * @return []
 */
Map.prototype.generateEmpty = function(size) {
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
Map.prototype.iterate = function(perItem, perLine) {
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

Map.prototype.print = function() {
  var size = this.size, line = [], i, j;
  for (i = 0; i < size; i += 1) {
    for (j = 0; j < size; j += 1) {
      line.push(this.map[i][j]);
    }
    console.log(line.join(''));
    line = [];
  }
};
