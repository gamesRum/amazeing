'use strict';

var Play = module.exports = function() {
  Phaser.State.call(this);
};

Play.prototype = Object.create(Phaser.State.prototype);
Play.prototype.constructor = Play;

Play.prototype.create = function() {
  var style = {align: 'center', fill: '#ffffff', font: '10px Arial'};

  this.input.onDown.add(this.switchBackToMenu, this);
};

Play.prototype.update = function() {
  // Body...
};

Play.prototype.switchBackToMenu = function() {
  this.state.start('menu');
};
