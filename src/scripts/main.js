'use strict';

var cfg = require('../../config');

var game = new Phaser.Game(cfg);

game.state.add('boot', require('./states/boot'));
game.state.add('preloader', require('./states/preloader'));
game.state.add('menu', require('./states/menu'));
game.state.add('play', require('./states/play'));
game.state.start('boot');

console.log('%c We are %c#gamesRum ', 'background: #222; color: #aabb55', 'background: #222; color: #aaffee');
var Room = require('./entities/room');
var room = new Room();
room.generate('maze');
