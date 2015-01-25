'use strict';

var World = require('../entities/world');

var Play = module.exports = function () {
  Phaser.State.call(this);
  this.gameWorld = new World();
};

Play.prototype = Object.create(Phaser.State.prototype);
Play.prototype.constructor = Play;

var Player = require('../entities/player');
var Mob = require('../entities/mob');

Play.prototype.map = {
  level: 1,
  name: 'The Forest',
  size: null,
  tile: {
    height: 32,
    width: 32
  },
  walkable: null,
  warps: {
    start: {
      level: null,
      id: 'start',
      x: 0,
      y: 0
    },
    end: {
      level: 2,
      name: 'The Forest',
      id: 'end',
      x: 0,
      y: 0
    }
  }
};

var tileset = {
  cavern: {
    background: 11,
    wall: 247,
    enter: 403,
    exit: 257,
    decoration: [259]
  },
  snow: {
    background: 9,
    wall: 239,
    enter: 403,
    exit: 249,
    decoration: [220, 232, 233, 235]
  },
  desert: {
    background: 81,
    wall: 231,
    enter: 403,
    exit: 421,
    decoration: [279, 295, 308, 401]
  },
  castle: {
    background: 15,
    wall: 270,
    enter: 403,
    exit: 21,
    decoration: [212]
  },
  forest: {
    background: 6,
    wall: 246,
    enter: 403,
    exit: 257,
    decoration: [224, 225, 226, 227, 240, 241, 242, 243]
  }
};

var $statusBar = document.getElementById('status'),
    $messageBox = document.getElementById('messageBox'),
    $text = document.getElementById('messageText'),
    $optionButtons = document.getElementById('optionButtons'),
    $buttons = {
      accept: document.getElementById('acceptButton'),
      cancel: document.getElementById('cancelButton'),
      buy: document.getElementById('buyButton'),
      sell: document.getElementById('sellButton')
    };


Play.prototype.player = new Player(20, 'joan', 'male');

Play.prototype.updateStats = function () {
  $statusBar.innerHTML = '';

  function addText(label, value) {
    var $span = document.createElement('span');

    $span.innerHTML = label + ': <strong>' + value + '</strong>';
    $statusBar.appendChild($span);
  }

  addText('Map', this.map.name);
  addText('HP', this.player.stats.hp);
  addText('STR', this.player.stats.str);
  addText('DEF', this.player.stats.def);
  addText('$', this.player.stats.money);
};

Play.prototype.hideMessage = function () {
  $messageBox.className = "hidden";
};

Play.prototype.showMessage = function (message, callbacks) {
  $messageBox.className = "visible";
  $text.innerHTML = message;
  $optionButtons.innerHTML = '';

  function setButton($element, callback) {
    if(callback) {
      $element.onclick = callbacks.accept;
      $element.style.display = "inline-block";
    } else {
      $element.removeAttribute("onclick");
      $element.style.display = "none";
    }
  }

  setButton($buttons.accept, callbacks && callbacks.accept);
  setButton($buttons.cancel, callbacks && callbacks.cancel);
  setButton($buttons.buy, callbacks && callbacks.buy);
  setButton($buttons.sell, callbacks && callbacks.sell);

  if(!callbacks) {
    var self = this;
    setTimeout(function () {
      self.hideMessage()
    }, 3000);
  }
};

Play.prototype.openNPC = function (name, message, options, callback) {
  $messageBox.className = "visible";
  $text.innerHTML = '<h1>' + name + '</h1><p>' + message + '</p>';
  $optionButtons.innerHTML = '';

  if(options) {
    for(var index in options) {
      var option = options[index],
        $optionButton = document.createElement('button'),
        self = this;

      $optionButton.innerHTML = option;
      $optionButton.onclick = function(e){
        $optionButtons.innerText = '';
        self.hideMessage();
        callback(e.target.innerText);
      };
      $optionButtons.appendChild($optionButton);
    }
  }

  if(!callback) {
    var self = this;
    setTimeout(function () {
      self.hideMessage()
    }, 3000);
  }
};

Play.prototype.render = function () {
  this.game.time.advancedTiming = true;
  this.game.debug.text(this.game.time.fps || '--', window.innerWidth - 40, window.innerHeight - 10, "#ffffff");
  this.updateStats();
};

