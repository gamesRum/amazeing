'use strict';

var Map = require('./map');

var Cave = module.exports = function() {
  Map.apply(this, arguments);
};

Cave.prototype = Object.create(Map.prototype);
Cave.prototype.constructor = Cave;

/*
 * @desc generates an cave type map
 * @return bool - success or failure
 */
Cave.prototype.generate = function() {
  this.map = this.generateEmpty(this.size);
  return true;
};
