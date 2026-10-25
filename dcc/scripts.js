const DICE_SIZE = 50;
const BOX_SIZE = 20;
const OFFSET = 2;
let dice_pallete;
let results = [];
let num_dice = 0;
let use_passion = false;

let char_stats = {
  /* full computed stats */
  'strength' : 0,
  'intelligence' : 0,
  'constitution' : 0,
  'dexterity' : 0,
  'charisma' : 0,

  /* computed modifiers */
  'strength_mod' : 0,
  'intelligence_mod' : 0,
  'constitution_mod' : 0,
  'dexterity_mod' : 0,
  'charisma_mod' : 0,

  /* base stats */
  'strength_base' : 0,
  'intelligence_base' : 0,
  'constitution_base' : 0,
  'dexterity_base' : 0,
  'charisma_base' : 0,

  /* derrived stats */
  'mana' : 0,
  'evade' : 0,
  'dr' : 0,
  'health': 0,

  'info' : {
    'name' : 'n/a',
    'race' : 'n/a',
    'crawler_number' : -1,
    'level' : 1,
    'class' : 'n/a',
    'floor' : 1,
    'gold' : 0
  },

  'inventory' : {
    'weapons' : [],
    'armor' : [],
    'items' : []
  }
};



let mike_stats = {
  /* full computed stats */
  'strength' : 0,
  'intelligence' : 0,
  'constitution' : 0,
  'dexterity' : 0,
  'charisma' : 0,

  /* computed modifiers */
  'strength_mod' : 0,
  'intelligence_mod' : 0,
  'constitution_mod' : 0,
  'dexterity_mod' : 0,
  'charisma_mod' : 0,

  /* stat bonuses */
  'strength_bonus' : 0,
  'intelligence_bonus' : 0,
  'constitution_bonus' : 2,
  'dexterity_bonus' : 0,
  'charisma_bonus' : 0,


  /* base stats */
  'strength_base' : 5,
  'intelligence_base' : 4,
  'constitution_base' : 9,
  'dexterity_base' : 2,
  'charisma_base' : 300,

  /* other stuff */
  'mana' : 0,
  'evade' : 0,
  'dr' : 0,
  'health': 0,

  'info' : {
    'name' : 'Mike Waters',
    'race' : 'Human',
    'crawler_number' : 13162193,
    'level' : 9,
    'class' : 'n/a',
    'floor' : 1,
    'gold' : 36
  },

  'inventory' : {
    'weapons' : [],
    'armor' : [],
    'items' : []
  }
};

const STAT_NAMES = ["strength", "intelligence", "constitution", "dexterity", "charisma"];
const STAT_BREAKPOINTS = [3, 6, 10, 20, 50, 100, 150, 200, 300];

const setup = function() {
  char_stats = compute_stats(mike_stats);

  populate_info(char_stats['info']);
  make_health_bar(char_stats['health']);
  make_stats(char_stats);
};

const compute_stats = function(stats) {
  for (let stat of STAT_NAMES) {
    /* calc stat values */
    let base = stats[stat+"_base"];
    let bonus = stats[stat+"_bonus"];
    let computed = base + bonus;
    stats[stat] = computed;

    /* cal modifiers */
    let mod = 10;
    for (let i=0; i<STAT_BREAKPOINTS.length; i++) {
      if (computed < STAT_BREAKPOINTS[i]) {
        mod = i+1;
        break;
      }
    }//compute stat based modifiers
    stats[stat+"_mod"] = mod;
  }//loop over stat names

  /* derrived stats */
  stats['evade'] = stats['dexterity_mod'];
  stats['mana'] = stats['intelligence'];
  stats['health'] = stats['constitution_mod'] * 10;

  console.log(stats);
  return stats;
};//compute_stats

const populate_info = function(info) {
  //info = stats['info'];

  for (let i of Object.keys(info)) {
    //console.log(i);
    //console.log(info[i]);
    let info_box = document.getElementById('char_'+i);
    if (info_box) {
      info_box.value = info[i];
    }
  }
};//populate_info

const make_stats =  function(stats) {
  let stat_row = document.getElementById("stats");
  stat_row.innerHTML = "";

  for (let stat of STAT_NAMES) {
    stat_row.appendChild(make_stat_box(stats, stat));
  }
};//make_stats

