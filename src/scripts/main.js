'use strict';

var game = new Phaser.Game({
    height: window.innerHeight,
    width: window.innerWidth,
    parent: 'content'
});

game.state.add('boot', require('./states/boot'));
game.state.add('preloader', require('./states/preloader'));
game.state.add('menu', require('./states/menu'));
game.state.add('play', require('./states/play'));
game.state.start('boot');

console.log('%c We are the %c#gamesRum ', 'background: #222; color: #aabb55', 'background: #222; color: #aaffee');
var Room = require('./entities/room');
var room = new Room(15);
room.generate('maze');

var line = [];
room.iterate(function(item) {
  line.push(item);
}, function() {
  console.log(line.join(''));
  line = [];
});
