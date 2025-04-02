var char_stats = {
  'wounds' : 0,
  'strain' : 0,
  'soak' :0,
  'woundthresh' : 0,
  'strainthresh' : 0,
  'rangeddef' :0,
  'meleeddef' :0,
  'brawn' :0,
  'agility' :0,
  'intellect' :0,
  'cunning' :0,
  'willpower' :0,
  'pressence' :0,
  'astrogation' : 0,
  'athletics' : 0,
  'charm' : 0,
  'coercion' : 0,
  'computers' : 0,
  'cool' : 0,
  'coordination' : 0,
  'deception' : 0,
  'discipline' :0,
  'leadership' : 0,
  'lore': 0,
  'mechanics' : 0,
  'medicine' : 0,
  'negotiation' : 0,
  'outer-rim' : 0,
  'core worlds' : 0,
  'education' : 0,
  'perception' : 0,
  'pilot-planet' : 0,
  'pilot-space' : 0,
  'resilience' : 0,
  'skullduggery' : 0,
  'stealth' : 0,
  'streetwise' : 0,
  'survival' : 0,
  'underworld' : 0,
  'vigilance' : 0,
  'xenology' : 0,
  'brawl_skill' : 0,
  'melee_skill' : 0,
  'lightsaber_skill' : 0,
  'ranged-light_skill' : 0,
  'ranged-heavy_skill' : 0,
  'gunnery_skill' : 0
};

var weapons = {
};


var DICE_SIZE = 40;
var OFFSET = 2;
var DICE_DISPLAY_WIDTH = 400;

var SUCCESS = 0;
var ADVANTAGE = 1;
var TRIUMPH = 2;
var FAILURE = 0;
var THREAT = 1;
var DESPAIR = 2;
var DARK = 3;
var LIGHT = 4;

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
var lightImg = new Image();
lightImg.src = "img/light.png";
var darkImg = new Image();
darkImg.src = "img/dark.png";

var posImages = [successImg, advantageImg, triumphImg, lightImg, darkImg];
var negImages = [failureImg, threatImg, despairImg];

var posDicePool = {'green': 0, 'yellow': 0, 'boost': 0, 'force': 0};
var negDicePool = {'purple': 0, 'red': 0, 'setback': 0};

var posResults = [0, 0, 0];
var negResults = [0, 0, 0];

var netsuccess = 0;
var netfailure = 0;

var greenDie = [ [], [SUCCESS], [SUCCESS], [SUCCESS, SUCCESS], [ADVANTAGE], [ADVANTAGE], [SUCCESS, ADVANTAGE], [ADVANTAGE, ADVANTAGE]];
var yellowDie = [ [], [SUCCESS], [SUCCESS], [SUCCESS, SUCCESS], [SUCCESS, SUCCESS], [ADVANTAGE], [SUCCESS, ADVANTAGE], [SUCCESS, ADVANTAGE], [SUCCESS, ADVANTAGE], [ADVANTAGE, ADVANTAGE], [ADVANTAGE, ADVANTAGE], [TRIUMPH]];
var boostDie = [ [], [], [SUCCESS], [SUCCESS, ADVANTAGE], [ADVANTAGE, ADVANTAGE], [ADVANTAGE]];

var forceDie = [[DARK], [DARK], [DARK], [DARK], [DARK], [DARK], [DARK, DARK], [LIGHT], [LIGHT], [LIGHT, LIGHT], [LIGHT, LIGHT], [LIGHT, LIGHT]];

var purpleDie =  [ [], [FAILURE], [FAILURE, FAILURE], [THREAT], [THREAT], [THREAT], [FAILURE, THREAT]];
var redDie = [ [], [FAILURE], [FAILURE], [FAILURE, FAILURE], [FAILURE, FAILURE], [THREAT], [THREAT], [FAILURE, THREAT], [FAILURE, THREAT], [THREAT, THREAT], [THREAT, THREAT], [DESPAIR]];
var setbackDie = [ [], [], [FAILURE], [FAILURE], [THREAT], [THREAT]];

var charateristics = ['brawn', 'agility', 'intellect', 'cunning', 'willpower', 'pressence'];

