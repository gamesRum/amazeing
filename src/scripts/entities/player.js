'use strict';

var Being = require('./being');

var Player = module.exports = function(hp, name, genre) {
  Being.call(this);
  this.stats.hp = hp;
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
    console.log('Attacking:', entity);

    if(!entity.isAlive()) {
      console.log('You have killed an ', entity.name, ', earned $', entity.stats.money);
      this.stats.money += entity.stats.money;
    }
  }

  return false;
};