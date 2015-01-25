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
},
animations = {
  ogre: {
    attack: [56,60,64,68],
    look_down: [56],
    look_left: [60],
    look_right: [64],
    look_up: [68],
    walk_down: [56,57,58,59],
    walk_left: [60,61,62,63],
    walk_right: [64,65,66,67],
    walk_up: [68,69,70,71],
    damage: [72,73,74,75],
    die: [83]
  },
  human: {
    attack: [0,4,8,12],
    look_down: [0],
    look_left: [4],
    look_right: [8],
    look_up: [12],
    walk_down: [0, 1, 2, 3],
    walk_left: [4, 5, 6, 7],
    walk_right: [8, 9, 10, 11],
    walk_up: [12, 13, 14, 15],
    damage: [16, 17, 18, 19],
    die: [27]
  },
  zombie: {
    attack: [28,32,36,40],
    look_down: [28],
    look_left: [32],
    look_right: [36],
    look_up: [40],
    walk_down: [28, 29, 30, 31],
    walk_left: [32, 33, 34, 35],
    walk_right: [36, 37, 38, 39],
    walk_up: [40,41,42,43],
    damage: [44, 45, 46, 47],
    die: [55]
  }
};

var $statusBar = document.getElementById('status'),
    $messageBox = document.getElementById('messageBox'),
    $popupBox = document.getElementById('popupBox'),
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

