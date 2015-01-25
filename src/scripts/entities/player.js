'use strict';

var Being = require('./being');

var Player = module.exports = function(hp, name, genre) {
  Being.call(this);
  this.stats.hp = hp;
  this.race = 'human';
  this.name = name;
  this.genre = genre;
  this.orientation = null;
};

Player.prototype = Object.create(Being.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  Being.call(this);
};

Player.prototype.attack = function(entity) {

  if(entity.damage(this.stats.str)) {
    if(!entity.isAlive()) {
      this.stats.money += entity.stats.money;
    }

    return true;
  }

  return false;
};