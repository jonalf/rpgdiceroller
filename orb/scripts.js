
var dice_pallete;
var DICE_SIZE = 50;
var OFFSET = 2;
var results = [];
var num_dice = 0;
var use_passion = false;

var milton_stats = {'personskills': {'audacity': 0,
                     'benevolence': 1,
                     'cunning': 2,
                     'decorum': 0,
                     'defiance': 1,
                     'loyalty': 0,
                     'ingenuity': 3,
                     'obsession': 2,
                     'sensitivity': 1,
                     'craft': 3,
                     'express': 0,
                     'fight': 0,
                     'foster': 0,
                     'intrigue': 0,
                     'intuit': 1,
                     'observe': 2,
                     'physicality': 1,
                     'transgress': 0 },
                    'vitality' : { 'marked' : 0, 'total' : 7},
                     'distress': { 'marked' : 0, 'total' : 7},
                    'passion': {'marked': 0, 'total' : 5}
                     };


var personality = ['audacity', 'benevolence', 'cunning', 'decorum', 'defiance', 'loyalty', 'ingenuity', 'obsession', 'sensitivity'];
var skills = ['craft', 'express', 'fight', 'foster', 'intrigue', 'intuit', 'observe', 'physicality', 'transgress'];



var load_milton = function() {
  var stat_keys = Object.keys(milton_stats['personskills']);
  for (var i=0; i<stat_keys.length; i++) {
    var e = document.getElementById( stat_keys[i] );
    e.value = milton_stats['personskills'][stat_keys[i]];
  }
  make_boxes('vitality');
  make_boxes('distress');
  make_boxes('passion');
};

var make_boxes = function(type) {
  var num_boxes = milton_stats[type]['total'];
  var container = document.getElementById(type);
  container.innerHTML = "";
  for (var nb=0; nb<num_boxes; nb++) {
    var box = document.createElement('span');
    box.classList.add(type+'-box');

    if (nb < milton_stats[type]['marked']) {
      box.classList.add('marked');
    }
    box.addEventListener('click', mark_box);
    container.appendChild(box);
  }
};

var mark_box = function(e) {
  var clist = e.target.classList;
  if (clist.contains('marked') ) {
    clist.remove('marked');
  }
  else {
    clist.add('marked');
  }
};

var set_dice_num = function() {
  var personality_value = 0;
  var skill_value = 0;

  var personality_name = document.querySelector('input[name="personality"]:checked');
  if (personality_name) {
    personality_name = personality_name.value.split('_')[0];
    personality_value = parseInt(document.getElementById(personality_name).value);
  }
  var skill_name = document.querySelector('input[name="skill"]:checked');
  if (skill_name) {
    skill_name = skill_name.value.split('_')[0];
    skill_value = parseInt(document.getElementById(skill_name).value);
  }
  num_dice =  personality_value + skill_value;
};

var updateDiceDisplay = function() {
  set_dice_num();
  dice_pallete = createScientificPalettes(baseColor)['tetradic'];
  var posPoolDisplay = document.getElementById('pospool');
  var ctx = posPoolDisplay.getContext('2d');

  ctx.clearRect(0, 0, 300, DICE_SIZE);

  var startx = 0;
  //ctx.fillStyle = "#00FF00";
  for (var i=0; i<num_dice; i++) {
    ctx.fillStyle = dice_pallete[i % dice_pallete.length];
    ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
    startx+= DICE_SIZE + OFFSET;
  }
};


var setup = function() {
  var personality_elements = document.getElementsByName('personality');
  for (var i=0; i<personality_elements.length; i++) {
    personality_elements[i].addEventListener('click', updateDiceDisplay);
  }
  var skill_elements = document.getElementsByName('skill');
  for (var i=0; i<skill_elements.length; i++) {
    skill_elements[i].addEventListener('click', updateDiceDisplay);
  }
  document.getElementById("roll").addEventListener('click', roll_dice);
  document.getElementById("passionroll").addEventListener('click', passion_roll);
  load_milton();
};

var passion_roll = function() {
  if (  milton_stats['passion']['marked'] !=
        milton_stats['passion']['total']) {
    milton_stats['passion']['marked']++;
    make_boxes('passion');
    use_passion = true;
    roll_dice();
  }
}

var roll_dice = function() {
  updateDiceDisplay();
  results = [];
  var glooms = 0;
  var brills = 0;
  var brill_threshold = 6;
  if (use_passion) {
    num_dice+= 2;
    brill_threshold = 5;
  }
  for (var j=0; j<num_dice; j++) {
    results.push(Math.floor(Math.random()*6)+1);
    if (results[j] == 1) {
      glooms++;
    }
    else if (results[j] >= brill_threshold) {
      brills++;
    }
  }
  if (glooms > brills) {
    document.getElementById('glooms').style = "color: red";
    document.getElementById('brills').style = "";
  }
  else {
    document.getElementById('brills'). style = "color: green";
    document.getElementById('glooms').style = "";
  }
  document.getElementById('brills').innerText = brills;
  document.getElementById('glooms').innerText = glooms;
  console.log(results);

  var posResultDisplay = document.getElementById('pospool');
  var ctx = posResultDisplay.getContext('2d');
  ctx.clearRect(0, 0, 300, DICE_SIZE);
  ctx.font = "25px serif";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  var startx = 0;
  for (var i=0; i<num_dice; i++) {
    ctx.fillStyle = dice_pallete[i % dice_pallete.length];
    ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText( results[i], startx+(DICE_SIZE/2), DICE_SIZE/2);
    startx+= DICE_SIZE + OFFSET;
  }
  use_passion = false;
};


var adjustHue = function(val) {
  if (val < 0) val += Math.ceil(-val / 360) * 360;

  return val % 360;
};

const baseColor = {
  l: 50,
  c: 75,
  h: 60,
  mode: "lch"
};

var createScientificPalettes = function(baseColor) {
  const targetHueSteps = {
    analogous: [0, 30, 60],
    triadic: [0, 120, 240],
    tetradic: [0, 90, 180, 270],
    complementary: [0, 180],
    splitComplementary: [0, 150, 210]
  };

  const palettes = {};

  for (const type of Object.keys(targetHueSteps)) {
    var pallete = [];
    for (const step of targetHueSteps[type]) {
    var color = "lch(" + baseColor.l + " ";
    color+= baseColor.c + " ";
    color+= adjustHue(baseColor.h + step) + ")";
    pallete.push(color);
    }
    palettes[type] = pallete;
  }
  return palettes;
};



/*


var rollDice = function() {
  updatePool();
  posResults = [0,0, 0, 0];
  negResults = [0, 0, 0];

  var posDiceTypes = {'green': [greenDie, "#00FF00"], 'yellow' : [yellowDie, '#FFFF00'], 'boost': [boostDie, '#80dfff'], 'force': [forceDie, '#FFFFFF']};
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

    var weapon_name = document.querySelector('input[name="genderS"]:checked').value;.id;
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




/*below  probably not needed

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
*/
