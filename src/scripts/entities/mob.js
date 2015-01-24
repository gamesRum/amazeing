'use strict';

var Being = require('./being');

var Mob = module.exports = function(x, y, money, level, bounds, sprite, walkable) {
  Being.call(this);
  this.stats.money = money;
  this.stats.level = level;
  this.bounds = bounds;
  this.sprite = sprite;
  this.location.x = x;
  this.location.y = y;
  this.walkable = walkable;
  this.orientation = 0;
  this.chooseOrientation();
};

Mob.prototype = Object.create(Being.prototype);
Mob.prototype.constructor = Mob;

Being.prototype.update = function() {
  Being.call(this);
};

Being.prototype.chooseOrientation = function() {
  this.orientation = Math.floor(Math.random() * 4);
};

Being.prototype.chooseNextMove = function() {
  var locationBackup = this.location;

  switch(this.orientation) {
    case 0:
      this.location.y++;
      break;
    case 1:
      this.location.y--;
      break;
    case 2:
      this.location.x++;
      break;
    default:
      this.location.x--;
  }

  if(this.location.x < 0) {
    this.location.x = 0;
  }

  if(this.location.y < 0) {
    this.location.y = 0;
  }

  if(this.location.x > this.bounds.x-1) {
    this.location.x = this.bounds.x-1;
  }

  if(this.location.y > this.bounds.y-1) {
    this.location.y = this.bounds.y-1;
  }

  if(this.walkable[this.location.x][this.location.y]) {
    this.sprite.position.x = this.location.x * 32;
    this.sprite.position.y = this.location.y * 32;
  } else {
    this.location = locationBackup;
    this.chooseOrientation();
  }

};
