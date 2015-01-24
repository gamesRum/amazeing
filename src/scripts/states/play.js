'use strict';

var Play = module.exports = function() {
  Phaser.State.call(this);
};

Play.prototype = Object.create(Phaser.State.prototype);
Play.prototype.constructor = Play;

Play.prototype.create = function() {
  this.game.physics.startSystem(Phaser.Physics.ARCADE);
  this.game.world.setBounds(0, 0, 1984, 1984);
  this.game.stage.backgroundColor = "#333333";
  this.game.stage.disableVisibilityChange = true;
  this.background = this.game.add.tileSprite(0, 0, 1984, 1984, 'tiles');
};

Play.prototype.update = function() {
  // Body...
};

Play.prototype.switchBackToMenu = function() {
  this.state.start('menu');
};