var combat_skills = ['brawl', 'melee', 'lightsaber', 'ranged-light', 'ranged-heavy', 'gunnery'];
var knowledge_skills = ['core worlds', 'education', 'lore', 'outer rim', 'underworld', 'xenology'];

var check_table = {
  'brawl_skill' : 'brawn',
  'melee_skill' : 'brawn',
  'lightsaber_skill' : 'willpower',
  'ranged-light_skill' : 'agility',
  'ranged-heavy_skill' : 'agility',
  'gunnery_skill' : 'agility',
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
  'outer-rim' : 'intellect',
  'underworld' : 'intellect',
  'xenology' : 'intellect'
};


var load_teru = function() {
  var stat_keys = Object.keys(teru_stats);
  for (var i=0; i<stat_keys.length; i++) {
    var e = document.getElementById( stat_keys[i] );
    //console.log(stat_keys[i]);
    //console.log(deegray_stats[ stat_keys[i]] );
    e.value = teru_stats[ stat_keys[i] ];
  }

  load_weapons();
};

var load_stats = function() {
  var stat_keys = Object.keys(char_stats);
  for (var i=0; i<stat_keys.length; i++) {
    var e = document.getElementById( stat_keys[i] );
    //console.log(stat_keys[i]);
    //console.log(deegray_stats[ stat_keys[i]] );
    e.value = char_stats[ stat_keys[i] ];
  }
};

