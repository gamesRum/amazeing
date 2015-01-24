'use strict';

var Being = require('./being');

var Mob = module.exports = function(money) {
  Being.call(this);
  this.money = money;
};

Mob.prototype = Object.create(Being.prototype);
Mob.prototype.constructor = Mob;

Being.prototype.update = function() {
  Being.call(this);
};

Being.prototype.chooseNextMove = function() {};
