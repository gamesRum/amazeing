'use strict';

var Room = require('./room');

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
};

/*
 * @desc go to the prev level
 * @return bool - success or failure
 */
World.prototype.goPreviousLevel = function(mobsState, itemsState) {
  this.room.saveState(mobsState, itemsState);
  if (0 <= this.currentRoomIndex - 1) {
    this.room = this.roomsArray[--this.currentRoomIndex];
  }
};

/*
 * @desc create and add a new room to the chain
 * @return bool - success or failure
 */
World.prototype.addNewRoom = function() {
  var newRoom = new Room('maze', 9).init();
  this.roomsArray.push(newRoom);
};
