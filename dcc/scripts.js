const DICE_SIZE = 50;
const BOX_SIZE = 20;
const OFFSET = 2;
const baseColor = {
  l: 46,
  c: 41,
  h: 309,
  mode: "lch"
};
let dice_pallete;
let check_dicepool = [20];
let damage_dicepool = [];

let char_stats = {
  /* full computed stats */
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

  'skills' : {
    'attack': [],
    'defense': [],
    'other': []
  },
  'inventory' : [],
  'notes' : ""
};


const STAT_NAMES = ["strength", "intelligence", "constitution", "dexterity", "charisma"];
const SKILL_HEADERS = ['name', 'rank', 'stat', 'damage', 'notes', 'grind_bank', 'marked'];
const SKILL_TYPES = ['attack', 'defense', 'other'];
const STAT_BREAKPOINTS = [3, 6, 10, 20, 50, 100, 150, 200, 300];

const setup = function() {
  if ( window.location.hash ) {
    set_stats( window.location.hash );
  }
  char_stats = compute_stats(mike_stats);

  populate_info(char_stats['info']);
  make_health_bar(char_stats['health']);
  make_stats(char_stats);

  populate_skills('attack', char_stats['skills']['attack']);
  populate_skills('defense', char_stats['skills']['defense']);

  //add listeners
  let attack_table = document.getElementById("attack_skill_body");
  attack_table.addEventListener('command',  make_blank_skill_row);
  let defense_table = document.getElementById("defense_skill_body");
  defense_table.addEventListener('command',  make_blank_skill_row);
  let check_pool = document.getElementById("check_dicepool");
  check_pool.addEventListener('command',  roll_dice);
  let damage_pool = document.getElementById("damage_dicepool");
  damage_pool.addEventListener('command',  roll_dice);
  let advantage = document.getElementById("advantage");
  advantage.addEventListener('change', toggle_advantage);
  let disadvantage = document.getElementById("disadvantage");
  disadvantage.addEventListener('change', toggle_disadvantage);
};

const compute_stats = function(stats) {
  //handle any inventory modifications
  //console.log(stats['inventory']);
  for (let item of stats['inventory']) {
    let quantity = 0;
    //console.log(item);
    if ('quantity' in item && isInt(item['quantity']) ) {
      quantity = parseInt(item['quantity']);
    }//quantity
    if ('dr' in item && isInt(item['dr'])) {
        let dr = parseInt(item['dr']) * quantity;
        stats['dr']+= dr;
      }//dr
    for (let stat_bonus of Object.keys(item['stat_bonus'])) {
      console.log(stat_bonus);
      let bonus = item['stat_bonus'][stat_bonus];
      if (isInt(bonus)) {
        stats[stat_bonus+"_bonus"]+= parseInt(bonus);
      }
    }//stat bonuses
    for (let skill_bonus of item['skill_bonus']) {
      //console.log(skill_bonus);
      let added = false;
      let skill_list = stats['skills'][skill_bonus['type']];
      for (let current_skill of skill_list) {
        if (current_skill['name'] == skill_bonus['name']) {
          let bonus = skill_bonus['bonus'];
          if (isInt(bonus)) {
            current_skill['rank']+= parseInt(bonus);
            added = true;
          }
        }//added skill
      }//current skill loop
      if (!added) {
        console.log(skill_bonus);
      }//add new skill
    }//skill bonuses
  }//inventory items

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
  //health_container.classList.add("diagonal-line-container");

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

  //health_container.addEventListener('click', mark_health);
  return health_container;
};//make_health_box

const mark_health = function(e) {
  console.log(e.target);
  e.target.classList.add("injured");
};

const populate_skills = function(type, skills) {
  var skill_table = document.getElementById(type+'_skill_body');
  let i = 0;
  for (let skill of skills) {
    skill_table.appendChild( make_skill_row(skill, type, i) );
    i++;
  }
};

