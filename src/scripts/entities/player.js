'use strict';

var Being = require('./being');

var Player = module.exports = function(hp, name, genre) {
  Being.call(this);
  this.stats.hp = hp;
  this.name = name;
  this.genre = genre;
};

Player.prototype = Object.create(Being.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  Being.call(this);
};

Player.prototype.attack = function(entity) {
  console.log('Attacking:', entity);
  return entity.damage(this.stats.str);
};