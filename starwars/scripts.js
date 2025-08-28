var char_stats = {
  //'char_name' : '',
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
  'force-rating' :0,
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
var weapons = {};
var char_info = {
  char_name: '',
  career: '',
  specializations: [],
  force_powers: [],
  xp: 0,
  credits: 0,
  morality: 50
};

var DICE_SIZE = 40;
var OFFSET = 2;
var DICE_DISPLAY_WIDTH = 400;

var SUCCESS = 0;
var ADVANTAGE = 1;
var TRIUMPH = 2;
var FAILURE = 5; //0
var THREAT = 6; //1
var DESPAIR = 7; //2
var DARK = 3;
var LIGHT = 4;
var RESULT_OFFSET = FAILURE - SUCCESS;

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

var dieImages = [successImg, advantageImg, triumphImg, lightImg, darkImg, failureImg, threatImg, despairImg];

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

var dice = {
  'green': greenDie,
  'yellow': yellowDie,
  'boost': boostDie,
  'force': forceDie,
  'purple': purpleDie,
  'red': redDie,
  'setback': setbackDie
};

var charateristics = ['brawn', 'agility', 'intellect', 'cunning', 'willpower', 'pressence'];
var combat_skills = ['brawl_skill', 'melee_skill', 'lightsaber_skill', 'ranged-light_skill', 'ranged-heavy_skill', 'gunnery_skill'];
// var knowledge_skills = ['core worlds', 'education', 'lore', 'outer rim', 'underworld', 'xenology'];

var careers = {
  'Consular': {
    'Healer': "consular/healer.pdf",
    'Niman Disciple': 'consular/niman.pdf',
    'Sage': 'consular/sage.pdf'},
  'Guardian': {
    'Armorer': 'guardian/armorer.pdf',
    'Peacekeeper': 'guardian/peacekeeper.pdf',
    'Protector': 'guardian/protector.pdf',
    'Soresu Defender': 'guardian/soresu.pdf',
    'Warden': 'guardian/warden.pdf',
    'Warleader': 'guardian/warleader.pdf'},
  'Mystic' : {
    'Advisor': 'mystic/advisor.pdf',
    'Makashi Duelist': 'mystic/makashi.pdf',
    'Seer': 'mystic/seer.pdf'},
  'Seeker' : {
    'Ataru Striker': 'seeker/ataru.pdf',
    'Executioner': 'seeker/executioner.pdf',
    'Hermit': 'seeker/hermit.pdf',
    'Hunter': 'seeker/hunter.pdf',
    'Navigator': 'seeker/navigator.pdf',
    'Pathfinder': 'seeker/pathfinder.pdf'},
  'Sentinel': {
    'Artisan': 'sentinel/artisan.pdf',
    'Investigator': 'sentinel/investigator.pdf',
    'Racer': 'sentinel/racer.pdf',
    'Sentry': 'sentinel/sentry.pdf',
    'Shadow': 'sentinel/shadow.pdf',
    'Shien Expertise': 'sentinel/shien.pdf'},
  'Warrior': {
    'Aggressor': 'warrior/aggressor.pdf',
    'Shii-Cho Knight': 'warrior/shii-cho.pdf',
    'Starfighter Ace': 'warrior/starfighter.pdf'}
 };
var native_skills = {
  'Consular': ['cool', 'discipline', 'education', 'lore', 'leadership', 'negotiation'],
  'Guardian': ['brawl_skill', 'cool', 'discipline', 'melee_skill', 'resilience', 'vigilance'],
  'Mystic' : ['charm', 'coercion', 'lore', 'outer-rim', 'perception', 'vigilance'],
  'Seeker' : ['xenology', 'pilot-planet', 'pilot-space', 'ranged-heavy_skill', 'survival', 'vigilance'],
  'Sentinel': ['computers', 'deception', 'core worlds', 'perception', 'skullduggery', 'stealth'],
  'Warrior': ['athletics', 'brawl_skill', 'cool', 'melee_skill', 'perception', 'survival'],
  'Healer': ['discipline', 'education', 'xenology', 'medicine'],
  'Niman Disciple': ['discipline', 'leadership', 'lightsaber_skill', 'negotiation'],
  'Sage': ['astrogation', 'charm', 'cool', 'lore'],
  'Armorer': [ 'outer-rim', 'lightsaber_skill', 'mechanics', 'resilience'],
  'Peacekeeper': ['discipline', 'leadership', 'perception', 'pilot-planet'],
'Protector': ['athletics', 'medicine','ranged-light_skill', 'resilience'],
  'Soresu Defender': ['discipline', 'lore', 'lightsaber_skill', 'vigilance'],
  'Warden': ['brawl_skill', 'coercion', 'discipline', 'underworld'],
  'Warleader': ['leadership', 'perception', 'ranged-light_skill', 'survival'],
  'Advisor': ['charm', 'deception', 'negotiation', 'streetwise'],
  'Makashi Duelist': ['charm', 'cool', 'coordination', 'lightsaber_skill'],
  'Seer': ['discipline','lore', 'survival', 'vigilance'],
  'Ataru Striker': ['athletics', 'coordination', 'lightsaber_skill', 'perception'],
  'Executioner': ['discipline', 'melee_skill', 'perception', 'ranged-heavy_skill'],
  'Hermit': ['discipline', 'xenology', 'stealth', 'survival'],
  'Hunter': ['coordination', 'ranged-heavy_skill', 'stealth', 'vigilance'],
  'Navigator': ['astrogation', 'outer-rim', 'perception', 'survival'],
  'Pathfinder': ['medicine', 'ranged-light_skill', 'resilience', 'survival'],
  'Artisan': ['astrogation', 'computers', 'education', 'mechanics'],
  'Investigator': ['education', 'underworld', 'perception', 'streetwise'],
  'Racer': ['cool', 'coordination', 'pilot-planet', 'pilot-space'],
  'Sentry': ['coordination', 'lightsaber_skill', 'stealth', 'vigilance'],
  'Shadow': ['underworld', 'skulduggery', 'stealth', 'streetwise'],
  'Shien Expertise': ['athletics', 'lightsaber_skill', 'resilience', 'skulduggery'],
  'Aggressor': ['coercion', 'underworld', 'ranged-light_skill', 'streetwise'],
  'Shii-Cho Knight': ['athletics', 'coordination', 'lightsaber_skill', 'melee_skill'],
  'Starfighter Ace': ['astrogation', 'gunnery_skill', 'mechanics', 'pilot-space']
};
var force_powers  = {
  'Battle Meditation': 'battle_meditation.pdf',
  'Bind': 'bind.pdf',
  'Enhance': 'enhance.pdf',
  'Farsight': 'farsight.pdf',
  'Forsee': 'forsee.pdf',
  'Heal/Harm': 'heal-harm.pdf',
  'Influence': 'influence.pdf',
  'Manipulate': 'manipulate.pdf',
  'Misdirect': 'misdirect.pdf',
  'Move': 'move.pdf',
  'Protect/Unleash': 'protect-unleash.pdf',
  'Seek': 'seek.pdf',
  'Sense': 'sense.pdf',
  'Supress': 'supress.pdf'
};
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

var get_career_skills = function() {
  let career_skills = [];
  for (skill in native_skills[char_info['career']]) {
    career_skills.push(native_skills[char_info['career']][skill]);
  }//get career skills
  for (spec in char_info['specializations']) {
    let spec_skills = native_skills[char_info['specializations'][spec]];
    for (skill in spec_skills) {
      if (career_skills.indexOf(spec_skills[skill]) == -1) {
        career_skills.push(spec_skills[skill]);
      }//only add new skills
    }//get specialization skill
  }//get specializations
  return career_skills;
};
var load_stats = function() {
  let career_skills = get_career_skills();

  for (stat in char_stats) {
    var e = document.getElementById( stat );
    e.value = char_stats[ stat ];
    if ( career_skills.indexOf(stat) != -1) {
      let label = document.getElementById(stat+'_label');
      label.innerHTML+= '*';
    }//signify career stats
  }//load stats
};//load_stats

var add_weapon = function() {
  //get weapon table
  var weapon_table = document.getElementById("weapons");
  //create & return new row:
  var weapon_row = document.createElement("div");
  weapon_row.classList.add("container");

  var weapon_id = 'w' + (document.getElementById("weapons").childElementCount);

  //create weapon select button
  var rad = document.createElement("input");
  rad.type = "radio";
  rad.name = "weapon";
  rad.id = weapon_id;
  rad.addEventListener('click', set_dice);
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
  var num_stats = ['damage', 'crit', 'viscious', 'accurate', `pierce`, `breach`, `linked`, `sunder`, 'burn', `blast`, `unweildy`, `hp`];
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
      rad.addEventListener('click', set_dice);
      weapon_row.appendChild(rad);

      var weapon_info = Object.keys(weapon);
      for (var j=0; j<weapon_info.length; j++) {
        var weapon_stat = weapon[weapon_info[j]];

        if ( isNaN(weapon_stat) ) {
          var weapon_text = document.createElement("span");
          weapon_text.style.paddingRight = "10px";
          weapon_text.style.paddingTop = "10px";
          //weapon_text.style.fontSize = "1.25em";
          weapon_text.id = weapon_keys[i] + '_' + weapon_info[j]
          weapon_text.innerHTML = weapon_stat;
          weapon_text.value = weapon_stat;
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
          input.style.width = "40px";
          stat_div.appendChild(input);
          weapon_row.appendChild(stat_div);
        }
      }//weapon info
      weapon_table.appendChild(weapon_row);
    }
  }//weapons
};//load_weapons


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
    span.classList.add('skill-line');
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
    input.style.width = "30px";
    input.addEventListener('change', updateXP);
    span.appendChild(radio);
    let name_span = document.createElement('span');
    name_span.id = skills[i] + "_label";
    name_span.innerText = name;
    span.appendChild(name_span);
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

