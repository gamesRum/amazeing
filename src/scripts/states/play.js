'use strict';

var Play = module.exports = function() {
  Phaser.State.call(this);
};

Play.prototype = Object.create(Phaser.State.prototype);
Play.prototype.constructor = Play;

Play.prototype.map = {
  height: 11,
  width: 11
};

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

Play.prototype.render = function() {
  this.game.time.advancedTiming = true;
  this.game.debug.text(this.game.time.fps || '--', window.innerWidth-40, 14, "#ffffff");
};

Play.prototype.drawMaze = function() {
  var map_width = (this.map.width+1)*32,
      map_height = (this.map.height+1)*32;

  this.game.world.setBounds(0, 0, map_width, map_height);

  for (var i = 0; i <= this.map.width; i += 1) {
    for (var j = 0; j <= this.map.height; j += 1) {
      if(Math.floor((Math.random() * 100) + 1) > 75) {
        this.walls.create(i*32, j*32, 'tiles', 264);
      } else {
        if (Math.floor((Math.random() * 100) + 1) > 80) {
          this.walls.create(i * 32, j * 32, 'tiles', 246);
        }
      }
    }
  }

  this.player.sprite.bringToTop();
};

Play.prototype.create = function() {
  this.game.physics.startSystem(Phaser.Physics.ARCADE);
  this.game.stage.disableVisibilityChange = true;
  this.background = this.game.add.tileSprite(0, 0, 1984, 1984, 'tiles', 8);

  this.walls = this.game.add.group();
  this.walls.enableBody = true;
  this.walls.physicsBodyType = Phaser.Physics.ARCADE;

  this.player.sprite = this.game.add.sprite(32, 32, 'avatar');
  this.game.physics.enable([this.player.sprite, this.walls], Phaser.Physics.ARCADE);
  this.game.camera.follow(this.player.sprite);
  this.player.sprite.body.setSize(12, 16, 2, 0);
  this.player.sprite.position.x = 0;
  this.player.sprite.position.y = 0;
  this.player.sprite.bringToTop();

  this.player.sprite.animations.add('stand', [0], 1, false);
  this.player.sprite.animations.add('walk_left', [4,5,6,7], 10, true);
  this.player.sprite.animations.add('walk_right', [8,9,10,11], 10, true);
  this.player.sprite.animations.add('walk_up', [12,13,14,15], 10, true);
  this.player.sprite.animations.add('walk_down', [0,1,2,3], 10, true);

  this.drawMaze();

  this.cursors = this.game.input.keyboard.createCursorKeys();
};

Play.prototype.startMoving = function() {
  this.player.moving = true;
};

Play.prototype.stopMoving = function() {
  this.player.moving = false;
};

Play.prototype.movePlayer = function(left, top) {
  this.player.location.x += left;
  this.player.location.y += top;
  this.player.moving = true;

  if(this.player.location.x < 0) {
    this.player.location.x = 0;
  }

  if(this.player.location.y < 0) {
    this.player.location.y = 0;
  }

  if(this.player.location.x > this.map.width) {
    this.player.location.x = this.map.width;
  }

  if(this.player.location.y > this.map.height) {
    this.player.location.y = this.map.height;
  }

  var animation = this.game.add.tween(this.player.sprite).to(
    {
      x: this.player.location.x * 32,
      y: this.player.location.y * 32
    },
    200, Phaser.Easing.Linear.None, true
  );

  animation.onStart.add(this.startMoving, this)
  animation.onComplete.addOnce(this.stopMoving, this);
};

Play.prototype.update = function() {
  this.game.physics.arcade.collide(this.player.sprite, this.walls);
  this.player.sprite.body.velocity.setTo(0, 0);

  if(!this.player.moving) {
    this.game.input.update();
    this.player.sprite.animations.play('stand');

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

    this.game.physics.arcade.collide(this.player.sprite, this.walls);
  }
};
