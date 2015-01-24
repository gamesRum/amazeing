'use strict';

var Being = require('./being');

var Mob = module.exports = function(id, game, player, x, y, money, level, bounds, sprite, entities, walkable) {
  Being.call(this);
  this.stats.money = money;
  this.stats.level = level;
  this.bounds = bounds;
  this.sprite = sprite;
  this.location.x = x;
  this.location.y = y;
  this.walkable = walkable;
  this.orientation = 0;
  this.game = game;
  this.entities = entities;
  this.id = id;
  this.player = player;
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

Being.prototype.attack = function(entity) {
  this.player.sprite.animations.play('attack');
  this.player.moving = !this.player.moving;
  entity.damage(this.stats.str);
};

Being.prototype.validCell = function(x, y) {
  if(this.player.location.x === x && this.player.location.y === y) {
    this.attack(this.player);
    return false;
  }

  if(!this.walkable[x][y]) {
    return false;
  } else {
    for (var index in this.entities) {
      var mob = this.entities[index];
      if(mob.id !== this.id) {
        if (mob.location.x === x && mob.location.y === y) {
          return false;
        }
      }
    }
  }

  return true;
};

Being.prototype.chooseNextMove = function() {
  var locationBackup = {
    x: this.location.x,
    y: this.location.y
  };

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

  if(this.validCell(this.location.x, this.location.y)) {
    this.game.add.tween(this.sprite).to(
      {
        x: this.location.x * 32,
        y: this.location.y * 32
      },
      200, Phaser.Easing.linear, true
    );
  } else {
    this.location = locationBackup;
    this.chooseOrientation();
  }

};
