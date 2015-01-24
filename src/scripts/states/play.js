'use strict';

var Play = module.exports = function() {
  Phaser.State.call(this);
};

Play.prototype = Object.create(Phaser.State.prototype);
Play.prototype.constructor = Play;

var Room = require('../entities/room');
var Player = require('../entities/player');
var Mob = require('../entities/mob');

Play.prototype.map = {
  level: null,
  size: 15,
  tile: {
    height: 32,
    width: 32
  },
  walkable: null
};

Play.prototype.player = new Player(100, 'joan', 'male');

Play.prototype.updateStats = function() {
  var statusBar = document.getElementById("status");
  statusBar.innerHTML = '';

  function addText(label, value) {
    var span = document.createElement('span');
    span.innerHTML= label + ': <strong>' + value + '</strong>';
    statusBar.appendChild(span);
  }

  addText('Level', this.player.stats.level);
  addText('HP', this.player.stats.hp);
  addText('SP', this.player.stats.sp);
  addText('$', this.player.stats.money);
};

Play.prototype.render = function() {
  this.game.time.advancedTiming = true;
  this.game.debug.text(this.game.time.fps || '--', window.innerWidth-40, window.innerHeight-10, "#ffffff");
  this.updateStats();
};

Play.prototype.createMobs = function() {
  this.mobs = this.game.add.group();
  this.mobs.entities = [];
  this.mobs.enableBody = true;
  this.mobs.physicsBodyType = Phaser.Physics.ARCADE;

  for(var i = 0; i< this.map.size; i++) {
    for(var j = 0; j< this.map.size; j++) {
      if(this.map.walkable[i][j]) {
        if(Math.floor((Math.random() * 100) + 1) > 95) {
          var mobSprite = this.mobs.create(i * this.map.tile.width, j * this.map.tile.width, 'tiles', 248);

          this.mobs.entities.push(new Mob(i, j, (i*j)+i, i+j, {x: this.map.size, y: this.map.size}, mobSprite, this.map.walkable));
        }
      }
    }
  }
};

Play.prototype.drawMaze = function() {
  var self = this,
      map_width = (this.map.size+1) * this.map.tile.width,
      map_height = (this.map.size+1) * this.map.tile.height;

  this.game.world.setBounds(0, 0, map_width, map_height);

  this.map.level = new Room('maze', this.map.size);
  this.map.level.init();

  this.map.walkable = new Array(this.map.size);
  for(var i = 0; i< this.map.size; i++) {
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

  this.createMobs();

  this.player.sprite.bringToTop();
};

Play.prototype.create = function() {
  this.timer = {
    turn: true
  };

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
  this.player.sprite.animations.add('attack', [16,17,18,19], 10, true);

  this.drawMaze();

  this.cursors = this.game.input.keyboard.createCursorKeys();
  this.keys = {
    spaceBar: this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
    escape: this.game.input.keyboard.addKey(Phaser.Keyboard.ESC)
  }
};

Play.prototype.startMoving = function() {
  this.player.moving = true;
};

Play.prototype.stopMoving = function() {
  this.player.moving = false;
};

Play.prototype.movePlayer = function(left, top, action) {
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

  if(this.player.location.x > this.map.size-1) {
    this.player.location.x = this.map.size-1;
  }

  if(this.player.location.y > this.map.size-1) {
    this.player.location.y = this.map.size-1;
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

    switch(action) {
      case 'attack':
        console.log('attack!');
        break;
    }
  }
};

Play.prototype.timerTick = function() {
  for(var index in this.mobs.entities) {
    var mob = this.mobs.entities[index];
    mob.chooseNextMove();
  }

  this.timer.turn = true;
};

Play.prototype.update = function() {
  this.player.sprite.body.velocity.setTo(0, 0);

  if(this.timer.turn) {
    this.timer.turn = false;
    var self = this;
    setTimeout(function(){
      self.timerTick()
    }, 200);
  }

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

    if(this.keys.spaceBar.isDown) {
      this.movePlayer(0, 0, 'attack');
      this.player.sprite.animations.play('attack');
    }
  }
};