const make_skill_row = function(skill, type, i) {
  let row = document.createElement("tr");
  let skillid = type+'_'+i;
  let mod = '';
  if (skill['stat']) {
    mod = char_stats[skill['stat']+"_mod"];
  }

  //add select box
  let cell = document.createElement('td');
  let checkbox = document.createElement('input');
  checkbox.type = "radio";
  checkbox.value = skillid;
  checkbox.name = 'selected_skill';
  checkbox.addEventListener('change', select_skill);
  cell.appendChild(checkbox);
  row.appendChild(cell);


  for (let header of SKILL_HEADERS) {
    cell = document.createElement('td');

    if (header == 'name') {
      cell = document.createElement('th');
      cell.scope = "row";
    }
    let cell_data = document.createElement("input");
    cell_data.classList.add("invisible-textbox");
    cell_data.name = skillid;
    cell_data.id = skillid+'_'+header;

    if (header == 'mod') { cell_data.value = mod; }
    else { cell_data.value = skill[header]; }

    cell.appendChild(cell_data);
    row.appendChild(cell);
  }//loop over headers

  return row;
};

const make_blank_skill_row = function(e) {
  let row = document.createElement("tr");
  let skillid = e.target.id.split('_')[0] + '_' + e.target.rows.length;
  let cell = document.createElement('td');
  let checkbox = document.createElement('input');
  checkbox.type = "radio";
  checkbox.value = skillid;
  checkbox.name = 'selected_skill';
  checkbox.addEventListener('change', select_skill);
  cell.appendChild(checkbox);
  row.appendChild(cell);

  for (let header of SKILL_HEADERS) {
    let cell = document.createElement('td');

    if (header == 'name') {
      cell = document.createElement('th');
      cell.scope = "row";
    }
    let cell_data = document.createElement("input");
    cell_data.classList.add("invisible-textbox");
    cell_data.name = skillid;
    cell_data.id = skillid+"_"+header;

    // if (header == 'mod') { cell_data.value = mod; }
    // else { cell_data.value = skill[header]; }

    cell.appendChild(cell_data);
    row.appendChild(cell);
  }//loop over headers
  e.target.appendChild(row);
};

const select_skill = function(e) {
  let skill_info = e.target.value.split('_');
  let type = skill_info[0];
  let num = skill_info[1];

  let skill = char_stats['skills'][type][num];
  let rank = parseInt(skill['rank']);
  let mod = char_stats[skill['stat']+"_mod"];

  let bonus_display = document.getElementById('check_bonus');
  bonus_display.innerHTML = "+" + (rank + mod);
  updateDiceDisplay('check');

  damage_dicepool = []
  if (skill['damage']) {
    let dmg = skill['damage'].split('d');
    let num_dice = parseInt(dmg[0]);
    let dice_value = parseInt(dmg[1]);
    for (let i=0; i<num_dice; i++) {
      damage_dicepool.push(dice_value);
    }
    bonus_display = document.getElementById('damage_bonus');
    bonus_display.innerHTML = "+" + rank;
    updateDiceDisplay('damage');
  }
  //console.log(skill);
};

const toggle_advantage = function(e) {
  let ad_state = e.target.checked;
  let disad_state = document.getElementById('disadvantage').checked;

  if (ad_state && !disad_state) {
    check_dicepool.push(20);
  }
  else if (ad_state && disad_state) {
    check_dicepool.splice(check_dicepool.indexOf(20), 1);
  }
  else if (disad_state) {
    check_dicepool.push(20);
  }
  else if (!disad_state) {
    check_dicepool.splice(check_dicepool.indexOf(20), 1);
  }
  updateDiceDisplay('check');
};
const toggle_disadvantage = function(e) {
  let disad_state = e.target.checked;
  let ad_state = document.getElementById('advantage').checked;

  if (disad_state && !ad_state) {
    check_dicepool.push(20);
  }
  else if (disad_state && ad_state) {
    check_dicepool.splice(check_dicepool.indexOf(20), 1);
  }
  else if (ad_state) {
    check_dicepool.push(20);
  }
  else if (!ad_state) {
    check_dicepool.splice(check_dicepool.indexOf(20), 1);
  }
  updateDiceDisplay('check');
};

const add_die = function(type) {
  let pool = check_dicepool
  if (type == 'damage') {
    pool = damage_dicepool;
  }
  let die = document.getElementById(type+"_add_die").value;
  pool.push(parseInt(die));
  updateDiceDisplay(type);
};
const remove_die = function(type) {
  let pool = check_dicepool
  if (type == 'damage') {
    pool = damage_dicepool;
  }
  let die = document.getElementById(type+"_add_die").value;
  let diespot = pool.indexOf(parseInt(die));
  if (diespot != -1) {
    pool.splice(diespot, 1);
  }
  updateDiceDisplay(type);
};

