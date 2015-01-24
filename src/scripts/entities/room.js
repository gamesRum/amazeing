'use strict';

var Cave = require('./cave'),
  Maze = require('./maze');

var Room = module.exports = function(type, size) {
  this.type = type || 'maze';
  this.size = size || 65;
  this.state = null;
  this.map = null;
};

Room.prototype.init = function() {
  this.map = this.type === 'maze' ? new Maze(this.size) : new Cave(this.size);
  this.map.generate();
  return this;
};

Room.prototype.saveState = function(state) { // is this needed ?
  this.state = state;
};
