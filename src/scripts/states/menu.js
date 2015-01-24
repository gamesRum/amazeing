'use strict';

var Menu = module.exports = function() {
  Phaser.State.call(this);
};
Menu.prototype = Object.create(Phaser.State.prototype);
Menu.prototype.constructor = Menu;

Menu.prototype.create = function() {
  this.background = this.game.add.tileSprite(0, 0, 1984, 1984, 'tiles', 8);
  this.game.world.setBounds(0, 0, window.innerWidth, window.innerHeight);

  var titleStyle = {align: 'center', fill: '#ffffff', font: 'bold 45px Arial'};
  var title = this.add
    .text(this.world.centerX, 0, 'UberQuest', titleStyle)
    .anchor.setTo(0.5);

  this.add
    .text(this.world.centerX, 150, 'Click to Start!', {fill: '#000000'})
    .anchor.set(0.5);

  this.add.tween(title)
    .to({y: -1})
    .start();

  this.input.onDown.add(this.startGame, this);
};

Menu.prototype.startGame = function() {
  this.state.start('play');
};
