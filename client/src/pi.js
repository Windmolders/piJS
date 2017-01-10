

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
  var isDriving = false;
  console.info('socket connected. (' + socket.id + ')');

  socket.on('forward', function(speed) {
    if (isDriving) {
      return;
    }
    isDriving = true;
    pi.handleAnswer('move forward', speed);
    socket.emit('forward');
    console.info('forward');
  });

  socket.on('backward', function(speed) {
    if (isDriving) {
      return;
    }
    isDriving = true;
    pi.handleAnswer('move backward', speed);
    socket.emit('backward');
    console.info('backward');
  });

  socket.on('left', function(speed) {
    if (isDriving) {
      return;
    }
    isDriving = true;
    pi.handleAnswer('turn left', speed);
    socket.emit('left');
    console.info('left');
  });

  socket.on('right', function(speed) {
    if (isDriving) {
      return;
    }
    isDriving = true;
    pi.handleAnswer('turn right', speed);
    socket.emit('right');
    console.info('right');
  });

  socket.on('stop', function() {
    isDriving = false;
    pi.handleAnswer('stop');
    socket.emit('stop');
    console.info('stop');
  });
});