var updateXP = function(e) {
  let new_val = e.target.value;
  let skill = e.target.id;
  let diff = new_val - char_stats[skill];
};

var setup_char_info = function() {
  setup_career_info();
  setup_spec_info();
};
var setup_career_info = function() {
  var career_select = document.createElement('select');
  career_select.id = 'career';
  var career_types = Object.keys(careers);
  for (var i=0; i<career_types.length;i++) {
    var career_option = document.createElement('option');
    career_option.id = career_types[i];
    career_option.name = career_types[i];
    career_option.value = career_types[i];
    career_option.text = career_types[i];
    //console.log(career_option);
    career_select.appendChild(career_option);
  }
  var career_container = document.getElementById('career_container');
  career_container.appendChild(career_select);
};

var setup_spec_info = function() {
  var spec_select = document.createElement('select');
  spec_select.classList.add('specializations');

  for (career_name in careers){
    var career_group = document.createElement('optgroup');
    career_group.label = career_name;

    for (spec_name in careers[career_name]) {
      var spec_option = document.createElement('option');
      spec_option.id = spec_name;
      spec_option.name = spec_name;
      spec_option.value = spec_name;
      spec_option.text = spec_name;
      //console.log(career_option);
      career_group.appendChild(spec_option);
    }
    spec_select.appendChild(career_group);
  }
  var spc_container = document.getElementById('spec_container');
  spec_container.appendChild(spec_select);
};

