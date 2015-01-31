'use strict';

var sizesDesktop = {
    width: 1024,
    height: 600
  },
  game = new Phaser.Game({
    parent: 'game-window'
  });

game.state.add('boot', require('./states/boot'));
game.state.add('preloader', require('./states/preloader'));
game.state.add('play', require('./states/play'));
game.state.start('boot');

game.updateMapSize = function() {
  var current = window.mobileMode ? {
    width: window.innerWidth,
    height: window.innerHeight
  } : sizesDesktop;

  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.setScreenSize();

  game.height = current.height;
  game.width = current.width;
  game.renderer.resize(current.width, current.height);
  game.camera.setSize(current.width, current.height);
};

window.onresize = function() {
  if ($.os.phone) {
    window.mobileMode = true;
    game.updateMapSize();
  } else {
    window.mobileMode = false;
    game.updateMapSize();
    $('#virtualPad').hide();
  }
  console.log(window.mobileMode);
};

console.log('%c We are the %c#gamesRum ', 'background: #222; color: #aabb55', 'background: #222; color: #aaffee');
