'use strict';

var Room = require('./room'),
  utils = require('../utils');

var World = module.exports = function() {
  this.roomsArray = [];
  this.room = null;
  this.currentRoomIndex = 0;
  this.currentLevel = 1;
};

World.prototype.init = function() {
  this.currentLevel = 1;
  var newRoom = new Room('maze', this.getMapSize()).init();
  this.roomsArray.push(newRoom);
  this.room = newRoom;
  this.currentRoomIndex = 0;
  this.isGoingInverse = false; /* This flag */
};

/*
 * @desc go to the next level
 */
World.prototype.goNextLevel = function(state) {
  this.room.saveState(state);
  if (this.roomsArray.length <= ++this.currentRoomIndex) {
    this.addNewRoom();
  }
  this.room = this.roomsArray[this.currentRoomIndex];
  this.isGoingInverse = false;
  return true;
};

/*
 * @desc go to the prev level
 * @return bool - success or failure
 */
World.prototype.goPreviousLevel = function(state) {
  this.room.saveState(state);
  if (0 <= this.currentRoomIndex - 1) {
    this.isGoingInverse = true;
    this.room = this.roomsArray[--this.currentRoomIndex];
    return true;
  }
  return false;
};

/*
 * @desc create and add a new room to the chain
 */
World.prototype.addNewRoom = function() {
  stepBiome();
  this.currentLevel++;
  var newRoom = new Room(this.mazeOrCave(), this.getMapSize(), currentBiome).init();
  this.roomsArray.push(newRoom);
};

World.prototype.mazeOrCave = function() {
  return utils.randomInt(3, 1) === 1 ? 'cave' : 'maze';
};

World.prototype.getPlayerSpawnPoint = function() {
  return this.room.map.getPlayerSpawnPoint();
};

/*
 * @desc get map size for given level
 * @return int - map size
 */
World.prototype.getMapSize = function() {
  var level = this.currentLevel < 7 ? 8 : this.currentLevel;
  var newSize = level * 2 + 1;
  return newSize > 100 ? 101 : newSize;
};

var fibonacci = (function(Math) {
  var sqrt5 = Math.sqrt(5),
    lnphi = Math.log(1 + sqrt5) - Math.LN2,
    exp = Math.exp,
    round = Math.round;

  return function(n) {
    if (n > 12) {
      return n && 144;
    }
    return n <= 7 ? n && 15 : round(exp(lnphi * n) / sqrt5);
  };
})(Math);

var previousBiome = null;
var currentBiome = 'forest';
var sameBiomeCounter = 0;

function stepBiome() {
  var next = getNextBiome(currentBiome);

  if (next === currentBiome) {
    sameBiomeCounter++;
  } else {
    sameBiomeCounter = 0;
  }

  previousBiome = currentBiome !== 'castle' && currentBiome !== 'cavern' ? currentBiome : previousBiome;
  currentBiome = next;
};

function getNextBiome(current) {
  var random = utils.randomInt(100, 0);

  if (current === 'forest') {
    if (random > 40 - sameBiomeCounter) {
      return 'forest'; // 60 %
    } else if (random > 20) {
      return 'desert'; // 20 %
    } else if (random > 10) {
      return 'snow';   // 10 %
    } else if (random > 5) {
      return 'castle'; // 5 %
    } else {
      return 'cavern'; // 5 %
    }
  } else if (current === 'desert') {
    if (random > 40 - sameBiomeCounter) {
      return 'desert'; // 60 %
    } else if (random > 20) {
      return 'forest'; // 20 %
    } else if (random > 10) {
      return 'castle'; // 10 %
    } else {
      return 'cavern'; // 10 %
    }
  } else if (current === 'snow') {
    if (random > 40 - sameBiomeCounter) {
      return 'snow';   // 60 %
    } else if (random > 20) {
      return 'forest'; // 20 %
    } else if (random > 10) {
      return 'castle'; // 10 %
    } else {
      return 'cavern'; // 10 %
    }
  } else if (current === 'castle') {
    if (random > 40) {
      return previousBiome; // 60 %
    } else {
      return 'castle'; // 40 %
    }
  } else if (current === 'cavern') {
    if (random > 40) {
      return previousBiome; // 60 %
    } else {
      return 'cavern'; // 40 %
    }
  }
};

// forest, snow, desert
// castle, cavern

