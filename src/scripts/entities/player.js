'use strict';

var Being = require('./being');

var Player = module.exports = function(name, genre) {
  Being.call(this);
};

Player.prototype = Object.create(Being.prototype);
Player.prototype.constructor = Player;

Being.prototype.update = function() {
  Being.call(this);
};