Play.prototype.createNpcs = function () {
  var npcCount = Math.round(this.map.size * 0.1);

  this.npcs = [];

  while(npcCount > 0) {
    var i = Math.floor((Math.random() * this.map.size)),
      j = Math.floor((Math.random() * this.map.size));

    if (this.map.walkable[i][j]) {
      var npcType = Math.floor((Math.random() * 3)),
        npcSprite = this.game.add.group();

        npcSprite.x = i * this.map.tile.width;
        npcSprite.y = j * this.map.tile.width;
        npcSprite.create(0,0, 'tiles', 141);
        npcSprite.create(4, -9, 'tiles', 144 + npcType).scale.setTo(0.7, 0.7);

      this.npcs.push({
        sprite: npcSprite,
        type: npcType,
        x: i,
        y: j
      });

      npcCount --;
    }
  }
};

Play.prototype.createMobs = function () {
  var mobCount = Math.round(this.map.size * 0.1),
      mobID = 0;

  this.mobs = this.game.add.group();
  this.mobs.entities = [];

  while(mobCount > 0) {
    var i = Math.floor((Math.random() * this.map.size)),
      j = Math.floor((Math.random() * this.map.size));

    if (this.map.walkable[i][j]) {
      var mobBaseLevel = Math.floor((Math.random() * 3)),
        o = mobBaseLevel * 3,
        mobSprite = this.mobs.create(i * this.map.tile.width, j * this.map.tile.width, 'mobs', 1);

      mobSprite.animations.add('walk_left', [12 + o, 13 + o, 14 + o], 10, true);
      mobSprite.animations.add('walk_right', [24 + o, 25 + o, 26 + o], 10, true);
      mobSprite.animations.add('walk_up', [36 + o, 37 + o, 38 + o], 10, true);
      mobSprite.animations.add('walk_down', [0 + o, 1 + o, 2 + o], 10, true);
      mobSprite.animations.add('damage', [0, 1, 2], 10, true);
      mobSprite.animations.add('attack', [0, 1, 2], 10, true);

      this.mobs.entities.push(new Mob(mobID++, this.game, this.player, i, j, (i * j) + i, i, {
        x: this.map.size,
        y: this.map.size
      }, mobSprite, this.mobs.entities, this.map.walkable));

      mobCount--;
    }
  }
};

Play.prototype.drawMaze = function () {
  var self = this,
      biome = this.gameWorld.room.biome,
      map = this.gameWorld.room.map,
      map_width = 0,
      map_height = 0;

  this.walls = this.game.add.group();
  this.map.walkable = map.generateEmpty(map.size);
  this.map.level = this.gameWorld.currentRoomIndex;
  this.map.name = this.gameWorld.room.name;
  this.map.size = this.gameWorld.room.map.size;
  this.showMessage('Entering '+ this.map.name);

  map_width = (this.map.size + 1) * this.map.tile.width;
  map_height = (this.map.size + 1) * this.map.tile.height;
  this.game.world.setBounds(0, 0, map_width, map_height);
  this.game.add.tileSprite(0, 0, map_width, map_height, 'tiles', tileset[biome].background);

  map.iterate(function (cell, y, x) {
    self.map.walkable[x][y] = true;
    switch (cell) {
      case 1:
        var items = tileset[biome].decoration,
          tile = items[Math.floor(Math.random() * items.length)];
        if (((Math.random() * 100) + 1) > 95) {
          self.walls.create(x * self.map.tile.width, y * self.map.tile.height, 'tiles', tile);
        }
        break;
      case 2:
        if (self.map.level > 1) {
          self.walls.create(x * self.map.tile.width, y * self.map.tile.height, 'tiles', tileset[biome].enter);
          self.map.warps.start.x = x;
          self.map.warps.start.y = y;
        }
        break;
      case 3:
        self.walls.create(x * self.map.tile.width, y * self.map.tile.height, 'tiles', tileset[biome].exit);
        self.map.warps.end.x = x;
        self.map.warps.end.y = y;
        break;
      default:
        self.walls.create(x * self.map.tile.width, y * self.map.tile.height, 'tiles', tileset[biome].wall);
        self.map.walkable[x][y] = false;
        break;
    }
  });

  this.world.bringToTop(this.walls);
  this.createNpcs();
  this.createMobs();

  var spawnPoint = map.getPlayerSpawnPoint(this.gameWorld.isGoingInverse);
  this.player.sprite.position.x = spawnPoint.column * self.map.tile.width;
  this.player.sprite.position.y = spawnPoint.row * self.map.tile.height;
  this.player.location.x = spawnPoint.column;
  this.player.location.y = spawnPoint.row;
  this.player.sprite.bringToTop();
};

