'use strict';

var Play = module.exports = function() {
  Phaser.State.call(this);
};

Play.prototype = Object.create(Phaser.State.prototype);
Play.prototype.constructor = Play;

Play.prototype.player = {
  sprite: null,
  moving: false,
  animating: false,
  location: {
    x: 0,
    y: 0
  },
  timer: null
};

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

  this.player.sprite = this.game.add.sprite(32, 32, 'avatar');
  this.game.physics.enable(this.player.sprite);
  this.game.camera.follow(this.player.sprite);
  this.player.sprite.body.setSize(12, 16, 2, 0);
  this.player.sprite.bringToTop();
  this.player.sprite.position.x = 0;
  this.player.sprite.position.y = 0;

  this.player.sprite.animations.add('stand', [0], 1, false);
  this.player.sprite.animations.add('walk_left', [4,5,6,7], 10, true);
  this.player.sprite.animations.add('walk_right', [8,9,10,11], 10, true);
  this.player.sprite.animations.add('walk_up', [12,13,14,15], 10, true);
  this.player.sprite.animations.add('walk_down', [0,1,2,3], 10, true);

  this.drawMaze();

  this.cursors = this.game.input.keyboard.createCursorKeys();
};

Play.prototype.onComplete = function() {
  this.player.moving = false;
};

Play.prototype.movePlayer = function(left, top) {
  this.player.location.x += left;
  this.player.location.y += top;
  this.player.moving = true;

  this.game.add.tween(this.player.sprite).to(
    {
      x: this.player.location.x * 32,
      y: this.player.location.y * 32
    },
    200, Phaser.Easing.Linear.None, true
  ).onComplete.addOnce(this.onComplete, this);

  this.game.physics.arcade.collide(this.player.sprite, self.walls);
};

Play.prototype.update = function() {
  this.game.physics.arcade.collide(this.player.sprite, this.walls);
  this.player.sprite.body.velocity.setTo(0, 0);

  if(!this.player.moving) {
    this.player.sprite.animations.play('stand');

    console.log('waiting key');
    this.game.input.update();

    if(this.cursors.down.isDown) {
      this.movePlayer(0,1);
      this.player.sprite.animations.play('walk_down');
    }

    if(this.cursors.up.isDown) {
      this.movePlayer(0,-1);
      this.player.sprite.animations.play('walk_up');
    }

    if(this.cursors.left.isDown) {
      this.movePlayer(-1, 0);
      this.player.sprite.animations.play('walk_left');
    }

    if(this.cursors.right.isDown) {
      this.movePlayer(1, 0);
      this.player.sprite.animations.play('walk_right');
    }
  }
};
