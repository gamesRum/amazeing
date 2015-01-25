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

/*
 * @desc generates a random name
 * @return stirng - name
 */
utils.generateRandomName = function() {
  return this.adjetives[this.randomInt(this.adjetives.length)] + ' ' + this.nouns[this.randomInt(this.nouns.length)];
};

utils.adjetives = [
  'Clean', 'Fancy', 'Long', 'Magnificent', 'Plain', 'Ugly', 'Green', 'Black', 'White', 'Gray', 'Yellow', 'Red', 'Odd',
  'Rich', 'Shy', 'Quiet', 'Vast', 'Wrong', 'Angry', 'Clumsy', 'Fierce', 'Itchy', 'Lazy', 'Mysterious', 'Wild', 'Scary',
  'Brave', 'Nice', 'Silly', 'Lovely', 'Chubby', 'Broad', 'Deep', 'Flat', 'High', 'Low', 'Narrow', 'Round', 'Skinny',
  'Square', 'Straight', 'Big', 'Colossal', 'Fat', 'Gigantic', 'Great', 'Huge', 'Immense', 'Large', 'Raspy', 'Loud',
  'Voiceless', 'Ancient', 'Old', 'Young', 'Creepy', 'Dirty', 'Wet', 'Empty'
];

utils.nouns = [
  'Jungle', 'Park', 'Woods', 'Woodland', 'Backwoods', 'Fort', 'Palace', 'Villa', 'Town', 'Château', 'State', 'Path',
  'Aisle', 'Avenue', 'Way', 'Lane', 'Line', 'Passage', 'Rail', 'Road', 'Route', 'Street', 'Track', 'Trail', 'Byway',
  'Footpath', 'Pass', 'Rut', 'Shorcut', 'Stroll', 'Terrace', 'Walk', 'Course', 'Subway', 'Crossroad', 'Link',
  'Overpass', 'Branch', 'Wing'
];

module.exports = utils;
