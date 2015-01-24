'use strict';

var utils = {};

/*
 * @desc function that returns the first argument
 * @param var k - any data
 * @return var - same argument
 */
utils.fnK = function(k) {
  return k;
};

/*
 * @desc generates a random integer in the range
 * @param int max - top limit
 * @param int min - bottom limit
 * @return int - a random number
 */
utils.randomInt = function(max, min) {
  min = min || 0;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = utils;
