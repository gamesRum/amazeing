'use strict';

var Play = module.exports = function() {
  Phaser.State.call(this);
};

Play.prototype = Object.create(Phaser.State.prototype);
Play.prototype.constructor = Play;

var Room = require('../entities/room');

Play.prototype.map = {
  walkable: null,
  level: null,
  tile: {
    height: 32,
    width: 32
  },
  size: 15
};

Play.prototype.player = {
  sprite: null,
  moving: false,
  animating: false,
  location: {
    x: 1,
    y: 1
  },
  height: 32,
  width: 32
};

Play.prototype.render = function() {
  this.game.time.advancedTiming = true;
  this.game.debug.text(this.game.time.fps || '--', window.innerWidth-40, 14, "#ffffff");
};

Play.prototype.drawMaze = function() {
  var self = this,
      map_width = (this.map.size+1) * this.map.tile.width,
      map_height = (this.map.size+1) * this.map.tile.height;

  this.game.world.setBounds(0, 0, map_width, map_height);

  this.map.level = new Room('maze', this.map.size);
  this.map.level.init();

  this.map.walkable = new Array(this.map.size);
  for(var i =0; i< this.map.size; i++) {
    this.map.walkable[i] = new Array(this.map.size);
  }

  this.map.level.world.iterate(function(item, y, x) {
    if (item === 0) {
      self.walls.create(x * self.map.tile.width, y * self.map.tile.height, 'tiles', 246);
      self.map.walkable[x][y] = false;
    } else {
      self.map.walkable[x][y] = true;
    }
  });

  this.player.sprite.bringToTop();
};

Play.prototype.create = function() {
  this.game.physics.startSystem(Phaser.Physics.ARCADE);
  this.game.stage.disableVisibilityChange = true;
  this.background = this.game.add.tileSprite(0, 0, 1984, 1984, 'tiles', 8);

  this.walls = this.game.add.group();
  this.walls.enableBody = true;
  this.walls.physicsBodyType = Phaser.Physics.ARCADE;

  this.player.sprite = this.game.add.sprite(this.player.width, this.player.height, 'avatar');
  this.game.physics.enable(this.player.sprite, Phaser.Physics.ARCADE);
  this.game.camera.follow(this.player.sprite);
  this.player.sprite.body.setSize(12, 16, 2, 0);
  this.player.sprite.position.x = this.player.location.x * this.player.width;
  this.player.sprite.position.y = this.player.location.y * this.player.height;
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
  var locationBackup = {
    x: this.player.location.x,
    y: this.player.location.y
  };

  this.player.location.x += left;
  this.player.location.y += top;
  this.player.moving = true;

  if(this.player.location.x < 0) {
    this.player.location.x = 0;
  }

  if(this.player.location.y < 0) {
    this.player.location.y = 0;
  }

  if(this.player.location.x > this.map.size) {
    this.player.location.x = this.map.size;
  }

  if(this.player.location.y > this.map.size) {
    this.player.location.y = this.map.size;
  }

  if(!this.map.walkable[this.player.location.x][this.player.location.y]) {
    this.player.moving = false;
    this.player.location = locationBackup;
  } else {
    var animation = this.game.add.tween(this.player.sprite).to(
      {
        x: this.player.location.x * this.map.tile.width,
        y: this.player.location.y * this.map.tile.height
      },
      200, Phaser.Easing.linear, true
    );

    animation.onStart.add(this.startMoving, this)
    animation.onComplete.addOnce(this.stopMoving, this);
  }
};

Play.prototype.update = function() {
  this.player.sprite.body.velocity.setTo(0, 0);

  if(!this.player.moving) {
    this.game.input.update();

    if(this.cursors.down.isDown) {
      this.movePlayer(0,1);
      this.player.sprite.animations.play('walk_down');
    } else if(this.cursors.up.isDown) {
      this.movePlayer(0,-1);
      this.player.sprite.animations.play('walk_up');
    } else if(this.cursors.left.isDown) {
      this.movePlayer(-1, 0);
      this.player.sprite.animations.play('walk_left');
    } else if(this.cursors.right.isDown) {
      this.movePlayer(1, 0);
      this.player.sprite.animations.play('walk_right');
    } else {
      this.player.sprite.animations.play('stand');
    }
  }
};