Play.prototype.loadMap = function (map) {
  this.player.sprite = this.game.add.sprite(this.player.width, this.player.height, 'avatar');
  this.player.sprite.position.x = this.player.location.x * this.player.width;
  this.player.sprite.position.y = this.player.location.y * this.player.height;
  this.player.sprite.bringToTop();

  this.player.sprite.animations.add('look_left', [4], 1, false);
  this.player.sprite.animations.add('look_right', [8], 1, false);
  this.player.sprite.animations.add('look_up', [12], 1, false);
  this.player.sprite.animations.add('look_down', [0], 1, false);
  this.player.sprite.animations.add('walk_left', [4, 5, 6, 7], 10, true);
  this.player.sprite.animations.add('walk_right', [8, 9, 10, 11], 10, true);
  this.player.sprite.animations.add('walk_up', [12, 13, 14, 15], 10, true);
  this.player.sprite.animations.add('walk_down', [0, 1, 2, 3], 10, true);
  this.player.sprite.animations.add('damage', [16, 17, 18, 19], 10, true);
  this.player.sprite.animations.add('attack', [20, 21, 22, 23], 10, true);
  this.player.sprite.animations.add('die', [27], 1, false);

  this.game.camera.follow(this.player.sprite);

  this.drawMaze();
};

Play.prototype.initKeyboard = function() {
  this.cursors = this.game.input.keyboard.createCursorKeys();
  this.keys = {
    spaceBar: this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
    escape: this.game.input.keyboard.addKey(Phaser.Keyboard.ESC)
  };
};

Play.prototype.create = function () {
  var self = this;
  this.timer = {
    turn: true
  };

  this.gameWorld.init();
  this.game.stage.disableVisibilityChange = true;
  this.game.stage.backgroundColor = 0x222222;

  this.openNPC(
    'Welcome to UberQuest!',
    'Select your race: <br/> <small>Every race has its own bonus and maybe it has money!</small>',
    ['ogre', 'human', 'zombie'],
    function(choice) {
      switch(choice) {
        case 'ogre':
          self.player.stats = {
            money: 0,
            maxHP: 100,
            hp: 5,
            str: 5,
            def: 5
          };
          break;
        case 'human':
          self.player.stats = {
            money: 100,
            maxHP: 100,
            hp: 10,
            str: 2,
            def: 2
          };
          break;
        case 'zombie':
          self.player.stats = {
            money: 300,
            maxHP: 50,
            hp: 1,
            str: 1,
            def: 1
          };
          break;
      }

      self.showMessage('Prepare to the battle!');
      self.loadMap(self.map);
      self.initKeyboard();
    }
  );
};

Play.prototype.startMoving = function () {
  this.player.moving = true;
};

Play.prototype.stopMoving = function () {
  this.player.moving = false;
};

Play.prototype.validCell = function (x, y) {
  if (!this.map.walkable[x][y]) {
    return false;
  }

  for (var index in this.mobs.entities) {
    var mob = this.mobs.entities[index];

    if (mob.location.x === x && mob.location.y === y) {

      if (this.keys.spaceBar.isDown) {
        if (this.player.attack(mob)) {
          var animation = this.game.add.tween(mob.sprite);

          animation.to({alpha: 0.5}, 120, Phaser.Easing.linear, true, 0, 1, false);
          animation.to({alpha: 1}, 120, Phaser.Easing.linear, true, 0, 1, false);
          animation.start();
        }
      }

      return false;
    }
  }

  return true;
};

