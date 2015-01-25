'use strict';

var Preloader = module.exports = function() {
  Phaser.State.call(this);
};
Preloader.prototype = Object.create(Phaser.State.prototype);
Preloader.prototype.constructor = Preloader;

Preloader.prototype.preload = function() {
  this.game.load.spritesheet('tiles', 'img/telles0808_rpg_maker_tileset.png', 32, 32, 16 * 27);
  this.game.load.spritesheet('avatar', 'img/2p_russia_sprite_rpg_by_yumehoshichan-d675dxi.png', 32, 32, 4 * 21);
  this.game.load.spritesheet('mobs', 'img/RE3___Monster_Sprites_v1_0_by_DoubleLeggy.png', 32, 32, 12 * 8);
  this.game.load.spritesheet('npcs', 'img/Visoes_3_Sprites_by_DoubleLeggy.png', 32, 32, 12 * 8);
};

Preloader.prototype.create = function() {
  this.state.start('play');
};
