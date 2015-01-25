'use strict';

var Cave = require('./cave'),
  Maze = require('./maze'),
  utils = require('../utils');

var Room = module.exports = function(type, size, biome) {
  this.type = type || 'maze';
  this.size = size || 15;
  this.biome = biome || 'forest';
  this.state = null;
  this.map = null;
  this.name = null;
};

Room.prototype.init = function() {
  this.name = utils.generateRandomName();
  this.map = this.type === 'maze' ? new Maze(this.size) : new Cave(this.size);
  this.map.generate();
  return this;
};

Room.prototype.saveState = function(state) { // is this needed ?
  this.state = state;
};
