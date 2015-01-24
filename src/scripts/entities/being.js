'use strict';

var Being = module.exports = function(maxHP, money, bagLength) {
  this.maxHP = maxHP || 10;
  this.hp = this.maxHP;
  this.money = money || 0;
  this.bag = [];
  this.bagLength = bagLength || 10;
};

Being.prototype.update = function() {
  if (this.hp <= 0) {
    this.die();
  }
};

Being.prototype.move = function() {};

Being.prototype.die = function() {};

Being.prototype.drop = function() {};

Being.prototype.attack = function() {};
