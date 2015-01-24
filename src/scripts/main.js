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

game.updateMapSize = function() {
  var width = window.innerWidth,
    height = window.innerHeight;

  game.height = height;
  game.width = width;
  game.renderer.resize(width, height);
  game.camera.setSize(width, height);
};

window.onresize = game.updateMapSize;

console.log('%c We are the %c#gamesRum ', 'background: #222; color: #aabb55', 'background: #222; color: #aaffee');

var World = require('./entities/world');
var world = new World();
world.init();

document.body.onkeydown = function(event) {
  event = event || window.event;
  var keycode = event.charCode || event.keyCode;
  if (keycode === 37) {
    console.log('<');
    console.log(world.goPreviousLevel());
    world.room.map.print();
    console.log(world.getPlayerSpawnPoint());
  } else if (keycode === 39) {
    console.log('>');
    console.log(world.goNextLevel());
    world.room.map.print();
    console.log(world.getPlayerSpawnPoint());
  } else {
    console.log('~');
  }
}


//var Maze = require('./entities/maze');
//var maze = new Maze(17);
//maze.generate();
//maze.print();
//
//var Cave = require('./entities/cave');
//var cave = new Cave(16);
//cave.generate();
//cave.print();
