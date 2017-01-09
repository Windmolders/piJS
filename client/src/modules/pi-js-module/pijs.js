
class piJS
{
  /**
   * Constructor function. Gets called when class is made into a object
   * @param {json} cfg
   */
  constructor(cfg) {

    this._robot = null;
    this._cfg = cfg;

    this.createRobot();
    this.initRobot();
    this.listenEvents();
    this.sendReadyMessage();
  }

  sendReadyMessage() {
    console.log('piJS Module ready');
    console.log(' Welcome to the GoPiGo test application             ')
    console.log(' When asked, insert a command to test your GoPiGo   ')
    console.log(' (!) For a complete list of commands, please type help')
  }

  listenEvents() {
    robot.on('init', (res) => {
      this.onInit(res);
    });
    robot.on('error', (err) => {
      this.onError(err);
    });
    robot.on('free', () => {
      this.onFree();
    });
    robot.on('halt', () => {
      this.onHalt();
    });
    robot.on('close',() => {
      this.onClose();
    });
    robot.on('reset', () => {
      this.onReset();
    });
    robot.on('normalVoltage', (voltage) => {
      this.onNormalVoltage(voltage);
    });
    robot.on('lowVoltage', (voltage) => {
      this.onLowVoltage(voltage);
    });
    robot.on('criticalVoltage', (voltage) => {
      this.onCriticalVoltage(voltage);
    })
  }

  createRobot() {
    this._robot = new Robot({
      minVoltage: 5.5,
      criticalVoltage: 1.2,
      debug: true,
      ultrasonicSensorPin: this._cfg.ultrasonicPin,
      //IRReceiverSensorPin: irreceiverPin
    })
  }

  initRobot() {
    this._robot.init()
  }

  askForCommand() {
    rl.question('What do you want me to do? > ', function (answer) {
      handleAnswer(answer)
    })
  }

  handleAnswer(answer) {
    let message = '';
    switch (answer) {
      case 'help':
        console.log('')
        console.log('reset => performs a reset of LEDs and servo motor')
        console.log('left led on => turn left led on')
        console.log('left led off => turn left led off')
        console.log('right led on => turn right led on')
        console.log('right led off => turn right led off')
        console.log('move forward => moves the GoPiGo forward')
        console.log('move backward => moves the GoPiGo backward')
        console.log('turn left => turns the GoPiGo to the left')
        console.log('turn right => turns the GoPiGo to the right')
        console.log('stop => stops the GoPiGo')
        console.log('increase speed => increases the motors speed')
        console.log('decrease speed => decreases the motors speed')
        console.log('voltage => returns the voltage value')
        console.log('servo test => performs a servo test')
        console.log('ultrasonic distance => returns the distance from an object')
        console.log('move forward with PID => moves the GoPiGo forward with PID')
        console.log('move backward with PID => moves the GoPiGo backward with PID')
        console.log('rotate left => rotates the GoPiGo to the left')
        console.log('rotate right => rotates the GoPiGo to the right')
        console.log('set encoder targeting => sets the encoder targeting')
        console.log('firmware version => returns the firmware version')
        console.log('board revision => returns the board revision')
        console.log('ir receive => returns the data from the IR receiver')
        console.log('exit => exits from this test')
        console.log('')
        break
      case 'reset':
        robot.reset()
        break
      case 'left led on':
        var res = robot.ledLeft.on()
        console.log('Left led on::'+res)
        break
      case 'left led off':
        var res = robot.ledLeft.off()
        console.log('Left led off::'+res)
        break
      case 'right led on':
        var res = robot.ledRight.on()
        console.log('Right led on::'+res)
        break
      case 'right led off':
        var res = robot.ledRight.off()
        console.log('Right led off::'+res)
        break
      case 'move forward':
      case 'w':
        var res = robot.motion.forward(false)
        console.log('Moving forward::' + res)
        break
      case 'turn left':
      case 'a':
        var res = robot.motion.left()
        console.log('Turning left::' + res)
        break
      case 'turn right':
      case 'd':
        var res = robot.motion.right()
        console.log('Turning right::' + res)
        break
      case 'move backward':
      case 's':
        var res = robot.motion.backward(false)
        console.log('Moving backward::' + res)
        break
      case 'stop':
      case 'x':
        var res = robot.motion.stop()
        console.log('Stop::' + res)
        break
      case 'increase speed':
      case 't':
        var res = robot.motion.increaseSpeed()
        console.log('Increasing speed::' + res)
        break
      case 'decrease speed':
      case 'g':
        var res = robot.motion.decreaseSpeed()
        console.log('Decreasing speed::' + res)
        break
      case 'voltage':
      case 'v':
        var res = robot.board.getVoltage()
        console.log('Voltage::' + res + ' V')
        break
      case 'servo test':
      case 'b':
        robot.servo.move(0)
        console.log('Servo in position 0')

        robot.board.wait(1000)
        robot.servo.move(180)
        console.log('Servo in position 180')

        robot.board.wait(1000)
        robot.servo.move(90)
        console.log('Servo in position 90')
        break
      case 'exit':
      case 'z':
        robot.close()
        process.exit()
        break
      case 'ultrasonic distance':
      case 'u':
        var res = robot.ultraSonicSensor.getDistance()
        console.log('Ultrasonic Distance::' + res + ' cm')
        break
      case 'ir receive':
        var res = robot.IRReceiverSensor.read()
        console.log('IR Receiver data::')
        console.log(res)
        break
      case 'l':
        // TODO
        break
      case 'move forward with pid':
      case 'i':
        var res = robot.motion.forward(true)
        console.log('Moving forward::' + res)
        break
      case 'move backward with pid':
      case 'k':
        var res = robot.motion.backward(true)
        console.log('Moving backward::' + res)
        break
      case 'rotate left':
      case 'n':
        var res = robot.motion.leftWithRotation()
        console.log('Rotating left::' + res)
        break
      case 'rotate right':
      case 'm':
        var res = robot.motion.rightWithRotation()
        console.log('Rotating right::' + res)
        break
      case 'set encoder targeting':
      case 'y':
        var res = robot.encoders.targeting(1, 1, 18)
        console.log('Setting encoder targeting:1:1:18::' + res)
        break
      case 'firmware version':
      case 'f':
        var res = robot.board.version()
        console.log('Firmware version::' + res)
        break
      case 'board revision':
        var res = robot.board.revision()
        console.log('Board revision::' + res)
        break
    }

    robot.board.wait(1000);
    this.askForCommand();
  }







  /**
   * Events
   */

  onInit(res) {
    if (res) {
      console.log('GoPiGo Ready!')
      askForCommand()
    } else {
      console.log('Something went wrong during the init.')
    }
  }

  onError(err) {
    console.log('Something went wrong');
    console.log(err);
  }

  onFree() {
    console.log('GoPiGo is free to go');
  }

  onHalt() {
    console.log('GoPiGo is halted');
  }

  onClose() {
    console.log('GoPiGo is going to sleep');
  }

  onReset() {
    console.log('GoPiGo is resetting')
  }

  onNormalVoltage(voltage) {
    console.log('Voltage is ok [' + voltage + ']');
  };

  onLowVoltage(voltage) {
    console.log('(!!) Voltage is low ['+voltage+']')
  };

  onCriticalVoltage(voltage) {
    console.log('(!!!) Voltage is critical ['+voltage+']')
  };

}

module.exports = piJS;