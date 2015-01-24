'use strict';

var Preloader = module.exports = function() {
  Phaser.State.call(this);
};
Preloader.prototype = Object.create(Phaser.State.prototype);
Preloader.prototype.constructor = Preloader;

Preloader.prototype.preload = function() {
  // var progressBar = this.add.sprite(
  //   this.world.centerX, this.world.centerY, 'progressBar'
  // );
  //
  // progressBar.anchor.set(0.5);
  // this.load.setPreloadSprite(progressBar);
};

Preloader.prototype.create = function() {
  this.state.start('menu');
};
