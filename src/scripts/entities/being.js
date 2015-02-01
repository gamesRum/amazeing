'use strict';

var Being = module.exports = function(gameInstance, maxHP, maxSP, money, bagSize) {
  Phaser.Sprite.call(this, gameInstance);

  this.bag = {
    items: [],
    size: bagSize || 10
  };

  this.name = 'Mob';

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

  this.orientation = 0;

  this.moving = false;
  this.sprite = null;
  this.health = maxHP || 100;
  this.stats =  {
    level: 1,
    maxHP: maxHP || 100,
    maxSP: maxSP || 100,
    money: money || 0,
    sp: maxSP || 100,
    str: 2,
    def: 1
  };

  this.height= 32;
  this.width= 32;
};

Being.prototype = Object.create(Phaser.Sprite.prototype);
Being.prototype.constructor = Being;

Being.prototype.damage = function(str) {
  if(this.alive) {
    var hit = Math.round((str * 1.5) - this.stats.def * 0.5);

    Phaser.Sprite.prototype.damage.call(this, hit);

    /* TODO - Hardcoded tile size */
    this.game.state.states.play.showDamage(hit, this.location.x * 32, this.location.y * 32, 'yellow');

    if (0 > this.health) {
      this.health = 0;
    }

    return true;
  }

  return false;
};

Being.prototype.update = function() {
  if (this.health <= 0) {
    this.die();
  }
};

Being.prototype.move = function() {};

Being.prototype.die = function() {};

Being.prototype.drop = function() {};

Being.prototype.attack = function() {};