Play.prototype.hideMessage = function ($element) {
  if(!$element) {
    $element = $messageBox;
  }

  $element.className = "hidden";
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

Play.prototype.showPopup = function (message, faceClass) {
  $statusBar.style.display = 'block';
  $popupBox.className = "visible";

  if(!faceClass) {
    faceClass = this.player.race;
  }

  $popupBox.innerHTML = '<blockquote><div class="' + faceClass + ' "></div><p>' + message + '</p></blockquote>';

  var self = this;
  setTimeout(function () {
    self.hideMessage($popupBox);
  }, 2000);
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

      if(index < 1) {
        $optionButton.focus();
      }
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
  var mobCount = Math.round(this.map.size * 0.5),
      mobID = 0;

  this.mobs = this.game.add.group();
  this.mobs.enableBody = true;
  this.mobs.physicsBodyType = Phaser.Physics.ARCADE;
  this.mobs.entities = [];

  while(mobCount > 0) {
    var i = Math.floor((Math.random() * this.map.size)),
      j = Math.floor((Math.random() * this.map.size));

    if (this.map.walkable[i][j]) {
      var mobBaseLevel = Math.floor((Math.random() * 3)),
        o = mobBaseLevel * 3,
        mobSprite = this.mobs.create(i * this.map.tile.width, j * this.map.tile.width, 'mobs', 1);

      mobSprite.health = Math.round(2.5 * mobBaseLevel);
      mobSprite.customDefense = Math.round(1.2 * mobBaseLevel);
      mobSprite.customGodMode = false;

      mobSprite.body.immovable = true;
      mobSprite.animations.add('walk_left', [12 + o, 13 + o, 14 + o], 10, true);
      mobSprite.animations.add('walk_right', [24 + o, 25 + o, 26 + o], 10, true);
      mobSprite.animations.add('walk_up', [36 + o, 37 + o, 38 + o], 10, true);
      mobSprite.animations.add('walk_down', [0 + o, 1 + o, 2 + o], 10, true);
      mobSprite.animations.add('damage', [0, 1, 2], 10, true);
      mobSprite.animations.add('attack', [0, 1, 2], 10, true);

      this.mobs.entities.push(new Mob(mobID++, this.game, this.player, i, j, (i + j) + i, i, {
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

  this.showPopup('Entering ' + this.map.name);

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
  this.sword.sprite.bringToTop();
};

Play.prototype.loadMap = function (map) {
  this.player.sprite = this.game.add.sprite(this.player.width, this.player.height, 'avatar');
  this.player.sprite.position.x = this.player.location.x * this.player.width;
  this.player.sprite.position.y = this.player.location.y * this.player.height;
  this.player.sprite.bringToTop();

  this.player.sprite.animations.add('look_left', animations[this.player.race].look_left, 1, false);
  this.player.sprite.animations.add('look_right', animations[this.player.race].look_right, 1, false);
  this.player.sprite.animations.add('look_up', animations[this.player.race].look_up, 1, false);
  this.player.sprite.animations.add('look_down', animations[this.player.race].look_down, 1, false);

  this.player.sprite.animations.add('walk_left', animations[this.player.race].walk_left, 10, true);
  this.player.sprite.animations.add('walk_right', animations[this.player.race].walk_right, 10, true);
  this.player.sprite.animations.add('walk_up', animations[this.player.race].walk_up, 10, true);
  this.player.sprite.animations.add('walk_down', animations[this.player.race].walk_down, 10, true);

  this.player.sprite.animations.add('damage', animations[this.player.race].damage, 10, true);
  this.player.sprite.animations.add('attack', animations[this.player.race].attack, 10, true);
  this.player.sprite.animations.add('die', animations[this.player.race].die, 1, false);

  this.sword = {};
  this.sword.sprite = this.game.add.sprite(-34, -34, 'items', 70);
  this.sword.sprite.name = 'sword';
  this.sword.sprite.physicsBodyType = Phaser.Physics.ARCADE;
  this.sword.sprite.exists = false;

  this.game.camera.follow(this.player.sprite);
  this.player.sprite.animations.play('look_down');

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

  this.game.physics.startSystem(Phaser.Physics.ARCADE);

  this.gameWorld.init();
  this.game.stage.disableVisibilityChange = true;
  this.game.stage.backgroundColor = 0x222222;

  this.textGroup = this.game.add.group();

  //this.game.add.tween(textGroup.scale).to( { x: 0.5, y: 0.5 }, 2000, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE, true);
  this.game.add.tween(this.textGroup.scale).to({ x: 0.5, y: 0.5 },2000,Phaser.Easing.Linear.None,true);

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
        case 'zombie':
          self.player.stats = {
            money: 300,
            maxHP: 50,
            hp: 1,
            str: 1,
            def: 1
          };
          break;
        default:
          choice = 'human';
          self.player.stats = {
            money: 100,
            maxHP: 100,
            hp: 10,
            str: 2,
            def: 2
          };
      }

      self.player.race = choice;
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

      switch(npc.type) {
        case 0:
          self.showPopup('Hello, darling!!!', 'hospital');
          this.openNPC(
            'Hospital',
            'Do you want to get healthy? <br/> <small>It will cost to you about $100</small>',
            ['yes', 'no'],
            function(choice) {
              if(choice === 'yes') {
                if(self.player.stats.money >= 100) {
                  self.player.stats.money -= 100;
                  self.player.stats.hp = self.player.stats.maxHP;
                  self.showPopup('Thank you!!!', 'hospital');
                } else {
                  self.showPopup('You need more money!!!', 'hospital');
                }
              }
            }
          );
          break;
        case 1:
          self.showPopup('Welcome, foreigner!!!', 'armor');
          this.openNPC(
            'Armor store',
            'Do you want to improve your armor STR+1? <br/> <small>It will cost to you about $100</small>',
            ['yes', 'no'],
            function(choice) {
              if(choice === 'yes') {
                if(self.player.stats.money >= 100) {
                  self.player.stats.money -= 100;
                  self.player.stats.str += 1;
                  self.showPopup('Thank you!!!', 'armor');
                } else {
                  self.showPopup('You need more money!!!', 'armor');
                }
              }
            }
          );
          break;
        case 2:
          self.showPopup('Are you looking for adventure?', 'shield');
          this.openNPC(
            'Shield store',
            'Do you want to improve your shield DEF+1? <br/> <small>It will cost to you about $100</small>',
            ['yes', 'no'],
            function(choice) {
              if(choice === 'yes') {
                if(self.player.stats.money >= 100) {
                  self.player.stats.money -= 100;
                  self.player.stats.def += 1;
                  self.showPopup('Thank you!!!', 'shield');
                } else {
                  self.showPopup('You need more money!!!', 'shield');
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

    if (mob.isAlive() && mob.sprite.alive) {
      mob.chooseNextMove();
    } else {
      var textureModifier = Math.floor(Math.random() * 2) + 1;
      var newMob = this.mobs.create(mob.location.x * this.map.tile.width, mob.location.y * this.map.tile.width, 'tiles', 240 + textureModifier);
      this.mobs.entities.splice(index, 1);
      newMob.customDeath = true;
      mob.sprite.parent.remove(mob.sprite);
    }
  }

  this.timer.turn = true;
};

Play.prototype.update = function() {
  var self = this;

  if (!this.player.sprite) {
    return;
  }

  this.game.physics.arcade.overlap(this.sword.sprite, this.mobs, function(sword, mob) {
    if (mob.customGodMode || !mob.alive || mob.customDeath) {
      return;
    }
    mob.customGodMode = true;

    var pointsPerDefense = Math.round(mob.customDefense * 0.5) || 0;
    var damage = (self.player.stats.str * 2) - pointsPerDefense;
    mob.damage(damage || 0);

    var damageText = self.game.add.text(mob.position.x, mob.position.y, '-' + damage, {
      font: "bold 20px Arial",
      fill: "#ff0044",
      align: "center"
    });

    self.game.time.events.add(100, function() {
      self.game.add.tween(damageText).to({y: 0}, 1500, Phaser.Easing.Linear.None, true);
      self.game.add.tween(damageText).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true);
    }, self);

    setTimeout(function() {
      mob.customGodMode = false;
    }, 400);

    if (!mob.alive) {
      self.player.stats.money += 100;
    }

  }, null, this);

  if (this.timer.turn) {
    this.timer.turn = false;
    setTimeout(function() {
      self.timerTick();
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

  if (!this.player.moving && this.player.isAlive() && !this.player.isAttacking) {
    this.game.input.update();

    if (this.keys.spaceBar.isDown && !this.player.isAttacking) {
      this.player.isAttacking = true;
      this.movePlayer(0, 0, 'attack');

      this.sword.sprite.exists = true;
      this.game.physics.enable(this.sword.sprite, Phaser.Physics.ARCADE);
      this.sword.sprite.bringToTop();

      if (this.player.orientation === 'up') {
        this.sword.sprite.angle = 45;
        this.sword.sprite.position.x = this.player.sprite.position.x + 16;
        this.sword.sprite.position.y = this.player.sprite.position.y - 32;
        this.sword.sprite.body.offset.x = -18;
        this.sword.sprite.body.offset.y = 0;
        this.player.sprite.bringToTop();
      } else if (this.player.orientation === 'down') {
        this.sword.sprite.angle = -135;
        this.sword.sprite.position.x = this.player.sprite.position.x + 16;
        this.sword.sprite.position.y = this.player.sprite.position.y + 64;
        this.sword.sprite.body.offset.x = -18;
        this.sword.sprite.body.offset.y = -34;
      } else if (this.player.orientation === 'right') {
        this.sword.sprite.angle = 135;
        this.sword.sprite.position.x = this.player.sprite.position.x + 60;
        this.sword.sprite.position.y = this.player.sprite.position.y + 20;
        this.sword.sprite.body.offset.x = -34;
        this.sword.sprite.body.offset.y = -20;
      } else {
        this.sword.sprite.angle = -45;
        this.sword.sprite.position.x = this.player.sprite.position.x - 28;
        this.sword.sprite.position.y = this.player.sprite.position.y + 20;
        this.sword.sprite.body.offset.x = 0;
        this.sword.sprite.body.offset.y = -20;
      }

      setTimeout(function() {
        self.player.isAttacking = false;
        self.sword.sprite.exists = false;
      }, 400);
      return;
    }

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

    if (this.player.moving) {
      this.player.sprite.animations.play('walk_' + this.player.orientation);
    } else {
      this.player.sprite.animations.play('look_' + this.player.orientation);
    }
  }
};