var load_char_info = function() {

  if ('char_name' in char_info) {
    let name_input = document.getElementById('char_name');
    let name_span = document.createElement('span');
    name_span.innerText = char_info['char_name'];
    name_span.value = char_info['char_name'];
    name_span.id = 'char_name';
    name_input.replaceWith(name_span);
  }

  //Career dispolay
  if ('career' in char_info) {
    let career_span = document.createElement('span');
    career_span.innerText = char_info['career'];
    career_span.value = char_info['career'];
    career_span.id = 'career';
    let career_input = document.getElementById('career_container');
    career_input.innerHTML = '';
    career_input.appendChild(career_span);
  }

  //specializations + links to sheets
  if ('specializations' in char_info) {
    let spec_container = document.getElementById('spec_container');
    spec_container.innerHTML="";
    for (var s=0; s<char_info['specializations'].length; s++) {
      let spec_span = document.createElement('a');
      spec_span.innerText = char_info['specializations'][s];
      spec_span.value = char_info['specializations'][s];
      spec_span.href = 'sheets/'+ get_sheet_ref(char_info['specializations'][s], 'spec');
      spec_span.target = '_blank';
      spec_span.classList.add('specializations');
      spec_container.appendChild(spec_span);
    }
  }//if specializations exist

  //force powers + links to sheets
  if ('force_powers' in char_info) {
    let fp_container = document.getElementById('fp_container');
    fp_container.innerHTML="";
    for (var f=0; f<char_info['force_powers'].length; f++) {
      let fp_span = document.createElement('a');
      let power = char_info['force_powers'][f];
      fp_span.innerText = power;
      fp_span.value = power;
      fp_span.href = 'sheets/force_powers/'+ force_powers[power];
      fp_span.target = '_blank';
      fp_span.classList.add('force_powers');
      fp_container.appendChild(fp_span);
    }
  }//if force powers exist

  let xp_input = document.getElementById('xp');
  xp_input.value = char_info['xp'];
  let credit_input = document.getElementById('credits');
  credit_input.value = char_info['credits'];
  let morality_input = document.getElementById('morality');
  morality_input.value = char_info['morality'];
};
var get_sheet_ref = function(sheet_name, sheet_type) {
  if (sheet_type == 'spec') {
    for (career_name in careers) {
      for (spec_name in careers[career_name]) {
        if (spec_name == sheet_name) {
          return careers[career_name][spec_name];
        }
      }//spec loop
    }//carrer loop
  }//spec ref
};

