var deegray_stats = {
  'wounds' : 0,
  'strain' : 0,
  'soak' : 10,
  'woundthresh' : 26,
  'strainthresh' : 14,
  'rangeddef' : 1,
  'meleeddef' : 1,
  'brawn' : 6,
  'agility' : 4,
  'intellect' : 2,
  'cunning' : 2,
  'willpower' : 3,
  'pressence' : 1,
  'astrogation' : 0,
  'athletics' : 0,
  'charm' : 0,
  'coercion' : 1,
  'computers' : 0,
  'cool' : 0,
  'coordination' : 1,
  'deception' : 0,
  'discipline' :1,
  'leadership' : 1,
  'mechanics' : 0,
  'medicine' : 0,
  'negotiation' : 0,
  'perception' : 0,
  'pilot-planet' : 2,
  'pilot-space' : 0,
  'resilience' : 1,
  'skullduggery' : 0,
  'stealth' : 0,
  'streetwise' : 0,
  'survival' : 0,
  'vigilance' : 1,
  'brawl' : 1,
  'melee' : 3,
  'lightsaber' : 5,
  'ranged-light' : 0,
  'ranged-heavy' : 3,
  'gunnery' : 1
};

var weapons = {
  'ls_pike' : {
    name : 'Lightsaber Pike',
    type : 'lightsaber',
    crit : 2,
    accurate : 0,
    pierce : 10,
    damage : 9
  },
  'ichor_sword' : {
    name : 'Ichor Sword',
    type : 'melee',
    crit : 1,
    accurate : 2,
    pierce : 1,
    damage : 16
  },
  'bo_rifle2' : {
    name : 'Ancient Bo Rifle',
    type : 'melee',
    crit : 3,
    accurate : 3,
    pierce : 3,
    damage : 15
  },
  'bo_rifle2_ranged' : {
    name : 'Ancient Bo Rifle',
    type : 'ranged-heavy',
    crit : 3,
    accurate : 3,
    pierce : 3,
    damage : 10
  },
  'bo_rifle' : {
    name : 'Bo Rifle',
    type : 'melee',
    crit : 4,
    accurate : 2,
    pierce : 0,
    damage : 14
  },
  'bo_rifle_ranged' : {
    name : 'Bo Rifle',
    type : 'ranged-heavy',
    crit : 4,
    accurate : 2,
    pierce : 0,
    damage : 8
  }
};

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

var netsuccess = 0;
var netfailure = 0;

var greenDie = [ [], [SUCCESS], [SUCCESS], [SUCCESS, SUCCESS], [ADVANTAGE], [ADVANTAGE], [SUCCESS, ADVANTAGE], [ADVANTAGE, ADVANTAGE]];
var yellowDie = [ [], [SUCCESS], [SUCCESS], [SUCCESS, SUCCESS], [SUCCESS, SUCCESS], [ADVANTAGE], [SUCCESS, ADVANTAGE], [SUCCESS, ADVANTAGE], [SUCCESS, ADVANTAGE], [ADVANTAGE, ADVANTAGE], [ADVANTAGE, ADVANTAGE], [TRIUMPH]];
var boostDie = [ [], [], [SUCCESS], [SUCCESS, ADVANTAGE], [ADVANTAGE, ADVANTAGE], [ADVANTAGE]];

var purpleDie =  [ [], [FAILURE], [FAILURE, FAILURE], [THREAT], [THREAT], [THREAT], [FAILURE, THREAT]];
var redDie = [ [], [FAILURE], [FAILURE], [FAILURE, FAILURE], [FAILURE, FAILURE], [THREAT], [THREAT], [FAILURE, THREAT], [FAILURE, THREAT], [THREAT, THREAT], [THREAT, THREAT], [DESPAIR]];
var setbackDie = [ [], [], [FAILURE], [FAILURE], [THREAT], [THREAT]];

var charateristics = ['brawn', 'agility', 'intellect', 'cunning', 'willpower', 'pressence'];

var combat_skills = ['brawl', 'melee', 'lightsaber', 'ranged-light', 'ranged-heavy', 'gunnery'];
var knowledge_skills = ['core worlds', 'education', 'lore', 'outer rim', 'underworld', 'xenology'];

var check_table = {
  'brawl' : 'brawn',
  'melee' : 'brawn',
  'lightsaber' : 'brawn',
  'ranged-light' : 'agility',
  'ranged-heavy' : 'agility',
  'gunnery' : 'agility',
  'astrogation' : 'intellect',
  'athletics' : 'brawn',
  'charm' : 'pressence',
  'coercion' : 'willpower',
  'computers' : 'intellect',
  'cool' : 'pressence',
  'coordination' : 'agility',
  'deception' : 'cunning',
  'discipline' : 'willpower',
  'leadership' : 'pressence',
  'mechanics' : 'intellect',
  'medicine' : 'intellect',
  'negotiation' : 'pressence',
  'perception' : 'cunning',
  'pilot-planet' : 'agility',
  'pilot-space' : 'agility',
  'resilience' : 'brawn',
  'skullduggery' : 'cunning',
  'stealth' : 'agility',
  'streetwise' : 'cunning',
  'survival' : 'cunning',
  'vigilance' : 'willpower',
  'core worlds' : 'intellect',
  'education' : 'intellect',
  'lore' : 'intellect',
  'outer rim' : 'intellect',
  'underworld' : 'intellect',
  'xenology' : 'intellect'
};


