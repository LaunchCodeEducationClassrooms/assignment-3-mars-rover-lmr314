const assert = require('assert');
const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

describe("Rover class", function() {

  it("constructor sets position and default values for mode and generatorWatts", function() {
    let rover = new Rover(4000);
    assert.strictEqual(rover.position, 4000);
    assert.strictEqual(rover.mode, 'NORMAL');
    assert.strictEqual(rover.generatorWatts, 110);
  });

  it("response returned by receiveMessage contains name of message", function() {
    let commands = [new Command('STATUS_CHECK'), new Command('MODE_CHANGE', 'LOW_POWER')]
    let message = new Message('name of message', commands)
    let rover = new Rover(2424);
    let actual = rover.receiveMessage(message).message;
    assert.strictEqual(actual, message.name);
  });

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function() {
    let commands = [new Command('STATUS_CHECK'), new Command('MODE_CHANGE', 'LOW_POWER')]
    let message = new Message('name of message', commands)
    let rover = new Rover(2340);
    let actual = rover.receiveMessage(message).results.length;
    assert.strictEqual(actual, 2);
  });

  it("responds correctly to status check command", function() {
    let commands = [new Command('STATUS_CHECK')]
    let message = new Message('name of message', commands)
    let rover = new Rover(2000);
    let actual = rover.receiveMessage(message).results[0];
    let expected = {
      completed: true,
      roverStatus: {
        mode: 'NORMAL',
        generatorWatts: 110,
        position: 2000
      }
    }
    assert.deepEqual(actual, expected);
  });

  it("responds correctly to mode change command", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER')]
    let message = new Message('tname of message', commands)
    let rover = new Rover(2000);
    let response = rover.receiveMessage(message);
    assert.strictEqual(rover.mode, 'LOW_POWER');
    assert.strictEqual(response.results[0].completed, true);
  });

  it("responds with false completed value when attempting to move in LOW_POWER mode", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('MOVE', 12)]
    let message = new Message('name of message', commands)
    let rover = new Rover(50);
    let response = rover.receiveMessage(message);
    assert.strictEqual(rover.mode, 'LOW_POWER');
    assert.strictEqual(response.results[0].completed, true);
    assert.strictEqual(rover.position, 50);
    assert.strictEqual(response.results[1].completed, false);
  });

  it("responds with position for move command", function() {
    let commands = [new Command('MOVE', 56)];
    let message = new Message('message name', commands)
    let rover = new Rover(20);
    rover.receiveMessage(message)
    assert.strictEqual(rover.position, 56);
  });

});