var setup_force_powers = function() {
  var fp_select = document.createElement('select');
  fp_select.classList.add('force_powers');

  for (fp_name in force_powers){
    var fp_option = document.createElement('option');
    fp_option.id = fp_name;
    fp_option.name = fp_name;
    fp_option.value = fp_name;
    fp_option.text = fp_name;
    //console.log(career_option);
    fp_select.appendChild(fp_option);
  }
  var fp_container = document.getElementById('fp_container');
  fp_container.appendChild(fp_select);
};

var get_check = function( e ) {
  var c = e.target.id.lastIndexOf('_');
  var skill = e.target.id.substr(0, c);
  set_dice(skill);
};

var set_dice = function( skill ) {
  var chara = check_table[skill];
  if (document.getElementById(skill)) {
    var num_skill = document.getElementById(skill).value;
    var num_char = document.getElementById(chara).value;
    var num_dice = Math.max(num_skill, num_char);
    var num_yellow = Math.min(num_skill, num_char);
    document.getElementById('numgreen').value = (num_dice - num_yellow);
    document.getElementById('numyellow').value = num_yellow;

    //add boost dice for accurate
    if ( combat_skills.indexOf(skill) != -1) {
      //check for a weapon
      if (document.querySelector('input[name="weapon"]:checked')) {
        let weapon_name = document.querySelector('input[name="weapon"]:checked').id;
        weapon_name = weapon_name.slice(weapon_name.search('_') + 1);
        let accurate = parseInt(document.getElementById(weapon_name + '_accurate').value);
        var b = document.getElementById('numboost').value = accurate;
      }//found weapon
    }//combat check
    updatePool();
  }
};

/*===========================
  DICE FUNCTIONS
  ===========================*/
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
        negResults[result-RESULT_OFFSET]+= 1;
      }
      else if (result.length == 2) {
        negResults[result[0]-RESULT_OFFSET]+= 1;
        negResults[result[1]-RESULT_OFFSET]+= 1;
      }
    }
  }
  //console.log(negDice);
  //displayDiceResults(posDice, negDice);
  displayDiceResultsDOM(posDice, negDice);
  updateResultTotals();
};
var displayDiceResultsDOM = function(posDice, negDice) {

  var posResultDisplay = document.getElementById('pospool0');
  posResultDisplay.innerHTML = "";
  for (var i=0; i<posDice.length; i++) {

    var dtype = posDice[i][0];
    var result = posDice[i][1];

    var die = document.createElement('span');
    die.classList.add('die');//new
    posResultDisplay.appendChild(die);

    roll_animation(die, dtype, result);
  }//positive dice

  var negResultDisplay = document.getElementById('negpool0');
  negResultDisplay.innerHTML = "";

  for (var i=0; i<negDice.length; i++) {

    var dtype = negDice[i][0];
    var result = negDice[i][1];

    var die = document.createElement('span');
    die.classList.add('die');//new
    negResultDisplay.appendChild(die);
    roll_animation(die, dtype,  result);
  }//neg dice
};

