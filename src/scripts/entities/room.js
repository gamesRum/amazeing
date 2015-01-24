'use strict';

var Cave = require('./cave'),
  Maze = require('./maze');

var Room = module.exports = function(type, size) {
  this.type = type || 'maze';
  this.size = size || 65;
};

Room.prototype.init = function() {
  this.world = this.type === 'maze' ? new Maze(this.size) : new Cave(this.size);
  this.world.generate();
};

Room.prototype.getPlayerSpawnPoint = function() {
  return this.world.playerSpawnPoint();
};
