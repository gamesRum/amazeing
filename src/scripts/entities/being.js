'use strict';

var Being = module.exports = function(maxHP, maxSP, money, bagSize) {
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
  this.stats =  {
    level: 1,
    maxHP: maxHP || 100,
    maxSP: maxSP || 100,
    money: money || 0,
    hp: maxHP || 100,
    sp: maxSP || 100,
    str: 2,
    def: 1
  };

  this.height= 32;
  this.width= 32;
};

Being.prototype.damage = function(str) {
  if(this.stats.hp) {
    var hit = (str * 2) - Math.round(this.stats.def * 0.5);

    if(hit > 0) {
      this.stats.hp = this.stats.hp - hit;
    }

    if(this.stats.hp < 0) {
      this.stats.hp = 0;
    }

    console.log('Damaged:', this.name, this.stats);
    return true;
  }

  return false;
};

Being.prototype.isAlive = function() {
  return this.stats.hp > 0;
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