var updateResultTotals = function() {
  var u = posResults[TRIUMPH];
  var s = posResults[SUCCESS] + u;
  var a = posResults[ADVANTAGE];
  var d = negResults[DESPAIR-RESULT_OFFSET];
  var f = negResults[FAILURE-RESULT_OFFSET] + d;
  var t = negResults[THREAT-RESULT_OFFSET];

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
      //console.log('combat check');

      var damage = 0;
      if (document.querySelector('input[name="weapon"]:checked')) {
        var weapon_name = document.querySelector('input[name="weapon"]:checked').id;
        weapon_name = weapon_name.slice(weapon_name.search('_') + 1);
        //console.log(weapon_name);
        damage = parseInt(document.getElementById(weapon_name + '_damage').value);

        //add brawn to damage for melee/brawl
        if (check_type == 'melee_skill_check' ||
            check_type == 'brawl_skill_check' ) {
            let brawn = parseInt(document.getElementById('brawn').value);
            damage+= brawn;
            }//+brawn
      }

      //console.log(weapon_name);

      document.getElementById("total_damage").innerText = "Damage: 0";
      if ((s-f) > 0) {
        damage+= (s-f);
        document.getElementById("total_damage").innerText = "Damage: " + damage;
      }
    }//combat check
    else {
      document.getElementById("total_damage").innerText ="";
    }//remove samage if not weapon check
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

  for (posDie in posDicePool) {
    var amt = posDicePool[posDie];
    for (var i=0; i<amt; i++) {
      var die = document.createElement('span');
      die.classList.add('die');//new
      posPoolDisplay.appendChild(die);
      display_die(die, posDie, false);
    }
  }//positive dice

  var negPoolDisplay = document.getElementById('negpool0');
  negPoolDisplay.innerHTML = "";

  for (negDie in negDicePool) {
    var amt = negDicePool[negDie];
    for (var i=0; i<amt; i++) {
      var die = document.createElement('span');
      die.classList.add('die');//new
      negPoolDisplay.appendChild(die);
      display_die(die, negDie, false);
    }
  }//positive dice
};//updateDiceDisplayDOM

var updatePool = function() {
  var g = document.getElementById('numgreen').value;
  var p = document.getElementById('numpurple').value;
  var y = document.getElementById('numyellow').value;
  var r = document.getElementById('numred').value;
  var b = document.getElementById('numboost').value;
  var s = document.getElementById('numsetback').value;

  if (document.getElementById('force-roll').checked) {
    var fr = document.getElementById('force-rating').value;
    document.getElementById('numforce').value = fr;
  }
  var f = document.getElementById('numforce').value;

  posDicePool['green'] = g;
  posDicePool['yellow'] = y;
  posDicePool['boost'] = b;
  posDicePool['force'] = f;

  negDicePool['purple'] = p;
  negDicePool['red'] = r;
  negDicePool['setback'] = s;

  updateDiceDisplayDOM();
};

var display_die = function(die, dtype, result) {

  var dice_types = {'green': "#00FF00", 'yellow' : '#FFFF00', 'boost': '#80dfff', 'force':'#fff8dc', 'purple': "#5c00e6", 'red' : '#FF0000', 'setback': '#000000'};
  die.style.backgroundColor = dice_types[dtype];

  if (result) {
    if (result.length == 1) {
      var img = document.createElement('img');
      img.classList.add('dieimage');
      img.src = dieImages[result].src;
      img.width = DICE_SIZE;
      img.height = DICE_SIZE;
      die.appendChild(img);
    }
    else if (result.length == 2) {
      var img_container = document.createElement('div');
      img_container.classList.add('dieimage_small');
      var img = document.createElement('img');
      img.src = dieImages[result[0]].src;
      img.width = DICE_SIZE/2;
      img.height = DICE_SIZE/2;
      img.style.float = 'left';
      img_container.appendChild(img);
      die.appendChild(img_container);
      var img_container = document.createElement('div');
      img_container.classList.add('dieimage_small');
      img = document.createElement('img');
      img.src = dieImages[result[1]].src;
      img.width = DICE_SIZE/2;
      img.height = DICE_SIZE/2;
      img.style.float = 'right';
      img_container.appendChild(img);
      die.appendChild(img_container);
    }
  }
};

