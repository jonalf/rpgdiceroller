var DICE_SIZE = 25;
var OFFSET = 2;

var SUCCESS = 0;
var ADVANTAGE = 1;
var TRIUMPH = 2;
var FAILURE = 0;
var THREAT = 1;
var DESPAIR = 2;

var successImg = new Image();
successImg.src = "img/success.png";
var advantageImg = new Image();
advantageImg.src = "img/advantage.png";
var triumphImg = new Image();
triumphImg.src = "img/triumph.png";
var failureImg = new Image();
failureImg.src = "img/failure.png";
var threatImg = new Image();
threatImg.src = "img/threat.png";
var despairImg = new Image();
despairImg.src = "img/despair.png";

var posImages = [successImg, advantageImg, triumphImg];
var negImages = [failureImg, threatImg, despairImg];

var posDicePool = {'green': 0, 'yellow': 0, 'boost': 0};
var negDicePool = {'purple': 0, 'red': 0, 'setback': 0};

var posResults = [0, 0, 0];
var negResults = [0, 0, 0];

var greenDie = [ [], [SUCCESS], [SUCCESS], [SUCCESS, SUCCESS], [ADVANTAGE], [ADVANTAGE], [SUCCESS, ADVANTAGE], [ADVANTAGE, ADVANTAGE]];
var yellowDie = [ [], [SUCCESS], [SUCCESS], [SUCCESS, SUCCESS], [SUCCESS, SUCCESS], [ADVANTAGE], [SUCCESS, ADVANTAGE], [SUCCESS, ADVANTAGE], [SUCCESS, ADVANTAGE], [ADVANTAGE, ADVANTAGE], [ADVANTAGE, ADVANTAGE], [TRIUMPH]];
var boostDie = [ [], [], [SUCCESS], [SUCCESS, ADVANTAGE], [ADVANTAGE, ADVANTAGE], [ADVANTAGE]];

var purpleDie =  [ [], [FAILURE], [FAILURE, FAILURE], [THREAT], [THREAT], [THREAT], [FAILURE, THREAT]];
var redDie = [ [], [FAILURE], [FAILURE], [FAILURE, FAILURE], [FAILURE, FAILURE], [THREAT], [THREAT], [FAILURE, THREAT], [FAILURE, THREAT], [THREAT, THREAT], [THREAT, THREAT], [DESPAIR]];
var setbackDie = [ [], [], [FAILURE], [FAILURE], [THREAT], [THREAT]];


var rollDice = function() {
  updatePool();
  posResults = [0,0, 0];
  negResults = [0, 0, 0];

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

      ctx.fillStyle = posDiceTypes[dtype][1];
      ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
      if (result.length == 1) {
        posResults[result]+= 1;
        ctx.drawImage(posImages[result], startx, 0, DICE_SIZE, DICE_SIZE);
      }
      else if (result.length == 2) {

        posResults[result[0]]+= 1;
        posResults[result[1]]+= 1;

        ctx.drawImage(posImages[result[0]], startx, 0, DICE_SIZE/2, DICE_SIZE/2);
        ctx.drawImage(posImages[result[1]], startx + (DICE_SIZE)/2, DICE_SIZE/2, DICE_SIZE/2, DICE_SIZE/2);
      }
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
      result = die[Math.floor(Math.random() * die.length)];
      ctx.fillStyle = negDiceTypes[dtype][1];
      ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);

      if (result.length == 1) {
        negResults[result]+= 1;
        ctx.drawImage(negImages[result], startx, 0, DICE_SIZE, DICE_SIZE);
      }
      else if (result.length == 2) {
        negResults[result[0]]+= 1;
        negResults[result[1]]+= 1;
        ctx.drawImage(negImages[result[0]], startx, 0, DICE_SIZE/2, DICE_SIZE/2);
        ctx.drawImage(negImages[result[1]], startx + (DICE_SIZE)/2, DICE_SIZE/2, DICE_SIZE/2, DICE_SIZE/2);
      }
      if (dtype == 'setback' || dtype == "purple")
        ctx.fillStyle = "#FFFFFF";

      startx+= DICE_SIZE + OFFSET;
    }
  }
  updateResultTotals();
};

var updateResultTotals = function() {
  var u = posResults[TRIUMPH];
  var s = posResults[SUCCESS] + u;
  var a = posResults[ADVANTAGE];
  var d = negResults[DESPAIR];
  var f = negResults[FAILURE] + d;
  var t = negResults[THREAT];

  document.getElementById("scount").innerText = s;
  document.getElementById("acount").innerText = a;
  document.getElementById("fcount").innerText = f;
  document.getElementById("tcount").innerText = t;

  document.getElementById("ucount").innerText = u;
  document.getElementById("dcount").innerText = d;

  document.getElementById("snet").innerText = (s - f);
  document.getElementById("anet").innerText = (a - t);
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
