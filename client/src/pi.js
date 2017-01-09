

/**
 * Load all external dependencies
 * We use var so it's global available : ) ( not let,const)
 */
var fs      = require('fs');
var _ = require('lodash');


/**
 * Load all internal dependencies
 */
const cfg     = require('../config.js');
var pkg     = require('../package.json');
var piJS     = require('./modules/pi-js-module');

let pi = new piJS(cfg);

var io = require('socket.io')(9090);

io.on('connection', function(socket) {
  console.info('socket connected. (' + socket.id + ')');

  socket.on('forward', function() {
    pi.handleAnswer('move forward');
    socket.emit('forward');
    console.info('forward');
  });

  socket.on('backward', function() {
    pi.handleAnswer('move backward');
    socket.emit('backward');
    console.info('backward');
  });

  socket.on('left', function() {
    pi.handleAnswer('move left');
    socket.emit('left');
    console.info('left');
  });

  socket.on('right', function() {
    pi.handleAnswer('move right');
    socket.emit('right');
    console.info('right');
  });

  socket.on('stop', function() {
    pi.handleAnswer('move stop');
    socket.emit('stop');
    console.info('stop');
  });
});
