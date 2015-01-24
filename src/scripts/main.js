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
