'use strict';

var Cave = require('./cave'),
  Maze = require('./maze');

var Room = module.exports = function(type, size) {
  this.type = type || 'maze';
  this.size = size || 65;
  this.state = {};
  this.map = null;
};

Room.prototype.init = function() {
  this.map = this.type === 'maze' ? new Maze(this.size) : new Cave(this.size);
  this.map.generate();
  return this;
};

Room.prototype.saveState = function(mobs, items) {
  this.state.mobs = mobs;
  this.state.items = items;
};

Room.prototype.getPlayerSpawnPoint = function() {
  return this.map.playerSpawnPoint();
};
