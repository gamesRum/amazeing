'use strict';

var Being = require('./being');

var Player = module.exports = function(gameInstance, properties) {
  Being.call(this, gameInstance);
  this.health = properties.hp;
  this.race = 'human';
  this.name = properties.name;
  this.genre = properties.genre;
  this.orientation = null;

  this.stats.money = properties.money;
  this.stats.maxHP = properties.maxHP;
  this.stats.str = properties.str;
  this.stats.def = properties.def;
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