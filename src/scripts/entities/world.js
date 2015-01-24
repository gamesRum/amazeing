'use strict';

var Room = require('./room'),
  utils = require('../utils');

var World = module.exports = function() {
  this.roomsArray = [];
  this.room = null;
  this.currentRoomIndex = 0;
};

World.prototype.init = function() {
  var newRoom = new Room('maze', 5).init();
  this.roomsArray.push(newRoom);
  this.room = newRoom;
  this.currentRoomIndex = 0;
};

/*
 * @desc go to the next level
 */
World.prototype.goNextLevel = function(mobsState, itemsState) {
  this.room.saveState(mobsState, itemsState);
  if (this.roomsArray.length <= ++this.currentRoomIndex) {
    this.addNewRoom();
  }
  this.room = this.roomsArray[this.currentRoomIndex];
  return true;
};

/*
 * @desc go to the prev level
 * @return bool - success or failure
 */
World.prototype.goPreviousLevel = function(mobsState, itemsState) {
  this.room.saveState(mobsState, itemsState);
  if (0 <= this.currentRoomIndex - 1) {
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
  var newRoom = new Room('maze', 9, currentBiome).init();
  this.roomsArray.push(newRoom);
};

World.prototype.getPlayerSpawnPoint = function() {
  return this.room.map.getPlayerSpawnPoint();
};

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

