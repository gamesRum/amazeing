'use strict';

var Play = module.exports = function() {
  Phaser.State.call(this);
};

Play.prototype = Object.create(Phaser.State.prototype);
Play.prototype.constructor = Play;

Play.prototype.drawMaze = function() {
  for (var i = 0; i < 64; i += 1) {
    for (var j = 0; j < 64; j += 1) {
      if(Math.floor((Math.random() * 100) + 1) > 75) {
        this.walls.create(i*32, j*32, 'tiles', 264);
      } else {
        if (Math.floor((Math.random() * 100) + 1) > 80) {
          this.walls.create(i * 32, j * 32, 'tiles', 246);
        }
      }
    }
  }
};

Play.prototype.create = function() {
  this.game.physics.startSystem(Phaser.Physics.ARCADE);
  this.game.world.setBounds(0, 0, 64*64, 64*64);
  this.game.stage.disableVisibilityChange = true;
  this.background = this.game.add.tileSprite(0, 0, 1984, 1984, 'tiles', 8);

  this.walls = this.game.add.group();
  this.walls.enableBody = true;
  this.walls.physicsBodyType = Phaser.Physics.ARCADE;

  this.avatar = this.game.add.sprite(32, 32, 'avatar');
  this.game.physics.enable(this.avatar);
  this.game.camera.follow(this.avatar);
  this.avatar.body.setSize(12, 16, 2, 0);
  this.avatar.bringToTop();

  this.drawMaze();
};

Play.prototype.update = function() {
  this.game.physics.arcade.collide(this.avatar, this.walls);
};

Play.prototype.switchBackToMenu = function() {
  this.state.start('menu');
};
