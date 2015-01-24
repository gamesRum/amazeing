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
  this.avatar.position.x = 32;
  this.avatar.position.y = 32;

  this.avatar.animations.add('stand', 0, 1, false);
  this.avatar.animations.add('walk_left', 4, 10, true);
  this.avatar.animations.add('walk_right', 8, 10, true);
  this.avatar.animations.add('walk_up', 12, 10, true);
  this.avatar.animations.add('walk_down', 16, 10, true);

  this.player = {
    inTween: false,
    x: 0,
    y: 0
  };

  this.drawMaze();

  this.cursors = this.game.input.keyboard.createCursorKeys();
};

Play.prototype.movePlayer = function(left, top) {
  this.player.x += left;
  this.player.y += top;

  var player = this.player,
      avatar = this.avatar;

  if(player.inTween) {
    console.log('noop!');
  } else {

    this.game.add.tween(this.avatar).to(
      {
        x: this.player.x * 32,
        y: this.player.y * 32
      },
      1, Phaser.Easing.Linear.None, true
    );

    console.log('Location:', this.player.x, this.player.y, this.player.inTween);
  }
};

Play.prototype.update = function() {
  this.game.physics.arcade.collide(this.avatar, this.walls);
  this.avatar.body.velocity.setTo(0, 0);

  if(!this.player.inTween) {
    this.game.input.update();

    if(this.cursors.down.isDown) {
      this.movePlayer(0,1);
      //this.avatar.animations.play('walk_down');
    }

    if(this.cursors.up.isDown) {
      this.movePlayer(0,-1);
      //this.avatar.animations.play('walk_up');
    }

    if(this.cursors.left.isDown) {
      this.movePlayer(-1, 0);
      //this.avatar.animations.play('walk_left');
    }

    if(this.cursors.right.isDown) {
      this.movePlayer(1, 0);
      //this.avatar.animations.play('walk_right');
    }
  }
};
