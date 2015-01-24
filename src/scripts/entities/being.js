'use strict';

var Being = module.exports = function(maxHP, maxSP, money, bagSize) {
  this.bag = {
    items: [],
    size: bagSize || 10
  };

  this.animating = false;

  this.inventory= {
    body: null,
    head: null,
    ring: null,
    shield: null,
    weapon: null
  };

  this.location= {
    x: 1,
    y: 1
  };

  this.moving = false;
  this.sprite = null;
  this.stats =  {
    level: 0,
    maxHP: maxHP || 10,
    maxSP: maxSP || 10,
    money: money || 0,
    hp: maxHP || 10,
    sp: maxSP || 10
  };

  this.height= 32;
  this.width= 32;
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