/* saving/encding/loading function */

var get_stats = function() {

  let new_stats = {
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

    'strength_bonus' : 0,
    'intelligence_bonus' : 0,
    'constitution_bonus' : 0,
    'dexterity_bonus' : 0,
    'charisma_bonus' : 0,

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

    'inventory' : [],

    'skills' : {
      'attack': [],
      'defense': [],
      'other': []
    },
    'notes' : ""
  };

  //grab char info
  for (let info_data of Object.keys(new_stats['info'])) {
    let element = document.getElementById('char_'+info_data);
    if (element) {
      //console.log(info_data + " " + element.value);
      let value = element.value;
        if(isInt(value)){
          value = parseInt(value);
        }
      new_stats['info'][info_data] = value;
    }
  }//basic info

  //get base stats
  for (let stat of STAT_NAMES) {
    let element = document.getElementById(stat+"_base");
    if (element) {
      let value = element.value;
        if(isInt(value)){
          value = parseInt(value);
        }
      new_stats[stat+"_base"] = value;
    }
  }//base stats

  //grab skills
  for (let skill_type of SKILL_TYPES) {
    if ( document.getElementById(skill_type+"_skill_body") ) {
      let skills = document.getElementById(skill_type+"_skill_body").rows;

      for (let skill of skills) {
        let skill_dict = collect_skill(skill);
        new_stats['skills'][skill_type].push(skill_dict);
      }//loop over skill rows
    }//if there are skills
  }//loop over kill types
  return new_stats;
};//get_stats

const collect_skill = function(skill) {
  let skill_dict = {}
  let skill_id = skill.cells[0].firstChild.value;
  for (let header of SKILL_HEADERS) {
    //console.log("\t"+header);
    let element = document.getElementById(skill_id+"_"+header);
    let value = "";
    if (element) {
      value = element.value;
      if (isInt(value)) {
        value = parseInt(value);
      }
    }
    skill_dict[header] = value;
  }//loop over skill headers
  return skill_dict;
};//collect_skill

const encode_stats = function() {
  let new_stats = get_stats();
  let encode_string = btoa(JSON.stringify(new_stats));
  return encode_string;
};

const set_stats = function() {
  let stat_string = window.location.hash.substr(1);
  char_stats =  JSON.parse(atob(stat_string));
  console.log(char_stats);
};

var make_data_url = function() {
  //return "data:text/plain;base64," + encode_stats();
  window.location.hash = encode_stats();
  document.getElementById('data-url').innerText = window.location;
};


/* DICE STUFF */

const updateDiceDisplay = function(type) {
  let pool = check_dicepool;
  if (type == 'damage') {
    pool = damage_dicepool;
  }

  dice_pallete = createScientificPalettes(baseColor)['unknown'];

  var dicePoolDisplay = document.getElementById(type+'_dicepool');//new
  dicePoolDisplay.innerHTML="";

  for (var i=0; i<pool.length; i++) {

    var die = document.createElement('span'); //new
    die.classList.add('die');//new
    die.style.backgroundColor = dice_pallete[i % dice_pallete.length];
    die.innerText = "d" + pool[i];
    dicePoolDisplay.appendChild(die);//new
  }
};//updateDiceDisplay


