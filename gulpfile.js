'use strict';

var fs = require('fs');

fs.readdirSync('./tasks/')
  .forEach(function(file) {
    require('./tasks/' + file);
  });
