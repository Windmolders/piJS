(function() {
	'use strict';
	var DIR_FORWARD = 1;
	var DIR_BACKWARD = 2;
	var DIR_LEFT = 3;
	var DIR_RIGHT = 4;
	var DIR_STOP = 0;
	var socket = null;
	var keyIsDown = false;

	var _movementState = DIR_STOP;

	function init() {
	  var savedIp = localStorage.getItem('ip');
	  document.getElementById('serverip').value = savedIp;
	  document.getElementById('connect').addEventListener('click', function() {
      localStorage.setItem('ip', document.getElementById('serverip').value);
		  socket = io.connect('http://' + document.getElementById('serverip').value);
		  initSocketEvents(socket);

		  initKeyEvents();
    });
	}

	function initKeyEvents() {
    document.addEventListener('keydown', (event) => {
      // Don't repeat
      if (keyIsDown) {
        return;
      }
      const keyName = event.key;

      keyIsDown = true;
      console.log('KEYDOWN');
      switch (keyName) {
        case 'z':
        case 'w':
          sendForward();
          break;
        case 's':
          sendBackward();
          break;
        case 'q':
        case 'a':
          sendLeft();
          break;
        case 'd':
          sendRight();
          break;
        default:
          sendStop();
          break;
      }
    }, false);

    document.addEventListener('keyup', (event) => {
      // Don't repeat
      if (!keyIsDown) {
        return;
      }
      const keyName = event.key;

      keyIsDown = false;
      console.log('KEYUP');
      switch (keyName) {
        default:
          sendStop();
          break;
      }
    }, false);
  }

	function initSocketEvents(socket) {
		socket.on('forward', function() {
			// Driving forward
			setMovementState(DIR_FORWARD);
		});

		socket.on('backward', function() {
			// Driving backwards
      setMovementState(DIR_BACKWARD);
    });

		socket.on('left', function() {
			// Driving left
      setMovementState(DIR_LEFT);
    });

		socket.on('right', function() {
			// Driving right
      setMovementState(DIR_RIGHT);
    });

		socket.on('stop', function() {
			// Stop
      setMovementState(DIR_STOP);
    });
	}

  /**
   * @param state
   */
	function setMovementState(state) {
		switch (state) {
			case DIR_STOP:
				_movementState = DIR_STOP;
				break;
			case DIR_FORWARD:
        _movementState = DIR_FORWARD;
        break;
			case DIR_BACKWARD:
				_movementState = DIR_BACKWARD;
				break;
			case DIR_LEFT:
        _movementState = DIR_LEFT;
        break;
			case DIR_RIGHT:
        _movementState = DIR_RIGHT;
        break;
			default:
				_movementState = DIR_STOP;
				break;
		}
		updateMovementState();
	}

	function sendForward() {
		socket.emit('forward');
	}

	function sendBackward() {
    socket.emit('backward');
	}

	function sendLeft() {
    socket.emit('left');
	}

	function sendRight() {
    socket.emit('right');
	}

	function sendStop() {
    socket.emit('stop');
	}

  function updateMovementState() {
    document.querySelectorAll('button').forEach(function(btn){
			btn.className = '';
		});

  	if (_movementState == DIR_FORWARD) {
			document.getElementById('forward').className = 'active';
		}
		if (_movementState == DIR_BACKWARD) {
      document.getElementById('backward').className = 'active';
    }
    if (_movementState == DIR_LEFT) {
      document.getElementById('left').className = 'active';
    }
    if (_movementState == DIR_RIGHT) {
      document.getElementById('right').className = 'active';
    }
	}

  init();

}());
