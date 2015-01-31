'use strict';

var Being = require('./being');

var Player = module.exports = function(hp, name, genre) {
  Being.call(this);
  this.health = hp;
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

Player.prototype.damage = function(str) {
  if(this.stats.hp) {
    var hit = (str * 2) - Math.round(this.stats.def * 0.5);

    if(hit > 0) {
      this.stats.hp = this.stats.hp - hit;
    }

    if(this.stats.hp < 0) {
      this.stats.hp = 0;
    }

    return true;
  }

  return false;
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