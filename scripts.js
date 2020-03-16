var DICE_SIZE = 25;
var OFFSET = 2;

var posDicePool = {'green': 0, 'yellow': 0, 'boost': 0};
var negDicePool = {'purple': 0, 'red': 0, 'setback': 0};

var posResults = {'S' : 0, 'A' : 0, 'R' : 0};
var negResults = {'F' : 0, 'T' : 0, 'D' : 0};

var greenDie = [ [], [], ['S'], ['A'], ['S', 'S'], ['A', 'A'], ['S', 'A'], ['S', 'A']];
var purpleDie =  [ [], [], ['F'], ['T'], ['F', 'F'], ['T', 'T'], ['F', 'T'], ['F', 'T']];
var yellowDie = [ [], [], ['S'], ['A'], ['S', 'S'], ['A', 'A'], ['S', 'A'], ['S', 'A']];
var redDie = [ [], [], ['F'], ['T'], ['F', 'F'], ['T', 'T'], ['F', 'T'], ['F', 'T']];
var boostDie = [ [], [], ['S'], ['A'], ['S', 'A'], ['A', 'A']];
var setbackDie = [ [], [], ['F'], ['T'], ['F', 'T'], ['F', 'F']];


var rollDice = function() {
  updatePool();
  posResults['S'] = 0;
  posResults['A'] = 0;
  posResults['R'] = 0;

  negResults['F'] = 0;
  negResults['T'] = 0;
  negResults['D'] = 0;

  var posDiceTypes = {'green': [greenDie, "#00FF00"], 'yellow' : [yellowDie, '#FFFF00'], 'boost': [boostDie, '#80dfff']};
  var posResultDisplay = document.getElementById('posresultc');
  var ctx = posResultDisplay.getContext('2d');

  ctx.clearRect(0, 0, 300, DICE_SIZE);
  var startx = 0;
  var keys = Object.keys(posDiceTypes);
  for (var i=0; i<keys.length; i++) {

    var dtype = keys[i];
    var die = posDiceTypes[dtype][0];

    for (var j=0; j<posDicePool[dtype]; j++) {
      var result = die[Math.floor(Math.random() * die.length)];
      var r = '' + result;
      ctx.fillStyle = posDiceTypes[dtype][1];
      ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
      if (r.length == 1) {
        ctx.font = "25px Georgia";
        posResults[r]+= 1;
      }
      else if (r.length == 3) {
        ctx.font = "15px Georgia";
        var rs = r.split(',');
        posResults[rs[0]]+= 1;
        posResults[rs[1]]+= 1;
      }
      ctx.fillStyle = "#000000";
      ctx.fillText(r, startx+1, 20);
      startx+= DICE_SIZE + OFFSET;
    }
  }

  var negDiceTypes = {'purple': [purpleDie, "#5c00e6"], 'red' : [redDie, '#FF0000'], 'setback': [setbackDie, '#000000']};
  var negResultDisplay = document.getElementById('negresultc');
  ctx = negResultDisplay.getContext('2d');

  ctx.clearRect(0, 0, 300, DICE_SIZE);
  startx = 0;
  keys = Object.keys(negDiceTypes);
  for (var i=0; i<keys.length; i++) {

    var dtype = keys[i];
    var die = negDiceTypes[dtype][0];

    for (var j=0; j<negDicePool[dtype]; j++) {
      var r = '' + die[Math.floor(Math.random() * die.length)];
      ctx.fillStyle = negDiceTypes[dtype][1];
      ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
      if (r.length == 1) {
        ctx.font = "20px Georgia";
        negResults[r]+= 1;
      }
      else if (r.length == 3) {
        ctx.font = "12px Georgia";
        var rs = r.split(',');
        negResults[rs[0]]+= 1;
        negResults[rs[1]]+= 1;
      }
      if (dtype == 'setback' || dtype == "purple")
        ctx.fillStyle = "#FFFFFF";
      else
        ctx.fillStyle = "#000000";
      ctx.fillText(r, startx+1, 18);
      startx+= DICE_SIZE + OFFSET;
    }
  }
  updateResultTotals();
};

var updateResultTotals = function() {
  document.getElementById("scount").innerText = posResults['S'];
  document.getElementById("acount").innerText = posResults['A'];
  document.getElementById("fcount").innerText = negResults['F'];
  document.getElementById("tcount").innerText = negResults['T'];

  document.getElementById("snet").innerText = (posResults['S'] - negResults['F']);
  document.getElementById("anet").innerText = (posResults['A'] - negResults['T']);
};


var updateDiceDisplay = function() {
  var posPoolDisplay = document.getElementById('pospool');
  var ctx = posPoolDisplay.getContext('2d');

  ctx.clearRect(0, 0, 300, DICE_SIZE);

  var startx = 0;
  var amt = posDicePool['green'];
  ctx.fillStyle = "#00FF00";
  for (var i=0; i<amt; i++) {
    ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
    startx+= DICE_SIZE + OFFSET;
  }
  amt = posDicePool['yellow'];
  ctx.fillStyle = "#FFFF00";
  for (var i=0; i<amt; i++) {
    ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
    startx+= DICE_SIZE + OFFSET;
  }
  amt = posDicePool['boost'];
  ctx.fillStyle = "#80dfff";
  for (var i=0; i<amt; i++) {
    ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
    startx+= DICE_SIZE + OFFSET;
  }

  var negPoolDisplay = document.getElementById('negpool');
  ctx = negPoolDisplay.getContext('2d');

  ctx.clearRect(0, 0, 300, DICE_SIZE);

  startx = 0;
  amt = negDicePool['purple'];
  ctx.fillStyle = "#5c00e6";
  for (var i=0; i<amt; i++) {
    ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
    startx+= DICE_SIZE + OFFSET;
  }
  amt = negDicePool['red'];
  ctx.fillStyle = "#FF0000";
  for (var i=0; i<amt; i++) {
    ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
    startx+= DICE_SIZE + OFFSET;
  }
  amt = negDicePool['setback'];
  ctx.fillStyle = "#000000";
  for (var i=0; i<amt; i++) {
    ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
    startx+= DICE_SIZE + OFFSET;
  }

};

var updatePool = function() {
  var g = document.getElementById('numgreen').value;
  var p = document.getElementById('numpurple').value;
  var y = document.getElementById('numyellow').value;
  var r = document.getElementById('numred').value;
  var b = document.getElementById('numboost').value;
  var s = document.getElementById('numsetback').value;

  posDicePool['green'] = g;
  posDicePool['yellow'] = y;
  posDicePool['boost'] = b;

  negDicePool['purple'] = p;
  negDicePool['red'] = r;
  negDicePool['setback'] = s;

  updateDiceDisplay();
};


document.getElementById('numgreen').addEventListener('change', updatePool);
document.getElementById('numyellow').addEventListener('change', updatePool);
document.getElementById('numboost').addEventListener('change', updatePool);
document.getElementById('numpurple').addEventListener('change', updatePool);
document.getElementById('numred').addEventListener('change', updatePool);
document.getElementById('numsetback').addEventListener('change', updatePool);
document.getElementById("roll").addEventListener('click', rollDice);