const createScientificPalettes = function(baseColor) {
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

const adjustHue = function(val) {
  if (val < 0) val += Math.ceil(-val / 360) * 360;

  return val % 360;
};//adjustHue

var roll_animation = function(die, sides, result) {
  var cycles = 50;
  let timer = setInterval( function() {
    if (cycles == 0) {
      clearInterval(timer);
      die.innerText = result;
    }
    else {
      die.innerText = Math.floor(Math.random()*sides)+1;
      cycles--;
    }
  }, 2);
};//roll_animation

var roll_dice = function(e) {
  //updateDiceDisplay();
  let type = 'check';
  let pool = check_dicepool;
  // console.log(pool);
  // console.log(e.target.id);
  if (e.target.id == 'damage_dicepool') {
    pool = damage_dicepool;
    type = 'damage';
  }
  let bonus = document.getElementById(type+'_bonus').innerText;
  if (isInt(bonus)) {
    bonus = parseInt(bonus);
  }

  results = [];
  //console.log(pool);
  for (let j=0; j<pool.length; j++) {
    results.push(Math.floor(Math.random()*pool[j])+1);
  }
  //console.log(results);

  //var dicePoolDisplay = document.getElementById('dicepool');
  let dicePoolDisplay = e.target;
  dicePoolDisplay.innerHTML = "";
  for (let i=0; i<pool.length; i++) {
    let die = document.createElement('span');
    die.classList.add('die');//new
    die.style.backgroundColor = dice_pallete[i % dice_pallete.length];
    dicePoolDisplay.appendChild(die);
    roll_animation(die, pool[i], results[i]);
    //die.innerText = results[i]; //roll_animation will set final value
  }

  let result = calculate_result(results, type) + bonus;
  let result_display = document.getElementById(type+"_result");
  result_display.innerText = 'roll: ';
  result_display.innerText+= result;
};//roll_dice

const calculate_result = function(results, type) {
  let total = 0;
  let pool = check_dicepool;
  if (type == 'damage') {
    pool = damage_dicepool;
  }
  let d20pool = [];
  for (let i=0; i<results.length; i++) {
    if (type == 'check' && pool[i] == 20) {
      d20pool.push(results[i]);
    }
    else {
      total+= results[i];
    }
  }//loop over results
  if (type == 'check') {
    if (d20pool.length == 1) {
      total+= d20pool[0];
    }
    else if (document.getElementById('advantage').checked) {
      total+= Math.max(...d20pool);
    }
    else {
      total+= Math.min(...d20pool);
    }
  }//check modifiers
  return total;
};//calculate_result

const isInt = function(str) {
  // Trim whitespaces, ensure it's not empty, and check if it's an integer
  if (typeof str == 'string' && str.trim() === '') return false;
  return Number.isInteger(Number(str));
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
  'constitution_bonus' : 0,
  'dexterity_bonus' : 0,
  'charisma_bonus' : 0,


  /* base stats */
  'strength_base' : 5,
  'intelligence_base' : 4,
  'constitution_base' : 9,
  'dexterity_base' : 2,
  'charisma_base' : 3,

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

  'inventory' : [
    {'name' : 'Gimp Mask of Sadomasichism',
     'dr': 1,
     'skill_bonus' : [
       {'name': 'catcher',
        'type': 'other',
        'bonus': 1},
       {'name': 'shield block',
        'type': 'defense',
        'bonus': 1}
      ],
     'stat_bonus' : {},
     'notes': ""},
    {'name' : 'Garbage Can Lid',
     'dr': 1,
     'skill_bonus' : [],
     'stat_bonus' : {},
     'notes': ""},
   {'name' : 'LL Bean Duck Boots',
    'dr': 1,
    'skill_bonus' : [],
    'stat_bonus' : {},
    'notes': ""},
   {'name' : 'Leather Gloves',
     'dr': 1,
     'skill_bonus' : [],
     'stat_bonus' : {},
     'notes': ""},
   {'name' : 'Earring',
     'dr': 0,
     'skill_bonus' : [],
     'stat_bonus' : {'constitution' : 2},
     'notes': ""},
   {'name' : 'Beret',
     'dr': 0,
     'skill_bonus' : [],
     'stat_bonus' : {'intelligence' : 2},
     'notes': ""}
  ],

  'skills' : {
    'attack': [
      {'name' : 'longsword',
       'rank' : 5,
       'stat': 'strength',
       'marked': false,
       'damage' : '2d8',
       'grind_bank': 1,
       'notes' : ''},
     {'name' : 'improvised weapons',
      'rank' : 4,
      'stat': 'strength',
      'marked': false,
      'damage' : '1d4',
      'grind_bank': 1,
      'notes' : ''},
   ],
    'defense': [
      {'name' : 'evade',
       'rank' : '',
       'stat': 'dexterity',
       'marked': '',
       'damage' : '',
       'grind_bank': '',
       'notes' : ''},
     {'name' : 'shield block',
      'rank' : 3,
      'stat': 'strength',
      'marked': false,
      'damage' : '',
      'grind_bank': 0,
      'notes' : ''},
    ],
    'other': []
  },
  'notes' : ""
};
