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


  var hasGP = false;
  var repGP;

  function canGame() {
    return "getGamepads" in navigator;
  }

  function reportOnGamepad() {
    var gp = navigator.getGamepads()[0];
    var html = "";
    html += "id: "+gp.id+"<br/>";

    for(var i=0;i<gp.buttons.length;i++) {
      html+= "Button "+(i+1)+": ";
      if(gp.buttons[i].pressed) html+= " pressed";
      html+= "<br/>";
    }

    for(var i=0;i<gp.axes.length; i+=2) {
      html+= "Stick "+(Math.ceil(i/2)+1)+": "+gp.axes[i]+","+gp.axes[i+1]+"<br/>";
    }

    if(gp.axes[1] == -1) {
    	sendForward()
		} else if(gp.axes[1] == 1) {
      sendBackward()
		}

    if(gp.axes[0] == -1) {
      sendLeft()
    }else if(gp.axes[0] == 1) {
      sendRight()
    }

    if(gp.axes[0] != -1 && gp.axes[0] != 1 && gp.axes[1] != -1 && gp.axes[1] != 1 ) {
      if (_movementState != DIR_STOP) {
    	  sendStop();
      }
		}

    $("#gamepadDisplay").html(html);
  }


  function init() {
    var savedIp = localStorage.getItem('ip');
    document.getElementById('serverip').value = savedIp;
    document.getElementById('connect').addEventListener('click', function() {
      localStorage.setItem('ip', document.getElementById('serverip').value);
      socket = io.connect('http://' + document.getElementById('serverip').value);
      initSocketEvents(socket);

      initKeyEvents();

      initGamepad();
    });
  }

	function initKeyEvents() {
    document.addEventListener('keydown', function(event) {
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

    document.addEventListener('keyup', function(event) {
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

    $('#forward').on("touchstart", function(event) {

      event.preventDefault();
      alert('test');

      // Don't repeat
      if (keyIsDown) {
        return;
      }

      keyIsDown = true;
      console.log('KEYDOWN');

      sendForward();

    });

    $('#backward').on("touchstart", function(event) {
      event.preventDefault();
      // Don't repeat
      if (keyIsDown) {
        return;
      }

      keyIsDown = true;
      console.log('KEYDOWN');

      sendBackward();

    });

    $('#left').on("touchstart", function(event) {
      event.preventDefault();
      // Don't repeat
      if (keyIsDown) {
        return;
      }

      keyIsDown = true;
      console.log('KEYDOWN');

      sendLeft();

    });

    $('#right').on("touchstart", function(event) {
      event.preventDefault();
      // Don't repeat
      if (keyIsDown) {
        return;
      }

      keyIsDown = true;


      sendRight();

    });

    $('#right, #backward, #left, #forward').on('touchend', function(event) {
      event.preventDefault();
      // Don't repeat
      if (!keyIsDown) {
        return;
      }

      keyIsDown = false;

      sendStop();

    });

    alert('events ready');

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
	  _movementState = DIR_STOP;
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

	function initGamepad() {
    var prompt = "To begin using your gamepad, connect it and press any button!";
    $("#gamepadPrompt").text(prompt);

    $(window).on("gamepadconnected", function() {
      hasGP = true;
      $("#gamepadPrompt").html("Gamepad connected!");
      console.log("connection event");
      repGP = window.setInterval(reportOnGamepad,100);
    });

    $(window).on("gamepaddisconnected", function() {
      console.log("disconnection event");
      $("#gamepadPrompt").text(prompt);
      window.clearInterval(repGP);
    });

    //setup an interval for Chrome
    var checkGP = window.setInterval(function() {
      console.log('checkGP');
      if(navigator.getGamepads()[0]) {
        if(!hasGP) $(window).trigger("gamepadconnected");
        window.clearInterval(checkGP);
      }
    }, 500);
  }

  if(canGame()) {
    init();
  }

}());
