'use strict';

var Menu = module.exports = function() {
  Phaser.State.call(this);
};
Menu.prototype = Object.create(Phaser.State.prototype);
Menu.prototype.constructor = Menu;

Menu.prototype.create = function() {
  var labelStyle = {align: 'center', fill: '#ffffff', font: '15px Arial'};
  var titleStyle = {align: 'center', fill: '#ffffff', font: 'bold 45px Arial'};
  var text, title;

  if (this.game.device.desktop) {
    text = 'Click to start';
  } else {
    text = 'Touch to start';
  }

  title = this.add
    .text(this.world.centerX, 0, 'Demo Project', titleStyle)
    .anchor.setTo(0.5);

  this.add
    .text(this.world.centerX, 150, 'Menu Screen', {fill: '#fff'})
    .anchor.set(0.5);

  this.add
    .text(this.world.centerX, this.world.height - 150, text, labelStyle)
    .anchor.set(0.5);

  this.add.tween(title)
    .to({y: -1})
    .start();

  this.input.onDown.add(this.startGame, this);
};

Menu.prototype.startGame = function() {
  this.state.start('play');
};
