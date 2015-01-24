'use strict';

var Menu = module.exports = function() {
  Phaser.State.call(this);
};
Menu.prototype = Object.create(Phaser.State.prototype);
Menu.prototype.constructor = Menu;

Menu.prototype.create = function() {
  var titleStyle = {align: 'center', fill: '#ffffff', font: 'bold 45px Arial'};
  var title = this.add
    .text(this.world.centerX, 0, 'UberQuest', titleStyle)
    .anchor.setTo(0.5);

  this.add
    .text(this.world.centerX, 150, 'Click to Start!', {fill: '#f00'})
    .anchor.set(0.5);

  this.add.tween(title)
    .to({y: -1})
    .start();

  this.input.onDown.add(this.startGame, this);
};

Menu.prototype.startGame = function() {
  this.state.start('play');
};