const update_stats = function() {

  //colect base modifiers
  let new_base = collect_base_stats();
  console.log(new_base);
  for (let i of Object.keys(new_base)) {
    char_stats[i+"_base"] = new_base[i];
  }

  char_stats = compute_stats(char_stats);
  make_health_bar(char_stats['health']);
  make_stats(char_stats);
};

const collect_base_stats = function() {
  stats = {};
  for (let stat of STAT_NAMES) {
    //console.log(stat);
    let stat_value = document.getElementById(stat+"_base");
    stat_value = parseInt(stat_value.value);
    stats[stat] = stat_value;
  }
  return stats;
};//collect_base_stats

const make_stat_box = function(stats, stat_name) {
  let base = stats[stat_name + "_base"];
  let stat = stats[stat_name]
  let mod = stats[stat_name + "_mod"];

  let stat_box = document.createElement("div");
  stat_box.classList.add("vertical");
  stat_box.classList.add("stat-box");
  stat_box.innerHTML = "<span>"+stat_name+"</span>";

  let stat_values = document.createElement("span");
  stat_values.innerText = stat + "/";
  let stat_base = document.createElement("input");
  stat_base.classList.add("invisible-textbox");
  stat_base.id = stat_name + "_base";
  stat_base.value = base;
  stat_base.addEventListener('change', update_stats);
  stat_values.appendChild(stat_base);

  let stat_mod = document.createElement("span");
  stat_mod.innerText = "+" + mod;

  stat_box.appendChild(stat_values);
  stat_box.appendChild(stat_mod);
  return stat_box;
};//make_stat_box

const make_health_bar = function(health) {

  let health_bar = document.getElementById("health");
  health_bar.innerHTML = "";
  let health_section = health/10;
  for (let i=0; i<10; i++) {
    let health_box = make_health_box(health_section, i);
    health_bar.appendChild(health_box);
  }
};//make_health_bar

const make_health_box = function(conmod, i) {

  let health_container = document.createElement("div");
  health_container.classList.add("vertical");
  health_container.classList.add("health-box");

  let health_box = document.createElement("span");
  let health_check = document.createElement("input");
  health_check.classList.add("health-check");
  health_check.type = "checkbox";
  health_check.id = "health_" + i;
  let health_label = document.createElement("label");
  health_label.htmlFor = health_check.id;
  health_label.innerText = conmod;
  health_box.appendChild(health_label);
  health_box.appendChild(health_check);

  health_container.appendChild(health_box);
  health_container.innerHTML+= '<span style="font-size: 0.70em;">' + ((i+1) * 10) + "%</span>";
  return health_container;
};//make_health_box





/* saving/encding/loading function */

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


/*
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
};//load_stats

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
};//make_boxes

var mark_box = function(e) {
  var clist = e.target.classList;
  if (clist.contains('marked') ) {
    clist.remove('marked');
  }
  else {
    clist.add('marked');
  }
};//mark_box



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
};//set_dice_num

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
};//updateDiceDisplay


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
};//setup

var passion_roll = function() {
  if (  char_stats['passion']['marked'] !=
        char_stats['passion']['total']) {
    char_stats['passion']['marked']++;
    make_boxes('passion', false);
    use_passion = true;
    roll_dice();
  }
};//passion_roll

var roll_animation = function(die, result) {
  var cycles = 50;
  let timer = setInterval( function() {
    if (cycles == 0) {
      clearInterval(timer);
      die.innerText = result;
    }
    else {
      die.innerText = Math.floor(Math.random()*6)+1;
      cycles--;
    }
  }, 2);
};//roll_animation

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
    document.getElementById('glooms').style = "color: red; font-size: 1.5em";
    document.getElementById('brills').style = "";
  }
  else {
    document.getElementById('brills'). style = "color: green; font-size: 1.5em";
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
    roll_animation(die, results[i]);
    //die.innerText = results[i];
  }
  use_passion = false;
};//roll_dice


var adjustHue = function(val) {
  if (val < 0) val += Math.ceil(-val / 360) * 360;

  return val % 360;
};//adjustHue

const baseColor = {
  l: 46,
  c: 41,
  h: 309,
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
};//add_stat
var remove_passion = function() {
  if (char_stats['passion']['marked'] > 0) {
    char_stats['passion']['marked']--;
    make_boxes('passion', false);
  }
};


var add_portfolio = function(stat) {
  if (char_stats['portfolio'][stat]['total'] < 5) {
    char_stats['portfolio'][stat]['total']++;
    make_boxes(stat, true);
  }
};
*/
