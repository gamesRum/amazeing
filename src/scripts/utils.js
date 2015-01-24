'use strict';

var utils = {};

utils.fnK = function(k) {
  return k;
};

utils.nextInt = function(max) {
  return Math.floor(Math.random() * max);
};

module.exports = utils;