var add_weapon_table = function() {
  //get weapon table
  var weapon_table = document.getElementById("weapons");
  //create & return new row:
  var weapon_row = weapon_table.insertRow(-1);

  //var weapon_id = "w" + (Object.keys(weapons).length-1);
  var weapon_id = 'w' + (document.getElementById("weapons").rows.length-1);


  //create weapon select button
  var rad = document.createElement("input");
  rad.type = "radio";
  rad.name = "weapon";
  rad.id = weapon_id;
  //make cell and insert radio button
  var rad_cell = weapon_row.insertCell(-1);
  rad_cell.appendChild(rad);

  //name entry
  var name_input = document.createElement("input");
  name_input.id = weapon_id + '_name';
  var name_cell = weapon_row.insertCell(-1);
  name_cell.appendChild(name_input);


  //weapon type selector
  var weapon_types = ['ranged-light', 'ranged-heavy', 'gunnery', 'melee', 'lightsaber', 'brawl'];
  var type_selector = document.createElement("select");
  type_selector.id= weapon_id + '_type';//more figuring
  for (var i=0; i<weapon_types.length; i++) {
    var type_option = document.createElement("option");
    type_option.id = weapon_types[i];
    type_option.text = weapon_types[i];
    type_option.value = weapon_types[i];
    type_selector.appendChild(type_option);
  }//add weapon types
  var type_cell = weapon_row.insertCell(-1);
  type_cell.appendChild(type_selector);

  //weapon range selector
  var weapon_ranges = ['engaged', 'short', 'medium', 'long', 'extreme'];
  var range_selector = document.createElement("select");
  range_selector.id = weapon_id + '_range';
  for (var i=0; i<weapon_ranges.length; i++) {
    var range_option = document.createElement("option");
    range_option.id = weapon_ranges[i];
    range_option.text = weapon_ranges[i];
    range_option.value = weapon_ranges[i];
    range_selector.appendChild(range_option);
  }//add weapon ranges
  var range_cell = weapon_row.insertCell(-1);
  range_cell.appendChild(range_selector);

  //number stat entries:
  var num_stats = ['damage', 'crit', 'accurate', `pierce`, `breach`, `linked`, `sunder`, 'burn', `blast`, `unweildy`, `hp`];
  for (var i=0; i<num_stats.length; i++) {
    var input = document.createElement("input");
    input.type = "number";
    input.name = weapon_id + "_" + num_stats[i];//weapon_keys[i] + '_' + weapon_info[j];
    input.id = weapon_id + "_" + num_stats[i];
    input.value = 0;
    input.style.width = "50px";
    var cell = weapon_row.insertCell(-1);
    cell.appendChild(input);
  }//add numeric stats
};
var load_weapons_table = function() {
  var weapon_table = document.getElementById("weapons");
  weapon_table.innerHTML = "";
  var weapon_keys = Object.keys(weapons);
  for (var i=0; i < weapon_keys.length; i++) {
    if (weapon_keys[i] != 'none') {
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
        if ( isNaN(weapon_stat) ) {//typeof(weapon_stat) == 'string') {
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
    }
  }//weapons
};

var add_weapon = function() {
  //get weapon table
  var weapon_table = document.getElementById("weapons");
  //create & return new row:
  var weapon_row = document.createElement("div");
  weapon_row.classList.add("container");

  var weapon_id = 'w' + (document.getElementById("weapons").childElementCount-1);

  //create weapon select button
  var rad = document.createElement("input");
  rad.type = "radio";
  rad.name = "weapon";
  rad.id = weapon_id;
  weapon_row.appendChild(rad);

  //name entry
  var name_input = document.createElement("input");
  name_input.id = weapon_id + '_name';
  weapon_row.appendChild(name_input);

  //weapon type selector
  var weapon_types = ['ranged-light', 'ranged-heavy', 'gunnery', 'melee', 'lightsaber', 'brawl'];
  var type_selector = document.createElement("select");
  type_selector.id= weapon_id + '_type';//more figuring
  for (var i=0; i<weapon_types.length; i++) {
    var type_option = document.createElement("option");
    type_option.id = weapon_types[i];
    type_option.text = weapon_types[i];
    type_option.value = weapon_types[i];
    type_selector.appendChild(type_option);
  }//add weapon types
  weapon_row.appendChild(type_selector);

  //weapon range selector
  var weapon_ranges = ['engaged', 'short', 'medium', 'long', 'extreme'];
  var range_selector = document.createElement("select");
  range_selector.id = weapon_id + '_range';
  for (var i=0; i<weapon_ranges.length; i++) {
    var range_option = document.createElement("option");
    range_option.id = weapon_ranges[i];
    range_option.text = weapon_ranges[i];
    range_option.value = weapon_ranges[i];
    range_selector.appendChild(range_option);
  }//add weapon ranges
  weapon_row.appendChild(range_selector);

  //number stat entries:
  var num_stats = ['damage', 'crit', 'accurate', `pierce`, `breach`, `linked`, `sunder`, 'burn', `blast`, `unweildy`, `hp`];
  for (var i=0; i<num_stats.length; i++) {
    var stat_div = document.createElement("div");
    stat_div.classList.add("vertical");
    stat_div.classList.add("item-center");
    stat_div.innerText = num_stats[i];
    var input = document.createElement("input");
    input.type = "number";
    input.name = weapon_id + "_" + num_stats[i];//weapon_keys[i] + '_' + weapon_info[j];
    input.id = weapon_id + "_" + num_stats[i];
    input.value = 0;
    input.style.width = "50px";
    stat_div.appendChild(input);
    weapon_row.appendChild(stat_div);
  }//add numeric stats
  weapon_table.appendChild(weapon_row);
};


// <th></th><th>Name</th><th>Type</th><th>Crit</th><th>Accurate</th><th>Pierce</th><th>Damage</th>
var load_weapons = function() {
  var weapon_table = document.getElementById("weapons");
  weapon_table.innerHTML = "";
  var weapon_keys = Object.keys(weapons);
  for (var i=0; i < weapon_keys.length; i++) {
    if (weapon_keys[i] != 'none') {
      var weapon = weapons[weapon_keys[i]];
      //console.log(weapon);
      var weapon_row = document.createElement("div");
      weapon_row.classList.add("container");

      //add radio button
      var rad = document.createElement("input");
      rad.type = "radio";
      rad.name = "weapon";
      rad.id = "weapon_" + weapon_keys[i];
      weapon_row.appendChild(rad);

      var weapon_info = Object.keys(weapon);
      for (var j=0; j<weapon_info.length; j++) {
        var weapon_stat = weapon[weapon_info[j]];

        if ( isNaN(weapon_stat) ) {//typeof(weapon_stat) == 'string') {
          var weapon_text = document.createElement("span");
          weapon_text.style.paddingRight = "10px";
          weapon_text.style.paddingTop = "10px";
          weapon_text.style.fontSize = "1.25em";
          weapon_text.innerHTML = weapon_stat;
          weapon_row.appendChild(weapon_text);
        }
        else {
          var stat_div = document.createElement("div");
          stat_div.classList.add("vertical");
          stat_div.classList.add("item-center");
          stat_div.innerText = weapon_info[j];
          var input = document.createElement("input");
          input.type = "number";
          input.name = weapon_keys[i] + '_' + weapon_info[j];
          input.id = weapon_keys[i] + '_' + weapon_info[j];
          input.value = weapon_stat;
          input.style.width = "50px";
          stat_div.appendChild(input);
          weapon_row.appendChild(stat_div);
        }
      }//weapon info
      weapon_table.appendChild(weapon_row);
    }
  }//weapons
};


//var check_table = {
var setup_skills_div = function() {

  //create a div for each check type
  var skill_divs = {};
  for (var i=0; i< charateristics.length; i++) {
    var char_type = charateristics[i];
    var skill_div = document.createElement("div");
    skill_div.classList.add("vertical");
    skill_div.style.paddingBottom = "5px";
    var skill_type = document.createElement("h4");
    skill_type.innerHTML = char_type;
    skill_type.style.padding = "0px";
    skill_type.style.borderBottom = "1px solid gray";
    skill_type.style.margin = "0px";
    skill_type.style.marginBottom = "2px";
    skill_type.style.alignSelf = "center";
    skill_div.appendChild(skill_type);
    skill_divs[char_type] = skill_div;
  }

  var skills = Object.keys(check_table);
  for (i=0; i< skills.length; i++) {
    var skill = skills[i];
    var charateristic = check_table[skill];
    //create input
    var span = document.createElement('div');
    span.style.display = "flex";
    span.style.flexDirection = "row";
    span.style.alignSelf = "stretch";
    span.style.justifyContent = "space-between";
    var radio = document.createElement('input');
    radio.type = "radio";
    radio.name="check_type";
    radio.id = skills[i] + "_check";
    var name = skills[i].charAt(0).toUpperCase() + skills[i].slice(1);
    name = name.split('_')[0];
    var input = document.createElement('input');
    input.classList.add("self-right");
    input.type = "number";
    input.id = skills[i];
    input.min = "0";
    input.style.width = "50px";
    span.appendChild(radio);
    span.innerHTML += name;
    span.appendChild(input);
    skill_divs[charateristic].appendChild(span);
  }

  document.getElementById("skills").innerHTML = '';
  var sds = Object.keys(skill_divs);
  for (i=0; i< sds.length; i++) {
    document.getElementById("skills").appendChild( skill_divs[sds[i]] );
  }
  return skill_divs;
};



var get_check = function( e ) {
  var c = e.target.id.lastIndexOf('_');
  var skill = e.target.id.substr(0, c);
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

/*===========================
  DICE FUNCTIONS
  ===========================*/
var rollDiceOld = function() {
  updatePool();
  posResults = [0,0, 0, 0];
  negResults = [0, 0, 0];

  var posDiceTypes = {'green': [greenDie, "#00FF00"], 'yellow' : [yellowDie, '#FFFF00'], 'boost': [boostDie, '#80dfff'], 'force': [forceDie, '#FFFFFF']};
  //var posResultDisplay = document.getElementById('posresultc');
  var posResultDisplay = document.getElementById('pospool');
  var ctx = posResultDisplay.getContext('2d');

  ctx.clearRect(0, 0, DICE_DISPLAY_WIDTH, DICE_SIZE);
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

  ctx.clearRect(0, 0, DICE_DISPLAY_WIDTH, DICE_SIZE);
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
var displayDiceResults = function(posDice, negDice) {

  var posDiceTypes = {'green': "#00FF00", 'yellow' : '#FFFF00', 'boost': '#80dfff', 'force':'#FFFFFF'};
  var posResultDisplay = document.getElementById('pospool');
  var ctx = posResultDisplay.getContext('2d');

  ctx.clearRect(0, 0, DICE_DISPLAY_WIDTH, DICE_SIZE);
  var startx = 0;

  for (var i=0; i<posDice.length; i++) {

    var dtype = posDice[i][0];
    var result = posDice[i][1];

    ctx.fillStyle = posDiceTypes[dtype];
    ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
    if (result.length == 1) {
      ctx.drawImage(posImages[result], startx, 0, DICE_SIZE, DICE_SIZE);
    }
    else if (result.length == 2) {

      ctx.drawImage(posImages[result[0]], startx, 0, DICE_SIZE/2, DICE_SIZE/2);
      ctx.drawImage(posImages[result[1]], startx + (DICE_SIZE)/2, DICE_SIZE/2, DICE_SIZE/2, DICE_SIZE/2);
    }
    startx+= DICE_SIZE + OFFSET;
  }

  var negDiceTypes = {'purple': "#5c00e6", 'red' : '#FF0000', 'setback': '#000000'};
  var negResultDisplay = document.getElementById('negpool');
  ctx = negResultDisplay.getContext('2d');

  ctx.clearRect(0, 0, DICE_DISPLAY_WIDTH, DICE_SIZE);
  startx = 0;
  for (var i=0; i<negDice.length; i++) {

    var dtype = negDice[i][0];
    var result = negDice[i][1];

    ctx.fillStyle = negDiceTypes[dtype];
    ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);

    if (result.length == 1) {
      ctx.drawImage(negImages[result], startx, 0, DICE_SIZE, DICE_SIZE);
    }
    else if (result.length == 2) {
      ctx.drawImage(negImages[result[0]], startx, 0, DICE_SIZE/2, DICE_SIZE/2);
      ctx.drawImage(negImages[result[1]], startx + (DICE_SIZE)/2, DICE_SIZE/2, DICE_SIZE/2, DICE_SIZE/2);
    }
    startx+= DICE_SIZE + OFFSET;
  }
};
var rollDice = function() {
  updatePool();
  posResults = [0,0, 0, 0];
  negResults = [0, 0, 0];
  posDice = [];
  negDice = [];
  var posDiceTypes = {'green': greenDie, 'yellow' : yellowDie, 'boost': boostDie, 'force': forceDie};
  var keys = Object.keys(posDiceTypes);
  for (var i=0; i<keys.length; i++) {

    var dtype = keys[i];
    var die = posDiceTypes[dtype];
    for (var j=0; j<posDicePool[dtype]; j++) {
      var result = die[Math.floor(Math.random() * die.length)];
      posDice.push([dtype, result]);

      if (result.length == 1) {
        posResults[result]+= 1;
      }
      else if (result.length == 2) {

        posResults[result[0]]+= 1;
        posResults[result[1]]+= 1;
      }
    }
  }//roll positive dice
  //console.log(posDice);

  var negDiceTypes = {'purple': purpleDie, 'red' : redDie, 'setback': setbackDie};
  keys = Object.keys(negDiceTypes);
  for (var i=0; i<keys.length; i++) {

    var dtype = keys[i];
    var die = negDiceTypes[dtype];

    for (var j=0; j<negDicePool[dtype]; j++) {
      var result = die[Math.floor(Math.random() * die.length)];
      negDice.push([dtype, result]);

      if (result.length == 1) {
        negResults[result]+= 1;
      }
      else if (result.length == 2) {
        negResults[result[0]]+= 1;
        negResults[result[1]]+= 1;
      }
    }
  }
  //console.log(negDice);
  //displayDiceResults(posDice, negDice);
  displayDiceResultsDOM(posDice, negDice);
  updateResultTotals();
};
var displayDiceResultsDOM = function(posDice, negDice) {

  var posDiceTypes = {'green': "#00FF00", 'yellow' : '#FFFF00', 'boost': '#80dfff', 'force':'#fff8dc'};
  var posResultDisplay = document.getElementById('pospool0');
  posResultDisplay.innerHTML = "";
  for (var i=0; i<posDice.length; i++) {

    var dtype = posDice[i][0];
    var result = posDice[i][1];

    var die = document.createElement('span');
    die.classList.add('die');//new
    die.style.backgroundColor = posDiceTypes[dtype];
    posResultDisplay.appendChild(die);
    if (result.length == 1) {
      var img = document.createElement('img');
      img.src = posImages[result].src;
      img.width = DICE_SIZE;
      img.height = DICE_SIZE;
      die.appendChild(img);
    }
    else if (result.length == 2) {
      var img = document.createElement('img');
      img.src = posImages[result[0]].src;
      img.width = DICE_SIZE/2;
      img.height = DICE_SIZE/2;
      die.appendChild(img);
      img = document.createElement('img');
      img.src = posImages[result[1]].src;
      img.width = DICE_SIZE/2;
      img.height = DICE_SIZE/2;
      die.appendChild(img);
    }
  }//positive dice

  var negDiceTypes = {'purple': "#5c00e6", 'red' : '#FF0000', 'setback': '#000000'};
  var negResultDisplay = document.getElementById('negpool0');
  negResultDisplay.innerHTML = "";

  for (var i=0; i<negDice.length; i++) {

    var dtype = negDice[i][0];
    var result = negDice[i][1];

    var die = document.createElement('span');
    die.classList.add('die');//new
    die.style.backgroundColor = negDiceTypes[dtype];
    negResultDisplay.appendChild(die);

    if (result.length == 1) {
      var img = document.createElement('img');
      img.src = negImages[result].src;
      img.width = DICE_SIZE;
      img.height = DICE_SIZE;
      die.appendChild(img);
    }
    else if (result.length == 2) {
      var img = document.createElement('img');
      img.src = negImages[result[0]].src;
      img.width = DICE_SIZE/2;
      img.height = DICE_SIZE/2;
      die.appendChild(img);
      img = document.createElement('img');
      img.src = negImages[result[1]].src;
      img.width = DICE_SIZE/2;
      img.height = DICE_SIZE/2;
      die.appendChild(img);
    }
  }
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
  var check_type  = document.querySelector('input[name="check_type"]:checked');
  if (check_type != null) {
    check_type = check_type.id;
    //console.log(check_type);
    if (check_type == 'melee_skill_check' ||
        check_type == 'lightsaber_skill_check' ||
        check_type == 'ranged-heavy_skill_check' ||
        check_type == 'ranged-light_skill_check' ||
        check_type == 'gunnery_skill_check' ||
        check_type == 'brawl_skill_check') {
      console.log('combat check');
      var weapon_name = document.querySelector('input[name="weapon"]:checked').id;
      weapon_name = weapon_name.slice(weapon_name.search('_') + 1);
      console.log(weapon_name);
      var damage = parseInt(document.getElementById(weapon_name + '_damage').value);

      //console.log(weapon_name);

      document.getElementById("total_damage").value = 0;
      if ((s-f) > 0) {
        damage+= (s-f);
        document.getElementById("total_damage").value = damage;
      }
    }//combat check
  }//there is a check selected
};//updateResultTotals
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
var updateDiceDisplayDOM = function() {
  /* DOM DICE TESTING */
  var posPoolDisplay = document.getElementById('pospool0');
  posPoolDisplay.innerHTML = "";

  var amt = posDicePool['green'];
  for (var i=0; i<amt; i++) {
    var die = document.createElement('span');
    die.classList.add('die');//new
    die.style.backgroundColor = "#00FF00";
    posPoolDisplay.appendChild(die);
  }
  amt = posDicePool['yellow'];
  for (var i=0; i<amt; i++) {
    var die = document.createElement('span');
    die.classList.add('die');//new
    die.style.backgroundColor = "#FFFF00";
    posPoolDisplay.appendChild(die);
  }
  amt = posDicePool['boost'];
  for (var i=0; i<amt; i++) {
    var die = document.createElement('span');
    die.classList.add('die');//new
    die.style.backgroundColor = "#80dfff";
    posPoolDisplay.appendChild(die);
  }
  amt = posDicePool['force'];
  for (var i=0; i<amt; i++) {
    var die = document.createElement('span');
    die.classList.add('die');//new
    die.style.backgroundColor = "#fff8dc";
    posPoolDisplay.appendChild(die);
  }

  var negPoolDisplay = document.getElementById('negpool0');
  negPoolDisplay.innerHTML = "";

  amt = negDicePool['purple'];
  for (var i=0; i<amt; i++) {
    var die = document.createElement('span');
    die.classList.add('die');//new
    die.style.backgroundColor = "#5c00e6";
    negPoolDisplay.appendChild(die);
  }
  amt = negDicePool['red'];
  for (var i=0; i<amt; i++) {
    var die = document.createElement('span');
    die.classList.add('die');//new
    die.style.backgroundColor = "#FF0000";
    negPoolDisplay.appendChild(die);
  }
  amt = negDicePool['setback'];
  for (var i=0; i<amt; i++) {
    var die = document.createElement('span');
    die.classList.add('die');//new
    die.style.backgroundColor = "#000000";
    negPoolDisplay.appendChild(die);
  }
};//updateDiceDisplayDOM
var updateDiceDisplay = function() {
  var posPoolDisplay = document.getElementById('pospool');
  var ctx = posPoolDisplay.getContext('2d');

  ctx.clearRect(0, 0, DICE_DISPLAY_WIDTH, DICE_SIZE);

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
  amt = posDicePool['force'];
  ctx.fillStyle = "#fff8dc";
  for (var i=0; i<amt; i++) {
    ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
    startx+= DICE_SIZE + OFFSET;
  }

  var negPoolDisplay = document.getElementById('negpool');
  ctx = negPoolDisplay.getContext('2d');

  ctx.clearRect(0, 0, DICE_DISPLAY_WIDTH, DICE_SIZE);

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
  var f = document.getElementById('numforce').value;

  posDicePool['green'] = g;
  posDicePool['yellow'] = y;
  posDicePool['boost'] = b;
  posDicePool['force'] = f;

  negDicePool['purple'] = p;
  negDicePool['red'] = r;
  negDicePool['setback'] = s;

  //updateDiceDisplay();
  updateDiceDisplayDOM();
};
/*===========================
  END DICE FUNCTIONS
  ===========================*/

document.getElementById('numgreen').addEventListener('change', updatePool);
document.getElementById('numyellow').addEventListener('change', updatePool);
document.getElementById('numboost').addEventListener('change', updatePool);
document.getElementById('numpurple').addEventListener('change', updatePool);
document.getElementById('numred').addEventListener('change', updatePool);
document.getElementById('numsetback').addEventListener('change', updatePool);
document.getElementById('numforce').addEventListener('change', updatePool);
document.getElementById("roll").addEventListener('click', rollDice);

//Data saving
var get_weapons = function() {
  var weapon_table = document.getElementById("weapons");
  var new_weapons = {};
  for (var w=0; w < weapon_table.childElementCount; w++) {
    var weapon_row = weapon_table.childNodes[w];

    //get weapon identifier from first entry
    var weapon_id = weapon_row.childNodes[0].id;
    var weapon = {}
    for (var i=1; i<weapon_row.childElementCount; i++) {
      var weapon_data = weapon_row.childNodes[i];
      var stat_id = weapon_data.id.split('_')[1];

      if (weapon_data.childElementCount == 0) {
        weapon[stat_id] = weapon_data.innerText;
      }
      else {
        weapon[stat_id] = weapon_data.childNodes[0].value;
      }
      console.log(weapon);
      //weapon[stat_id] = weapon_data.value;
    }//individual cell
    //console.log(weapon);
    new_weapons[weapon_id] = weapon;
  }//each row
  return new_weapons;
};//get_weapons
var get_stats = function() {
  let stat_keys = Object.keys(char_stats);
  new_stats = {}
  for (var i=0; i<stat_keys.length; i++) {
    let key = stat_keys[i];
    new_stats[key] = document.getElementById(key).value;
  }
  return new_stats;
};
var encode_stats = function() {
  var new_stats = get_stats();
  var new_weapons = get_weapons();
  var encode_data = {stats: new_stats, weapons: new_weapons};
  //console.log(encode_data);
  var encode_string = btoa(JSON.stringify(encode_data));
  return encode_string;
};
var make_data_url = function() {
  //return "data:text/plain;base64," + encode_stats();
  //console.log(encode_stats().length);
  window.location.hash = encode_stats();
  document.getElementById('data-url').innerText = window.location;
};

var set_stats = function() {
  var stat_string = window.location.hash.substr(1);
  var data = JSON.parse(atob(stat_string));
  //console.log(data);
  char_stats =  data['stats'];
  weapons = data['weapons'];
};

var setup = function() {
  setup_skills_div();
  var checks = document.getElementsByName('check_type');
  for (var i=0; i<checks.length; i++) {
    checks[i].addEventListener('click', get_check);
  }
  if ( window.location.hash ) {
    //console.log("getting stats");
    set_stats( window.location.hash );
  }
  load_stats();
  load_weapons();
};
