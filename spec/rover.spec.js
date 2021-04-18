const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

describe("Rover class", function() {

  it("constructor sets position and default values for mode and generatorWatts", function()
  {
    let rover = new Rover(2424); 
    let results = {position: rover.position, mode: rover.mode, generatorWatts: rover.generatorWatts};  
    expect(results).toEqual({position: 2424, mode: 'NORMAL_POWER', generatorWatts: 110}); 
  });

  it("response returned by receiveMessage contains name of message", function() 
  {
    let commands = [new Command('MOVE', 20), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover(24);   
    let response = rover.receiveMessage(message);
    expect(response.message).toEqual('Test message with two commands');
  });

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function() 
  {
    let commands = [new Command('MOVE', 20), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover(24);   
    let response = rover.receiveMessage(message);
    expect(response.results.length).toEqual(2);
  });

 it("responds correctly to status check command", function() 
  {
    let commands = [new Command('MOVE', 2424), new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Status Check:', commands);
    let rover = new Rover(100);   
    let response = rover.receiveMessage(message);
    expect(response.results[2].roverStatus.mode).toEqual('LOW_POWER');
    expect(response.results[2].roverStatus.position).toEqual(2424);
    expect(response.results[2].roverStatus.generatorWatts).toEqual(110);
  });

it("responds correctly to mode change command", function() 
  {
    let commands = [new Command('MOVE', 2424), new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Status Check:', commands);
    let rover = new Rover(100);   
    let response = rover.receiveMessage(message);
    expect(response.results[0].completed).toBe(true);
    expect(response.results[2].roverStatus.mode).toEqual('LOW_POWER');     
  });

it("responds with false completed value when attempting to move in LOW_POWER mode", function() 
  {
    
    let commands = [new Command('MODE_CHANGE', 'NORMAL_POWER'), new Command('MOVE', 2424), new Command('STATUS_CHECK')];    
    let message = new Message('Status Check:', commands);
    let rover = new Rover(2424);
    commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('MOVE', 6969), new Command('STATUS_CHECK')];
    message = new Message('Power Change:', commands);
    let response = rover.receiveMessage(message);
 
    expect(response.results[1].completed).toBe(false);
    expect(response.results[2].roverStatus.position).toEqual(2424);
    expect(response.results[2].roverStatus.mode).toEqual('LOW_POWER');     
  });

  it("responds with position for move command", function() 
  {
    let rover = new Rover(100);
    let commands = [new Command('MOVE', 2424), new Command('STATUS_CHECK')];
    let message = new Message('Move to new position', commands);
    let response = rover.receiveMessage(message);

    expect(response.results[0].completed).toBe(true);  
    expect(rover.position).toEqual(2424);   
  });
  
});