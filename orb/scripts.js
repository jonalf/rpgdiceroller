
var dice_pallete;
var DICE_SIZE = 50;
var BOX_SIZE = 20;
var OFFSET = 2;
var results = [];
var num_dice = 0;
var use_passion = false;

var milton_stats = {'personskills': {
                       'audacity': 0,
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
                    'passion': {'marked': 0, 'total' : 5},
                    'portfolio': {
                      'access': { 'marked' : 0, 'total' : 0},
                      'information': { 'marked' : 0, 'total' : 1},
                      'entourage': { 'marked' : 0, 'total' : 0},
                      'mentor': { 'marked' : 0, 'total' : 0},
                      'reputation': { 'marked' : 0, 'total' : 1},
                      'title': { 'marked' : 0, 'total' : 0},
                      'gear': { 'marked' : 0, 'total' : 2},
                      'wardrobe': { 'marked' : 0, 'total' : 0},
                      'wealth': { 'marked' : 0, 'total' : 0}
                    }
                  };

var char_stats = {'personskills': {
                      'audacity': 0,
                      'benevolence': 0,
                      'cunning': 0,
                      'decorum': 0,
                      'defiance': 0,
                      'loyalty': 0,
                      'ingenuity': 0,
                      'obsession': 0,
                      'sensitivity': 0,
                      'craft': 0,
                      'express': 0,
                      'fight': 0,
                      'foster': 0,
                      'intrigue': 0,
                      'intuit': 0,
                      'observe': 0,
                      'physicality': 0,
                      'transgress': 0 },
                    'vitality' : { 'marked' : 0, 'total' : 5},
                    'distress': { 'marked' : 0, 'total' : 5},
                    'passion': {'marked': 0, 'total' : 5},
                    'portfolio': {
                      'access': { 'marked' : 0, 'total' : 1},
                      'information': { 'marked' : 0, 'total' : 1},
                      'entourage': { 'marked' : 0, 'total' : 1},
                      'mentor': { 'marked' : 0, 'total' : 1},
                      'reputation': { 'marked' : 0, 'total' : 1},
                      'title': { 'marked' : 0, 'total' : 1},
                      'gear': { 'marked' : 0, 'total' : 1},
                      'wardrobe': { 'marked' : 0, 'total' : 1},
                      'wealth': { 'marked' : 0, 'total' : 1}
                    }
                    };
var personality = ['audacity', 'benevolence', 'cunning', 'decorum', 'defiance', 'loyalty', 'ingenuity', 'obsession', 'sensitivity'];
var skills = ['craft', 'express', 'fight', 'foster', 'intrigue', 'intuit', 'observe', 'physicality', 'transgress'];



var load_milton = function() {
  char_stats = milton_stats;
  load_stats();
};

var load_stats = function() {
  var stat_keys = Object.keys(char_stats['personskills']);
  for (var i=0; i<stat_keys.length; i++) {
    var e = document.getElementById( stat_keys[i] );
    e.value = char_stats['personskills'][stat_keys[i]];
  }
  make_boxes('vitality', false);
  make_boxes('distress', false);
  make_boxes('passion', false);

  for (const type of Object.keys(char_stats['portfolio'])) {
    make_boxes(type, true);
  }
};

var make_boxes = function(type, is_portfolio) {
  var type_info;
  if (is_portfolio) {
    type_info = char_stats['portfolio'][type];
  }
  else {
    var type_info = char_stats[type];
  }
  var num_boxes = type_info['total'];
  var container = document.getElementById(type);
  container.innerHTML = "";
  for (var nb=0; nb<num_boxes; nb++) {
    var box = document.createElement('span');
    box.classList.add(type+'-box');
    if (is_portfolio) {
      box.classList.add('portfolio-box');
    }

    if (nb <type_info['marked']) {
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
  dice_pallete = createScientificPalettes(baseColor)['unknown'];

  var dicePoolDisplay = document.getElementById('dicepool');//new
  dicePoolDisplay.innerHTML="";
  //
  // var posPoolDisplay = document.getElementById('pospool');
  // var ctx = posPoolDisplay.getContext('2d');
  //
  // ctx.clearRect(0, 0, 600, DICE_SIZE);
  //
  // var startx = 0;
  //ctx.fillStyle = "#00FF00";
  for (var i=0; i<num_dice; i++) {
    // ctx.fillStyle = dice_pallete[i % dice_pallete.length];
    // ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
    // startx+= DICE_SIZE + OFFSET;

    var die = document.createElement('span'); //new
    die.classList.add('die');//new
    die.style.backgroundColor = dice_pallete[i % dice_pallete.length];
    die.innerText = "?";
    dicePoolDisplay.appendChild(die);//new
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
  if ( window.location.hash ) {
    set_stats( window.location.hash );
  }
  load_stats();
};

var passion_roll = function() {
  if (  char_stats['passion']['marked'] !=
        char_stats['passion']['total']) {
    char_stats['passion']['marked']++;
    make_boxes('passion');
    use_passion = true;
    roll_dice();
  }
}

var roll_animation = function(die) {
  var cycles = 50;
  let timer = setInterval( function() {
    if (cycles == 0) {
      clearInterval(timer);
    }
    else {
      die.innerText = Math.floor(Math.random()*6)+1;
      cycles--;
    }
  }, 2);

}//roll_animation

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

  //dom version of dice
  var dicePoolDisplay = document.getElementById('dicepool');
  dicePoolDisplay.innerHTML = "";
  for (var i=0; i<num_dice; i++) {
    var die = document.createElement('span'); //new
    die.classList.add('die');//new
    die.style.backgroundColor = dice_pallete[i % dice_pallete.length];
    //die.innerText = results[i];
    dicePoolDisplay.appendChild(die);//new
    roll_animation(die);
    die.innerText = results[i];
  }

  // var posResultDisplay = document.getElementById('pospool');
  // var ctx = posResultDisplay.getContext('2d');
  // ctx.clearRect(0, 0, 300, DICE_SIZE);
  // ctx.font = "25px serif";
  // ctx.textBaseline = "middle";
  // ctx.textAlign = "center";
  // var startx = 0;
  // for (var i=0; i<num_dice; i++) {
  //   ctx.fillStyle = dice_pallete[i % dice_pallete.length];
  //   ctx.fillRect(startx, 0, DICE_SIZE, DICE_SIZE);
  //   ctx.fillStyle = "#FFFFFF";
  //   ctx.fillText( results[i], startx+(DICE_SIZE/2), DICE_SIZE/2);
  //   startx+= DICE_SIZE + OFFSET;
  // }
  use_passion = false;
};


var adjustHue = function(val) {
  if (val < 0) val += Math.ceil(-val / 360) * 360;

  return val % 360;
};

const baseColor = {
  l: 60,
  c: 132,
  h: 184,
  mode: "lch"
};

var createScientificPalettes = function(baseColor) {
  const targetHueSteps = {
    analogous: [0, 30, 60],
    triadic: [0, 120, 240],
    tetradic: [0, 90, 180, 270],
    complementary: [0, 180],
    splitComplementary: [0, 150, 210],
    unknown: [0, 72, 144, 216, 288]
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


var get_stats = function() {
  var personskills = {};
  for (const ps of personality) {
    var psval = parseInt(document.getElementById(ps).value)
    personskills[ps] = psval;
  }
  for (const ps of skills) {
    var psval = parseInt(document.getElementById(ps).value)
    personskills[ps] = psval;
  }
  var vitality = {};
  vitality['total'] = document.getElementsByClassName('vitality-box').length;
  vitality['marked'] = document.getElementsByClassName('vitality-box marked').length;

  var distress = {};
  distress['total'] = document.getElementsByClassName('distress-box').length;
  distress['marked'] = document.getElementsByClassName('distress-box marked').length;

  var passion = {};
  passion['total'] = document.getElementsByClassName('passion-box').length;
  passion['marked'] = document.getElementsByClassName('passion-box marked').length;

  var portfolio = {}
  for (const ps of Object.keys(char_stats['portfolio'])) {
    portfolio[ps] = {};
    portfolio[ps]['total'] = document.getElementsByClassName(ps+"-box").length;
    portfolio[ps]['marked'] = document.getElementsByClassName(ps+"-box marked").length;
  }
  console.log(portfolio);

  var new_stats = {'personskills' : personskills,
                   'vitality' : vitality,
                   'distress' : distress,
                   'passion' : passion,
                   'portfolio' : portfolio};

  return new_stats;
};

var encode_stats = function() {
  var new_stats = get_stats();
  var encode_string = btoa(JSON.stringify(new_stats));
  return encode_string;
};

var set_stats = function() {
  var stat_string = window.location.hash.substr(1);
  char_stats =  JSON.parse(atob(stat_string));
};

var make_data_url = function() {
  //return "data:text/plain;base64," + encode_stats();
  window.location.hash = encode_stats();
  document.getElementById('data-url').innerText = window.location;
};

var add_stat = function(stat) {
  if (char_stats[stat]['total'] < 7) {
    char_stats[stat]['total']++;
    make_boxes(stat, false);
  }
}

var add_portfolio = function(stat) {
  if (char_stats['portfolio'][stat]['total'] < 5) {
    char_stats['portfolio'][stat]['total']++;
    make_boxes(stat, true);
  }
}
