'use strict';

var cfg = require('../../../config');

var Boot = module.exports = function() {
  Phaser.State.call(this);
};
Boot.prototype = Object.create(Phaser.State.prototype);
Boot.prototype.constructor = Boot;

Boot.prototype.preload = function() {
  this.load.baseURL = './assets/';
  // this.load.image('progressBar', 'progressBar.png');
};

Boot.prototype.create = function() {
  $(window).trigger('resize');
  this.state.start('preloader');
};
