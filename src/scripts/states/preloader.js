'use strict';

var Preloader = module.exports = function() {
  Phaser.State.call(this);
};
Preloader.prototype = Object.create(Phaser.State.prototype);
Preloader.prototype.constructor = Preloader;

Preloader.prototype.preload = function() {
  this.game.load.spritesheet('tiles', 'img/telles0808_rpg_maker_tileset.png', 32, 32, 16*27);
  this.game.load.spritesheet('avatar', 'img/2p_russia_sprite_rpg_by_yumehoshichan-d675dxi.png', 32, 32, 4*6);
};

Preloader.prototype.create = function() {
  this.state.start('play');
};
