'use strict';

var Being = require('./being');

var Mob = module.exports = function(gameInstance, id, player, x, y, money, level, bounds, sprite, entities, walkable) {
  Being.call(this, gameInstance);
  this.stats.money = money;
  this.stats.str = Math.ceil((level - 1) * 0.5);
  this.stats.level = level;
  this.stats.maxHP = level;
  this.stats.hp = level;
  this.bounds = bounds;
  this.sprite = sprite;
  this.location.x = x;
  this.location.y = y;
  this.walkable = walkable;
  this.orientation = 0;
  this.gameInstance = gameInstance;
  this.entities = entities;
  this.id = id;
  this.player = player;
  this.name = 'Mob_'+id;
  this.chooseOrientation();
};

Mob.prototype = Object.create(Being.prototype);
Mob.prototype.constructor = Mob;

Mob.prototype.update = function() {
  Being.call(this);
};

Mob.prototype.chooseOrientation = function() {
  this.orientation = Math.floor(Math.random() * 4);
};

Mob.prototype.attack = function(entity) {
  this.player.sprite.animations.play('damage');
  entity.damage(this.stats.str);
};

Mob.prototype.validCell = function(x, y) {
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

Mob.prototype.chooseNextMove = function() {
  var locationBackup = {
    x: this.location.x,
    y: this.location.y
  };

  switch(this.orientation) {
    case 0:
      this.location.y++;
      this.sprite.animations.play('walk_down');
      break;
    case 1:
      this.location.y--;
      this.sprite.animations.play('walk_up');
      break;
    case 2:
      this.location.x++;
      this.sprite.animations.play('walk_right');
      break;
    default:
      this.location.x--;
      this.sprite.animations.play('walk_left');
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
    this.gameInstance.add.tween(this.sprite).to(
      {
        x: this.location.x * 32,
        y: this.location.y * 32
      },
      200, Phaser.Easing.linear, true
    );

    this.sprite.bringToTop();
  } else {
    this.location = locationBackup;
    this.chooseOrientation();
  }

};