Play.prototype.checkWarps = function (x, y) {
  for (var index in this.map.warps) {
    var warp = this.map.warps[index];

    if (warp.x === x && warp.y === y) {
      if (warp.level) {
        this.gameWorld.goNextLevel();
        this.loadMap(warp);
      } else {
        this.gameWorld.goPreviousLevel();
        this.loadMap(warp);
      }

      return true;
    }
  }

  for (var index in this.npcs) {
    var npc = this.npcs[index];

    if (npc.x === x && npc.y === y) {
      var self = this;
      console.log('Entering npc', npc.type);

      switch(npc.type) {
        case 0:
          this.openNPC(
            'Hospital',
            'Do you want to get healthy? <br/> <small>It will cost to you about $100</small>',
            ['yes', 'no'],
            function(choice) {
              if(choice === 'yes') {
                if(self.player.stats.money > 100) {
                  self.player.stats.money -= 100;
                  self.player.stats.hp = self.player.stats.maxHP;
                  self.showMessage('Thank you!');
                } else {
                  self.showMessage('You need more money!');
                }
              }
            }
          );
          break;
        case 1:
          this.openNPC(
            'Armor store',
            'Do you want to improve your armor STR+1? <br/> <small>It will cost to you about $100</small>',
            ['yes', 'no'],
            function(choice) {
              if(choice === 'yes') {
                if(self.player.stats.money > 100) {
                  self.player.stats.money -= 100;
                  self.player.stats.str += 1;
                  self.showMessage('Thank you!');
                } else {
                  self.showMessage('You need more money!');
                }
              }
            }
          );
          break;
        case 2:
          this.openNPC(
            'Shield store',
            'Do you want to improve your shield DEF+1? <br/> <small>It will cost to you about $100</small>',
            ['yes', 'no'],
            function(choice) {
              if(choice === 'yes') {
                if(self.player.stats.money > 100) {
                  self.player.stats.money -= 100;
                  self.player.stats.def += 1;
                  self.showMessage('Thank you!');
                } else {
                  self.showMessage('You need more money!');
                }
              }
            }
          );
          break;
      }
    }
  }
};

Play.prototype.movePlayer = function (left, top, action) {
  var locationBackup = {
    x: this.player.location.x,
    y: this.player.location.y
  };

  this.player.location.x += left;
  this.player.location.y += top;
  this.player.moving = true;

  if (this.player.location.x < 0) {
    this.player.location.x = 0;
  }

  if (this.player.location.y < 0) {
    this.player.location.y = 0;
  }

  if (this.player.location.x > this.map.size - 1) {
    this.player.location.x = this.map.size - 1;
  }

  if (this.player.location.y > this.map.size - 1) {
    this.player.location.y = this.map.size - 1;
  }

  if (!this.validCell(this.player.location.x, this.player.location.y)) {
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

    switch (action) {
      case 'attack':
        this.checkWarps(this.player.location.x, this.player.location.y);
        break;
    }
  }
};

Play.prototype.timerTick = function () {
  for (var index in this.mobs.entities) {
    var mob = this.mobs.entities[index];

    if (mob.isAlive()) {
      mob.chooseNextMove();
    } else {
      var textureModifier = Math.floor(Math.random() * 2) + 1;
      this.mobs.create(mob.location.x * this.map.tile.width, mob.location.y * this.map.tile.width, 'tiles', 240 + textureModifier);
      this.mobs.entities.splice(index, 1);
      mob.sprite.parent.remove(mob.sprite);
    }
  }

  this.timer.turn = true;
};

Play.prototype.update = function () {
  if (!this.player.sprite) {
    return;
  }

  if (this.timer.turn) {
    this.timer.turn = false;
    var self = this;
    setTimeout(function () {
      self.timerTick()
    }, 200);
  }

  if (!this.player.isAlive()) {
    this.player.sprite.animations.play('die');
    this.showMessage('GAME OVER!', {
      accept: function() {
        window.location.reload();
      }
    });
  }

  if (!this.player.moving && this.player.isAlive()) {
    this.game.input.update();

    if (this.cursors.down.isDown) {
      this.movePlayer(0, 1);
      this.player.orientation = 'down';
    } else if (this.cursors.up.isDown) {
      this.movePlayer(0, -1);
      this.player.orientation = 'up';
    } else if (this.cursors.left.isDown) {
      this.movePlayer(-1, 0);
      this.player.orientation = 'left';
    } else if (this.cursors.right.isDown) {
      this.movePlayer(1, 0);
      this.player.orientation = 'right';
    }

    if(this.player.moving) {
      this.player.sprite.animations.play('walk_'+this.player.orientation);
    } else {
      this.player.sprite.animations.play('look_'+this.player.orientation);
    }

    if (this.keys.spaceBar.isDown) {
      this.movePlayer(0, 0, 'attack');
      this.player.sprite.animations.play('attack');
    }
  }
};