var load_deegray = function() {
  var stat_keys = Object.keys(deegray_stats);
  for (var i=0; i<stat_keys.length; i++) {
    var e = document.getElementById( stat_keys[i] );
    //console.log(stat_keys[i]);
    //console.log(deegray_stats[ stat_keys[i]] );
    e.value = deegray_stats[ stat_keys[i] ];
  }

  load_weapons();
};




// <th></th><th>Name</th><th>Type</th><th>Crit</th><th>Accurate</th><th>Pierce</th><th>Damage</th>
var load_weapons = function() {
  var weapon_table = document.getElementById("weapons");

  var weapon_keys = Object.keys(weapons);
  for (var i=0; i < weapon_keys.length; i++) {
    var weapon = weapons[weapon_keys[i]];
    //console.log(weapon);
    var weapon_row = weapon_table.insertRow(-1);

    //add radio button
    var rad = document.createElement("input");
    rad.type = "radio";
    rad.name = "weapon";
    rad.id = "weapon_" + weapon_keys[i];

    var rad_cell = weapon_row.insertCell(-1);
    rad_cell.appendChild(rad);
    var weapon_info = Object.keys(weapon);
    for (var j=0; j<weapon_info.length; j++) {
      var weapon_stat = weapon[weapon_info[j]];
      var cell = weapon_row.insertCell(-1);
      if (typeof(weapon_stat) == 'string') {
        cell.innerHTML = weapon_stat;
      }
      else {
        var input = document.createElement("input");
        input.type = "number";
        input.name = weapon_keys[i] + '_' + weapon_info[j];
        input.id = weapon_keys[i] + '_' + weapon_info[j];
        input.value = weapon_stat;
        input.style.width = "50px";
        cell.appendChild(input);
      }
    }//weapon info
  }//weapons
};




var setup_skills = function() {

  var combat_table = document.createElement("table");
  var knowledge_table = document.createElement("table");
  var table = document.createElement("table");
  table.style.float = "left";
  table.style.border = "1px solid";
  combat_table.style.border = "1px solid";
  knowledge_table.style.border = "1px solid";

  var skills = Object.keys(check_table);
  for (var i=0; i<skills.length; i++) {
    //console.log(skills[i]);
    var row = document.createElement('tr');
    var tdr = document.createElement('td');
    var radio = document.createElement('input');
    radio.type = "radio";
    radio.name="check_type";
    radio.id = skills[i] + "_check";
    tdr.appendChild(radio);
    var name = skills[i].charAt(0).toUpperCase() + skills[i].slice(1);
    tdr.innerHTML+= name;
    var tdi = document.createElement('td');
    var input = document.createElement('input');
    input.type = "number";
    input.id = skills[i];
    input.min = "0";
    input.style.width = "50px";
    tdi.appendChild(input);
    row.appendChild(tdr);
    row.appendChild(tdi);
    if ( combat_skills.includes(skills[i]))
    combat_table.appendChild(row);
    else if (knowledge_skills.includes(skills[i]))
    knowledge_table.appendChild(row);
    else
    table.appendChild(row);
  }
  document.getElementById("skills").appendChild( table );
  document.getElementById("skills").appendChild( combat_table );
  document.getElementById("skills").appendChild( knowledge_table );
};

var get_check = function( e ) {
  var skill = e.target.id.split('_')[0];
  set_dice(skill);
};

var set_dice = function( skill ) {
  var chara = check_table[skill];
  var num_skill = document.getElementById(skill).value;
  var num_char = document.getElementById(chara).value;
  var num_dice = Math.max(num_skill, num_char);
  var num_yellow = Math.min(num_skill, num_char);
  document.getElementById('numgreen').value = (num_dice - num_yellow);
  document.getElementById('numyellow').value = num_yellow;

  updatePool();
};

var rollDice = function() {
  updatePool();
  posResults = [0,0, 0];
  negResults = [0, 0, 0];

  var posDiceTypes = {'green': [greenDie, "#00FF00"], 'yellow' : [yellowDie, '#FFFF00'], 'boost': [boostDie, '#80dfff']};
  //var posResultDisplay = document.getElementById('posresultc');
  var posResultDisplay = document.getElementById('pospool');
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
  //var negResultDisplay = document.getElementById('negresultc');
  var negResultDisplay = document.getElementById('negpool');
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

  if ( (s-f) > 0 ) {
    netsuccess+= 1;
  }
  else {
    netfailure+= 1;
  }
  var check_type  = document.querySelector('input[name="check_type"]:checked').id;
      //console.log(check_type);
  if (check_type == 'melee_check' ||
      check_type == 'lightsaber_check' ||
      check_type == 'ranged-heavy_check' ||
      check_type == 'ranged-light_check') {

    var weapon_name = document.querySelector('input[name="weapon"]:checked').id;
    weapon_name = weapon_name.slice(weapon_name.search('_') + 1);
    var damage = parseInt(document.getElementById(weapon_name + '_damage').value);

    //console.log(weapon_name);

    document.getElementById("total_damage").value = 0;
    if ((s-f) > 0) {
      damage+= (s-f);
      document.getElementById("total_damage").value = damage;
    }
}
};

var multi_roll = function(n) {
  netsuccess = 0;
  netfailure = 0;
  while (n > 0) {
    rollDice();
    n-= 1;
  }

  console.log( "success: " + netsuccess);
  console.log( "failure: " + netfailure);
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

var setup = function() {
  setup_skills();
  var checks = document.getElementsByName('check_type');
  for (var i=0; i<checks.length; i++) {
    checks[i].addEventListener('click', get_check);
  }
};
