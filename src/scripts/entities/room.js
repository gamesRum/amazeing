'use strict';

var cave = require('./cave'),
  maze = require('./maze'),
  utils = require('../utils');

var Room = module.exports = function(size) {
  this.size = size || 64;
  this.wasGenerated = false;
};

/*
 * boolean Generate
 * type - string['maze','labyrinth','cave']
 * >> returns if map was generated successfully
 */
Room.prototype.generate = function(type) {
  this.wasGenerated = false;

  if (type === 'maze' || type === 'labyrinth') {
    this.map = maze.generateMaze(this.size);
    this.wasGenerated = true;
  } else if (type === 'cave') {
    this.map = cave.generateCave(this.size, 2);
    this.wasGenerated = true;
  }

  return this.wasGenerated;
};

/*
 * void Iterate
 * perItem - function(var item, int index-x, int index-y)
 * perLine - function(line[], int index-y)
 */
Room.prototype.iterate = function(perItem, perLine) {
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