var roll_animation = function(die, dtype, result) {
  var cycles = 50;
  let timer = setInterval( function() {
    if (cycles == 0) {
      clearInterval(timer);
      die.innerHTML="";
      display_die(die, dtype, result);
    }
    else {
      let r  = dice[dtype][Math.floor(Math.random() * dice[dtype].length)];
      die.innerHTML="";
      //die.innerText = Math.floor(Math.random()*6)+1;
      display_die(die, dtype, r);
      cycles--;
    }
  }, 10);
};//roll_animation
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
document.getElementById('force-roll').addEventListener('change', updatePool);
document.getElementById("roll").addEventListener('click', rollDice);

//Data saving
var get_weapons = function() {
  var weapon_table = document.getElementById("weapons");
  var new_weapons = {};
  for (var w=0; w < weapon_table.childElementCount; w++) {
    var weapon_row = weapon_table.childNodes[w];
    //console.log(weapon_row);
    //get weapon identifier from first entry
    var weapon_id = weapon_row.childNodes[0].id;
    var weapon = {}
    for (var i=1; i<weapon_row.childElementCount; i++) {
      var weapon_data = weapon_row.childNodes[i];
      console.log(weapon_data);
      var stat_id = weapon_data.id.split('_')[1];
      if (stat_id == 'name') {
        weapon['name'] = weapon_data.value;
      }
      else if (weapon_data.nodeName == 'SELECT') {
        weapon[stat_id] = weapon_data.value;
      }
      else if (weapon_data.nodeName == 'SPAN') {
        console.log(stat_id);
        weapon[stat_id] = weapon_data.innerText;
      }
      else {
        //console.log(weapon_data.nodeName);
        //console.log(weapon_data.childNodes[1]);
        weapon_data = weapon_data.childNodes[1];
        var stat_id = weapon_data.id.split('_')[1];
        weapon[stat_id] = weapon_data.value;
      }
    }//individual cell
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
var get_char_info = function() {
  let new_info = {};
  new_info['char_name'] = document.getElementById('char_name').value;
  new_info['career'] = document.getElementById('career').value;
  let specs = [];
  let spec_selector = document.getElementsByClassName('specializations');
  for (let s=0; s<spec_selector.length; s++) {
    specs.push(spec_selector[s].value);
  }
  new_info['specializations'] = specs;
  let fps = [];
  let fp_selector = document.getElementsByClassName('force_powers');
  for (let f=0; f<fp_selector.length; f++) {
    fps.push(fp_selector[f].value);
  }
  new_info['force_powers'] = fps;
  new_info['xp'] = document.getElementById('xp').value;
  new_info['credits'] = document.getElementById('credits').value;
  new_info['morality'] = document.getElementById('morality').value;
  //console.log(new_info);
  return new_info;
};

var encode_stats = function() {
  var new_stats = get_stats();
  var new_weapons = get_weapons();
  var new_char_info = get_char_info();
  console.log(new_char_info);
  var encode_data = {stats: new_stats, weapons: new_weapons, info: new_char_info};
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
  // console.log('info in set_stats:');
  // console.log(data['info']);
  char_info = data['info'];
};

var setup = function() {
  setup_skills_div();
  setup_char_info();

  var checks = document.getElementsByName('check_type');
  for (var i=0; i<checks.length; i++) {
    checks[i].addEventListener('click', get_check);
  }
  if ( window.location.hash ) {
    console.log("getting stats");
    set_stats( window.location.hash );
    load_stats();
    load_weapons();
    load_char_info();
  }
};
