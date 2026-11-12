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
let dragged = null;

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
  'injured': 0,

  'info' : {
    'name' : '',
    'race' : '',
    'crawler_number' : -1,
    'level' : 1,
    'class' : '',
    'floor' : 1,
    'gold' : 0,
    'popularity' : 0
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
const SKILL_HEADERS = ['name', 'rank', 'rankbase', 'stat', 'damage', 'notes', 'grind_bank', 'marked'];
const SKILL_TYPES = ['attack', 'defense', 'other'];
const STAT_BREAKPOINTS = [3, 6, 10, 20, 50, 100, 150, 200, 300];

const setup = function() {
  if ( window.location.hash ) {
    set_stats( window.location.hash );
  }
  else {
    //leave blank to allow for new chars
    //char_stats = mike_stats;
  }
  char_stats = compute_stats(char_stats);
  //console.log(char_stats.dr);
  repopulate_page();

  //add listeners
  let attack_table = document.getElementById("attack_skills");
  attack_table.addEventListener('command',  make_blank_skill_row);
  let defense_table = document.getElementById("defense_skills");
  defense_table.addEventListener('command',  make_blank_skill_row);
  let other_table = document.getElementById("other_skills");
  other_table.addEventListener('command',  make_blank_skill_row);

  let inventory = document.getElementById("inventory");
  inventory.addEventListener('command',  make_blank_inventory_item);
  inventory.addEventListener('pointerdown', inventory_drag_init);
  inventory.addEventListener('dragstart', inventory_drag_start);
  inventory.addEventListener('dragover', inventory_dragover);
  inventory.addEventListener('dragend', inventory_dragend);

  let check_pool = document.getElementById("check_dicepool");
  check_pool.addEventListener('command',  roll_dice);
  let damage_pool = document.getElementById("damage_dicepool");
  damage_pool.addEventListener('command',  roll_dice);
  let advantage = document.getElementById("advantage");
  advantage.addEventListener('click', toggle_advantage);
  let disadvantage = document.getElementById("disadvantage");
  disadvantage.addEventListener('click', toggle_disadvantage);
};

const inventory_drag_init = function(e) {
 const summary = e.target.closest('summary');
 const item = summary && summary.parentElement;
 if (item && item.parentElement === document.getElementById('inventory')) {
    item.draggable = true;
 }
};
const inventory_drag_start = function(e) {
  dragged = e.target.closest('details');
  if (!dragged || dragged.parentElement !== document.getElementById('inventory')) return;
  dragged.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', ''); // required by Firefox
};
const inventory_dragover = function(e) {
  let inventory =  document.getElementById('inventory');
  if (!dragged) return;
  e.preventDefault();
  const after = getInsertionPoint(e.clientY, inventory);
  if (after == null) inventory.appendChild(dragged);
  else if (after !== dragged) inventory.insertBefore(dragged, after);
};
// Find the direct-child details whose midpoint is just below the cursor.
const getInsertionPoint = function(y, inventory) {
  const others = [...inventory.children].filter(el => el !== dragged);
  return others.find(el => {
    const box = el.getBoundingClientRect();
    return y < box.top + box.height / 2;
  }) ?? null;
};
const inventory_dragend = function(e) {
  if (!dragged) return;
  dragged.classList.remove('dragging');
  dragged.draggable = false;
  dragged = null;
  //console.log(e.currentTarget.children);
  renumber_inventory(e.currentTarget.children);
};
const renumber_inventory = function(inventory_list) {
  let count = 0;
  for (let item of inventory_list) {
    let item_number = item.id.split('_')[0].replace('item', '');
    if (item_number != count) {
      //console.log(item);
      renumber_item(item, count);
    }
    count++;
  }
  char_stats['inventory'] = collect_inventory(document.getElementsByClassName("inventory-item"), char_stats['skills']);
};
const renumber_item = function(item, count) {
  let newid = 'item' + count;
  let oldid = item.id.split('_')[0];
  //console.log('\t', newid, oldid);
  for (let section of item.children) {
    if (section.id && section.id.includes(oldid)) {
      //console.log(section);
      section.id = section.id.replace(oldid, newid);
      if (section.tagName == 'UL') {
        //console.log('\nLIST TIME');
        for (let li of section.children) {
          //console.log(li);
          for (let property of li.children) {
            if (property.id && property.id.includes(oldid)) {
              property.id = property.id.replace(oldid, newid);
            }
          }//input items inside li
        }//list items
      }//iterate over ul
      //console.log(section);
    }//if id needs the change
  }//top level children
  item.id = item.id.replace(oldid, newid);
};//renumber_item


const repopulate_page = function() {
  populate_info(char_stats['info']);
  make_health_bar(char_stats['health']);
  make_stats(char_stats);

  populate_skills('attack', char_stats['skills']['attack']);
  populate_skills('defense', char_stats['skills']['defense']);
  populate_skills('other', char_stats['skills']['other']);
  populate_inventory(char_stats['inventory']);
  document.getElementById('char_notes').value = char_stats['notes'];
};

const compute_stats = function(stats) {

  //reset any stats that should be
  stats['dr'] = 0;
  for (let stat of STAT_NAMES) {
    stats[stat+'_bonus'] = 0;
  }
  for (let type of SKILL_TYPES) {
    for (let skill of stats['skills'][type]) {
      //console.log(skill);
      skill['rank'] = 0;
    }
  }

  //handle any inventory modifications
  //console.log(stats['inventory']);
  for (let item of stats['inventory']) {
    let quantity = 0;
    //console.log(item);
    if ('quantity' in item && isInt(item['quantity']) ) {
      quantity = parseInt(item['quantity']);
      //console.log("\t"+ quantity);
    }//quantity
    if ('dr' in item && isInt(item['dr'])) {
        //console.log('\tAdding dr');
        let dr = parseInt(item['dr']) * quantity;
        stats['dr']+= dr;
        //console.log(stats['dr'])
      }//dr
    for (let stat_bonus of Object.keys(item['stat_bonus'])) {
      //console.log(stat_bonus);
      let bonus = item['stat_bonus'][stat_bonus];
      if (isInt(bonus)) {
        stats[stat_bonus+"_bonus"]+= parseInt(bonus) * quantity;
      }
    }//stat bonuses
    for (let skill_bonus of item['skill_bonus']) {
      //console.log(skill_bonus);
      let added = false;
      if (!Object.keys(stats['skills']).includes(skill_bonus['type']) ){
        continue;
      }
      let skill_list = stats['skills'][skill_bonus['type']];
      for (let current_skill of skill_list) {
        if (current_skill['name'] == skill_bonus['name']) {
          let bonus = skill_bonus['bonus'];
          if (isInt(bonus)) {
            current_skill['rank']+= parseInt(bonus) * quantity;
            added = true;
          }
        }//added skill
      }//current skill loop
      if (!added) {
        /* needs to be completed, add new skill that does not exist yet */
        /* need to separate skill ranks from items vs natural skill ranks */
        //skill_list['name']
        //console.log("skill must be added");
        //console.log(skill_bonus);
        add_new_skill(skill_bonus['type']);
        //console.log(skill_list);
        //console.log(skill_list.length);
        skill_list[skill_list.length-1]['name'] = skill_bonus['name'];
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


  /* add base rank skill values to skills */
  for (let type of Object.keys(char_stats['skills'])) {
    for (let skill of char_stats['skills'][type]) {
      skill['rank']+= skill['rankbase'];
      //console.log(skill);
    }
  }
  //console.log(stats);
  return stats;
};//compute_stats

const populate_inventory = function(inventory) {
  let count = 0;
  let inventory_containter = document.getElementById("inventory");
  inventory_containter.innerHTML = '';
  for (item of inventory) {
    let itemid = "item"+count;
    //console.log(item);
    let item_element = document.createElement("details");
    item_element.id = itemid+'_deets';
    item_element.innerHTML = '<summary>'+item['name']+  " " + item['quantity'] + '</summary>';
    let property_list = document.createElement("ul");
    property_list.id = itemid;
    property_list.classList.add('inventory-item');

    for (let key of Object.keys(item)) {
      let property = item[key];

      if (typeof property != 'object') {
        let property_item = document.createElement("li");
        property_item.innerText = key + ": ";
        let property_value =  document.createElement(key == 'notes' ? 'textarea' : 'input');//document.createElement("input");
        property_value.classList.add('invisible-textbox');
        property_value.id = itemid+"_"+key;
        property_value.value = property;
        property_value.addEventListener('change', update_item);
        property_item.appendChild(property_value);
        property_list.appendChild(property_item);
        //console.log(property_value);
      }//non-data sturcture porperty
      else if (Array.isArray(property)) {
          let property_type = key.split('_')[0];
          let spcount = 0;
          for (let sub_prop of property) {
            let spid = itemid + "_" + property_type + spcount;
            let property_item = document.createElement("li");
            let sub_name = document.createElement("input")
            sub_name.classList.add('invisible-textbox');
            sub_name.id = spid + "_name";
            sub_name.value = sub_prop['name'];
            sub_name.addEventListener('change', update_item);
            property_item.appendChild(sub_name);

            sub_name = document.createElement("input")
            sub_name.classList.add('invisible-textbox');
            sub_name.id = spid + "_type";
            sub_name.value = sub_prop['type'];
            sub_name.addEventListener('change', update_item);
            property_item.appendChild(sub_name);

            sub_name = document.createElement("input")
            sub_name.classList.add('invisible-textbox');
            sub_name.id = spid + "_bonus";
            sub_name.value = sub_prop['bonus'];
            sub_name.addEventListener('change', update_item);
            property_item.appendChild(sub_name);

            //console.log(property_item);
            property_list.appendChild(property_item);
            spcount++;
          }//loop through array memebers
      }//array version - skills
      else {
        let property_type = key.split('_')[0];
        let spcount = 0;
        for (let sub_property of Object.keys(property)) {
          let propid = itemid + '_' + property_type + spcount;
          let property_item = document.createElement("li");
          let sub_name = document.createElement("input");
          sub_name.classList.add('invisible-textbox');
          sub_name.id = propid + '_name';
          sub_name.value = sub_property;
          sub_name.addEventListener('change', update_item);
          property_item.appendChild(sub_name);
          let sub_value = document.createElement("input");
          sub_value.classList.add('invisible-textbox');
          sub_value.id = propid + '_value'
          sub_value.value = property[sub_property];
          sub_value.addEventListener('change', update_item);
          property_item.appendChild(sub_value);
          property_list.appendChild(property_item);
          spcount++;
        }//
      }//object version - stats
    }//item properties

    item_element.appendChild(property_list);
    let skill_button = document.createElement('button')
    skill_button.innerText = '+ skill';
    skill_button.id = itemid + '_newskill';
    skill_button.addEventListener('click', new_item_skill);
    let stat_button = document.createElement('button');
    stat_button.innerText = '+ stat';
    stat_button.id = itemid + '_newstat';
    stat_button.addEventListener('click', new_item_stat);
    item_element.appendChild(skill_button);
    item_element.appendChild(stat_button);

    inventory_containter.appendChild(item_element);
    count++;
  }
};//populate_inventory


const make_blank_inventory_item = function(e) {
  let inventory_container = e.target;
  let itemid = 'item'+inventory_container.children.length;
  let new_item = document.createElement('details');

  new_item.open = true;
  new_item.innerHTML = '<summary>New Item</summary>';
  let property_list = document.createElement('ul');
  property_list.id = itemid;
  let input_properties = ['name', 'quantity', 'dr', 'notes'];
  for (let prop of input_properties) {
    let prop_item = document.createElement('li');
    prop_item.innerText = prop + ': ';
    let prop_value = document.createElement(prop == 'notes' ? 'textarea' : 'input');//document.createElement('input');
    prop_value.classList.add('invisible-textbox');
    prop_value.id = itemid + '_' + prop;
    prop_value.addEventListener('change', update_item);
    prop_item.appendChild(prop_value);
    property_list.appendChild(prop_item);
  }//reg.properties
  new_item.appendChild(property_list);
  let skill_button = document.createElement('button')
  skill_button.id = itemid + '_newskill';
  skill_button.innerText = '+ skill';
  skill_button.addEventListener('click', new_item_skill);
  let stat_button = document.createElement('button');
  stat_button.innerText = '+ stat';
  stat_button.id = itemid + '_newstat';
  stat_button.addEventListener('click', new_item_stat);
  new_item.appendChild(skill_button);
  new_item.appendChild(stat_button);
  inventory_container.appendChild(new_item);
};

const update_item = function(e) {
  let trigger = e.target;
  let item_parts = trigger.id.split('_');
  //console.log(item_parts);
  let num = item_parts[0].replace('item', '');
  num = parseInt(num);
  let property = item_parts[1];
  let value = trigger.value;
  if (isInt(value)) {
    value = parseInt(value);
  }
  if (num >= char_stats['inventory'].length) {
    //console.log('new item');
    add_new_item();
  }

  let target_item = char_stats['inventory'][num];
  let skill_check = property.indexOf('skill');
  let stat_check = property.indexOf('stat');
  //console.log(target_item);
  //console.log(num, property, value, skill_check);
  //normal property
  if (skill_check >= 0) {
    let skill_num = parseInt(property.replace('skill', ''));
    if (skill_num >= target_item['skill_bonus'].length) {
      add_new_item;
    }

    let target_skill = target_item['skill_bonus'][skill_num];
    let skill_option = item_parts[2];
    //console.log(target_skill);
    target_skill[skill_option] = value;
    //console.log(target_skill);
  }
  else if (stat_check >= 0) {
    let stat_num = parseInt(property.replace('stat', ''));
    let stat_option = item_parts[2];
    let stat_key = Object.keys(target_item['stat_bonus'])[stat_num];
    let target_stat = target_item['stat_bonus'][stat_key];

    if (stat_option == 'value') {
      target_item['stat_bonus'][stat_key] = value;
    }
    else  {
      //console.log('removing stat', stat_key);
      delete target_item['stat_bonus'][stat_key];
      if (!Object.keys(target_item['stat_bonus']).includes(value)) {
        //console.log('new stat');
        target_item['stat_bonus'][value] = 0;
      }
    }
    //console.log(property, stat_option, value, stat_key);
    //console.log(target_item);
  }
  else {
    target_item[property] = value;
  }//normal property

  char_stats = compute_stats(char_stats);
  repopulate_page();
  document.getElementById(item_parts[0]+'_deets').open = true;
};

const new_item_skill = function(e) {
  let trigger = e.target;
  let item_num = parseInt(trigger.id.split('_')[0].replace('item', '')); //this is  a bad line of code
  let item = char_stats['inventory'][item_num];
  add_item_skill(item);
  repopulate_page();
  //console.log(trigger.id);
  document.getElementById(trigger.id.replace('newskill', 'deets')).open = true;
  //console.log(item);
};

const new_item_stat = function(e) {
  let trigger = e.target;
  let item_num = parseInt(trigger.id.split('_')[0].replace('item', '')); //this is  a bad line of code
  let item = char_stats['inventory'][item_num];
  item['stat_bonus']['new_stat'] = 0;
  repopulate_page();
  document.getElementById(trigger.id.replace('newstat', 'deets')).open = true;
  //console.log(item);
};

const add_item_skill = function(item) {
  let new_skill = { 'name' : '', 'type' : '', 'bonus' : 0};
  item['skill_bonus'].push(new_skill);
};

const add_new_item = function() {
    let new_item = {'name' : '',
      'quantity' : 0,
      'dr': 0,
     'skill_bonus' : [],
     'stat_bonus' : {},
     'notes': ''};
    char_stats['inventory'].push(new_item);
};

const populate_info = function(info) {
  //info = stats['info'];

  for (let i of Object.keys(info)) {
    //console.log(i);
    //console.log(info[i]);
    let info_box = document.getElementById('char_'+i);
    if (info_box) {
      info_box.value = info[i];
      if (info[i] && (i == 'name' || i == 'race')) {
        info_box.labels[0].innerText = '';
      }
    }
  }
};//populate_info

const make_stats =  function(stats) {
  let stat_row = document.getElementById("stats");
  stat_row.innerHTML = "";

  for (let stat of STAT_NAMES) {
    stat_row.appendChild(make_stat_box(stats, stat));
  }
  //add mana and dr
  let derrived_stats = ['mana', 'dr'];
  for (let d of derrived_stats) {
    let stat_box = document.createElement("div");
    stat_box.classList.add("vertical");
    stat_box.classList.add("stat-box");
    stat_box.innerHTML = "<span>"+d+"</span>";
    let stat_base = document.createElement("input");
    stat_base.classList.add("invisible-textbox");
    stat_base.id = d + "_base";
    stat_base.value = stats[d];
    //stat_base.addEventListener('change', update_stats);
    stat_box.appendChild(stat_base);
    stat_row.appendChild(stat_box);
  }

};//make_stats

const update_stats = function() {

  //colect base modifiers
  let new_base = collect_base_stats();
  //console.log(new_base);
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
    let injury = false;
    if ( 10 - char_stats['injured'] <= i) { injury = true; }
    let health_box = make_health_box(health_section, i, injury);
    health_bar.appendChild(health_box);
  }
};//make_health_bar

const make_health_box = function(conmod, i, injury) {

  let health_container = document.createElement("div");
  health_container.classList.add("vertical");
  health_container.classList.add("health-box");
  health_container.classList.add("item-center");
  if (injury) {
    health_container.classList.add('injured');
  }
  health_container.id = 'health' + i;
  let health_box = document.createElement("span");

  health_box.innerText = conmod;
  health_container.appendChild(health_box);
  health_container.innerHTML+= '<span style="font-size: 0.70em;">' + ((i+1) * 10) + "%</span>";

  health_container.addEventListener('click', mark_health);
  return health_container;
};//make_health_box

const mark_health = function(e) {
  //console.log(e.currentTarget);
  let health_box = e.currentTarget;
  if (health_box.classList.contains('injured')) {
    char_stats['injured']--;
  }
  else {
    char_stats['injured']++;
  }
  health_box.classList.toggle("injured");
};

/* div & details version of skills */
const populate_skills = function(type, skills) {
  var skills_ul = document.getElementById(type+'_skills');
  skills_ul.innerHTML = '';
  let i = 0;
  for (let skill of skills) {
    skills_ul.appendChild( make_skill_li(skill, type, i) );
    i++;
  }
};

const make_skill_summary = function(name, rank, stat) {
  return name + " " + rank + " " + stat.substring(0, 3);
};

const make_skill_li = function(skill, type, i) {
  let li = document.createElement("li");
  let skillid = type+'_'+i;
  let mod = '';
  if (skill['stat']) {
    mod = char_stats[skill['stat']+"_mod"];
  }

  //add select box
  let checkbox = document.createElement('input');
  checkbox.type = "radio";
  checkbox.value = skillid;
  checkbox.name = 'selected_skill';
  checkbox.addEventListener('change', select_skill);
  li.appendChild(checkbox);

  let details = document.createElement('details');
  details.id = skillid+'_details';
  let summary = document.createElement('summary');
  //summary.innerText = skill['name'] + " " + skill['rank'] + " " + skill['stat'].substring(0, 3);
  summary.innerText = make_skill_summary(skill['name'], skill['rank'], skill['stat']);
  details.appendChild(summary);
  let detail_list = document.createElement('ul');

  for (let header of SKILL_HEADERS) {
    let detail_li = document.createElement('li');
    detail_li.innerText = header + ': ';
    let cell_data = document.createElement(header == 'notes' ? 'textarea' : 'input');//document.createElement("input");
    if (header == 'marked') {
      cell_data.type = 'checkbox';
      cell_data.checked = skill['marked'];
    }
    else {
      cell_data.classList.add("invisible-textbox");
    }
    if (header == 'rank') {
      cell_data.readOnly = true;
    }
    cell_data.name = skillid;
    cell_data.id = skillid+'_'+header;

    if (header == 'mod') { cell_data.value = mod; }
    else {
      cell_data.value = skill[header];
      if (header != 'rank') {
        cell_data.addEventListener('change', update_skill);
      }
    }

    detail_li.appendChild(cell_data);
    detail_list.appendChild(detail_li);
  }//loop over headers

  details.appendChild(detail_list);
  li.appendChild(details);
  return li;
};

const make_blank_skill_row = function(e) {
  let li = document.createElement("li");
  let skillid = e.target.id.split('_')[0] + '_' + e.target.childElementCount;

  //add select box
  let checkbox = document.createElement('input');
  checkbox.type = "radio";
  checkbox.value = skillid;
  checkbox.name = 'selected_skill';
  checkbox.addEventListener('change', select_skill);
  li.appendChild(checkbox);

  let details = document.createElement('details');
  details.id = skillid + '_details';
  details.open = true;
  let summary = document.createElement('summary');

  summary.innerText = "New Skill";
  details.appendChild(summary);
  let detail_list = document.createElement('ul');

  for (let header of SKILL_HEADERS) {
    let detail_li = document.createElement('li');
    detail_li.innerText = header + ': ';
    let cell_data = document.createElement(header == 'notes' ? 'textarea' : 'input');//document.createElement("input");
    cell_data.classList.add("invisible-textbox");
    cell_data.name = skillid;
    cell_data.id = skillid+'_'+header;
    cell_data.addEventListener('change', update_skill);
    if (header == 'rank') {
      cell_data.readOnly = true;
    }
    detail_li.appendChild(cell_data);
    detail_list.appendChild(detail_li);
  }//loop over headers

  details.appendChild(detail_list);
  li.appendChild(details);

  e.target.appendChild(li);
};

const update_skill = function(e) {
  let trigger = e.target;
  let skill_parts = trigger.id.split('_');
  let type = skill_parts[0];
  let num = parseInt(skill_parts[1]);
  let option = skill_parts[2];
  //console.log(trigger);
  let value = trigger.value;
  if (isInt(value)) {
    value = parseInt(value);
  }
  if (option == 'marked') {
    trigger.value = trigger.checked;
    value = trigger.value == 'true';
  }
  //console.log(skill_parts);
  if (num >= char_stats['skills'][type].length) {
    add_new_skill(type);
  }
  let target_skill = char_stats['skills'][type][num];
  if (option == 'rankbase') {
    let current_offset = target_skill['rank'] - target_skill['rankbase'];
    target_skill['rankbase'] = value;
    target_skill['rank'] = value + current_offset;
    //console.log(document.getElementById(type+'_'+num+'_rank'));
    document.getElementById(type+'_'+num+'_rank').value = target_skill['rank'];
  }
  target_skill[option] = value;

  let summary = document.getElementById(type+'_'+num+'_details').querySelector('summary');
  summary.innerText = make_skill_summary(target_skill['name'], target_skill['rank'], target_skill['stat']);
};

const add_new_skill = function(type) {
  let new_skill = {'name' : '',
                   'rank' : '',
                   'rankbase' : '',
                   'stat': '',
                   'marked': '',
                   'damage' : '',
                   'grind_bank': '',
                   'notes' : ''}
  char_stats['skills'][type].push(new_skill)
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
    bonus_display.innerHTML = "+" + mod;
    updateDiceDisplay('damage');
  }
  //console.log(skill);
};

const toggle_advantage = function(e) {
  //console.log(e.target);
  e.target.classList.toggle('selected_mod');
  let ad_state = e.target.classList.contains('selected_mod');
  //let disad_state = document.getElementById('disadvantage').checked;
  let disad_state = document.getElementById('disadvantage').classList.contains('selected_mod');

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
  e.target.classList.toggle('selected_mod');
  let disad_state = e.target.classList.contains('selected_mod');
  //let disad_state = e.target.checked;
  //let ad_state = document.getElementById('advantage').checked;
  let ad_state = document.getElementById('advantage').classList.contains('selected_mod');

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
    'injured': 0,

    'info' : {
      'name' : '',
      'race' : '',
      'crawler_number' : -1,
      'level' : 1,
      'class' : '',
      'floor' : 1,
      'gold' : 0,
      'popularity' : 0
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

  new_stats['injured'] = char_stats['injured'];

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
    if ( document.getElementById(skill_type+"_skills") ) {
      let skills = document.getElementById(skill_type+"_skills").children;
      let skill_count = 0;
      for (let skill of skills) {
        let skill_dict = collect_skill(skill_type, skill_count);
        //rankbase(skill_dict);
        new_stats['skills'][skill_type].push(skill_dict);
        skill_count++;
      }//loop over skill rows
    }//if there are skills
  }//loop over kill types


  //grab inventory
  new_stats['inventory'] = collect_inventory(document.getElementsByClassName("inventory-item"), new_stats['skills']);

  //grab notes
  new_stats['notes'] = document.getElementById('char_notes').value;
  return new_stats;
};//get_stats

const collect_inventory = function(inventory_nodes, current_skills) {
  let new_inventory = [];
  //console.log(inventory_nodes);
  for (let item of inventory_nodes) {
    let blank_item = {'name': '', 'quantity': 0, 'dr' : 0,
      'skill_bonus':[], 'stat_bonus' :{}, 'notes':''};
    let itemid = item.id;
    blank_item['name'] = document.getElementById(itemid+'_name').value;
    blank_item['notes'] = document.getElementById(itemid+'_notes').value;
    let quantity = document.getElementById(itemid+'_quantity').value;
    if (isInt(quantity)) {
      blank_item['quantity'] = parseInt(quantity);
    }
    let dr = document.getElementById(itemid+'_dr').value;
    if (isInt(dr)) {
      blank_item['dr'] = parseInt(dr);
    }
    //get skills
    let skills = document.querySelectorAll('[id^="'+itemid+'_skill"]');
    for (let skillcount=0; skillcount < skills.length/3; skillcount++) {
      let new_skill = {}
      let skill_name = document.getElementById(itemid+'_skill'+skillcount+"_name").value;
      let skill_type = document.getElementById(itemid+'_skill'+skillcount+"_type").value;
      let skill_bonus = document.getElementById(itemid+'_skill'+skillcount+"_bonus").value;
      if (isInt(skill_bonus)) {
        skill_bonus = parseInt(skill_bonus);
      }
      new_skill['name'] = skill_name;
      new_skill['type'] = skill_type;
      new_skill['bonus'] = skill_bonus;
      blank_item['skill_bonus'].push(new_skill);

      //subtract bonus from actual skill.
      for (let cskill of current_skills[skill_type]) {
        if (cskill['name'] == skill_name) {
          cskill['rank']-= skill_bonus;
        }
      }//subtract bonus skill ranks
    }
    //get stats
    let stats = document.querySelectorAll('[id^="'+itemid+'_stat"]');
    //console.log(stats);
    for (let statcount=0; statcount < stats.length/2; statcount++) {
      let stat_name = document.getElementById(itemid+'_stat'+statcount+"_name").value;
      let stat_bonus = document.getElementById(itemid+'_stat'+statcount+"_value").value;
      if (isInt(stat_bonus)) {
        stat_bonus = parseInt(stat_bonus);
      }
      blank_item['stat_bonus'][stat_name] = stat_bonus;
    }
    new_inventory.push(blank_item);
  }//loop thoguth inventory
  return new_inventory;
};//collect_inventory


const collect_skill = function(skill_type, skill_count) {
  let skill_dict = {}
  let skill_id = skill_type+'_'+skill_count;
  for (let header of SKILL_HEADERS) {
    console.log("\t"+header + " " + skill_id);
    let element = document.getElementById(skill_id+"_"+header);
    //console.log(element);
    let value = "";
    if (element) {
      value = element.value;
      if (header == 'marked') {
        console.log(element.checked);
        value = element.checked;
      }
      else if (isInt(value)) {
        value = parseInt(value);
      }
    }
    skill_dict[header] = value;
  }//loop over skill headers
  return skill_dict;
};//collect_skill

/*
const encode_stats = function() {
  let new_stats = get_stats();
  let encode_string = btoa(JSON.stringify(new_stats));
  return encode_string;
};
*/
const encode_stats = function() {
  let new_stats = get_stats();
  let json_string = JSON.stringify(new_stats);

  // 1. Convert string to UTF-8 bytes and then to a binary string
  const bytes = new TextEncoder().encode(json_string);
  const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");

  // 2. Standard Base64 encode
  let base64 = btoa(binString);

  // 3. Make it URL-Safe
  let urlSafeBase64 = base64
    .replace(/\+/g, '-') // Replace + with -
    .replace(/\//g, '_') // Replace / with _
    .replace(/=+$/, '');  // Strip padding = characters

  return urlSafeBase64;
};

const set_stats = function() {
  let stat_string = window.location.hash.substr(1);

  let base64 = stat_string
    .replace(/-/g, '+') // Replace - back to +
    .replace(/_/g, '/'); // Replace _ back to /

  // 2. Restore padding (=) if it was stripped
  while (base64.length % 4) {
    base64 += '=';
  }

  // 3. Convert back to binary string
  const binString = atob(base64);

  // 4. Convert binary string to UTF-8 bytes and decode to JSON string
  const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0));
  let json_string = new TextDecoder().decode(bytes);
  char_stats =  JSON.parse(json_string);
  //console.log(char_stats);
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
    die.dataset.sides = pool[i];
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
    die.dataset.sides = pool[i];
    die.style.backgroundColor = dice_pallete[i % dice_pallete.length];
    dicePoolDisplay.appendChild(die);
    roll_animation(die, pool[i], results[i]);
    //die.innerText = results[i]; //roll_animation will set final value
  }

  let result = calculate_result(results, type) + bonus;
  let result_display = document.getElementById(type+"_result");
  result_display.innerText = 'roll: ';
  result_display.innerText+= ' ' + result;
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
    else if (document.getElementById('advantage').classList.contains('selected_mod')) {
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
  'injured': 0,

  'info' : {
    'name' : 'Mike Waters',
    'race' : 'Human',
    'crawler_number' : 13162193,
    'level' : 9,
    'class' : '',
    'floor' : 1,
    'gold' : 36,
    'popularity' : 6
  },

  'inventory' : [
  {
    "name": "Gimp Mask of Sadomasichism ",
    "quantity": 1,
    "dr": 1,
    "skill_bonus": [
      {
        "name": "Catcher",
        "type": "other",
        "bonus": 1
      },
      {
        "name": "Shield Block",
        "type": "defense",
        "bonus": 1
      }
    ],
    "stat_bonus": {},
    "notes": ""
  },
  {
    "name": "Garbage Can Lid",
    "quantity": 1,
    "dr": 1,
    "skill_bonus": [],
    "stat_bonus": {},
    "notes": ""
  },
  {
    "name": "LL Bean Duck Boots",
    "quantity": 1,
    "dr": 1,
    "skill_bonus": [],
    "stat_bonus": {},
    "notes": ""
  },
  {
    "name": "Leather Gloves",
    "dr": 1,
    "quantity": 1,
    "skill_bonus": [],
    "stat_bonus": {},
    "notes": ""
  },
  {
    "name": "Earring",
    "quantity": 1,
    "dr": 0,
    "skill_bonus": [],
    "stat_bonus": {
      "constitution": 2
    },
    "notes": ""
  },
  {
    "name": "Beret",
    "quantity": 1,
    "dr": 0,
    "skill_bonus": [],
    "stat_bonus": {
      "intelligence": 2
    },
    "notes": ""
  },
  {
    "name": "Healing Potion",
    "quantity": 10,
    "dr": 0,
    "skill_bonus": [],
    "stat_bonus": {},
    "notes": "Heal 5 slots"
  },
  {
    "name": "Bandages",
    "quantity": 4,
    "dr": 0,
    "skill_bonus": [],
    "stat_bonus": {},
    "notes": "spend an Action to remove the Blood Trail Debuff"
  },
  {
    "name": "Torch",
    "quantity": 20,
    "dr": 0,
    "skill_bonus": [],
    "stat_bonus": {},
    "notes": "provides bright light for 20 feet and dim light for another 20 feet. It burns out in about an hour"
  },
  {
    "name": "Basic Dynamite",
    "quantity": 1,
    "dr": 0,
    "skill_bonus": [],
    "stat_bonus": {},
    "notes": "1d6 Bludgeoning damage 0ft Blast radius +5ft Splash"
  },
  {
    "name": "Misc. Junk",
    "quantity": 1,
    "dr": 0,
    "skill_bonus": [],
    "stat_bonus": {},
    "notes": ""
  },
  {
    "name": "Crawler Biscuits",
    "quantity": 100,
    "dr": 0,
    "skill_bonus": [],
    "stat_bonus": {},
    "notes": ""
  },
  {
    "name": "8\" Sharpened Serving Tray",
    "quantity": 1,
    "dr": 0,
    "skill_bonus": [],
    "stat_bonus": {},
    "notes": ""
  },
  {
    "name": "Long Kitchen Knife",
    "quantity": 1,
    "dr": 0,
    "skill_bonus": [],
    "stat_bonus": {},
    "notes": "edged weapon"
  },
  {
    "name": "Pen",
    "quantity": 1,
    "dr": 0,
    "skill_bonus": [],
    "stat_bonus": {},
    "notes": "just a pen"
  },
  {
    "name": "Notebook",
    "quantity": 1,
    "dr": 0,
    "skill_bonus": [],
    "stat_bonus": {},
    "notes": ""
  },
  {
    "name": "Cutlas",
    "quantity": 1,
    "dr": 0,
    "skill_bonus": [],
    "stat_bonus": {},
    "notes": "Edged weapon from chocolate poop pirates"
  },
  {
    "name": "Leatherman",
    "quantity": 1,
    "dr": 0,
    "skill_bonus": [],
    "stat_bonus": {},
    "notes": "Don't leave home without it"
  }
],

'skills' : {
"attack": [
  {
    "name": "Longsword",
    "rank": 5,
    "rankbase": 5,
    "stat": "strength",
    "marked": false,
    "damage": "2d8",
    "grind_bank": 1,
    "notes": ""
  },
  {
    "name": "Improvised Weapons",
    "rank": 4,
    "rankbase": 4,
    "stat": "strength",
    "marked": true,
    "damage": "1d4",
    "grind_bank": 1,
    "notes": ""
  }
],
"defense": [
  {
    "name": "Evade",
    "rank": "0",
    "rankbase": "",
    "stat": "dexterity",
    "marked": "",
    "damage": "",
    "grind_bank": "",
    "notes": ""
  },
  {
    "name": "Shield Block",
    "rank": 4,
    "rankbase": 3,
    "stat": "strength",
    "marked": true,
    "damage": "",
    "grind_bank": 0,
    "notes": ""
  },
],
"other": [
  {
    "name": "Catcher",
    "rank": 5,
    "rankbase": 4,
    "stat": "",
    "marked": false,
    "damage": "",
    "grind_bank": "",
    "notes": "+5 DR"
  },
  {
    "name": "Detect Lies",
    "rank": 3,
    "rankbase": 3,
    "stat": "intelligence",
    "marked": true,
    "damage": "",
    "grind_bank": 0,
    "notes": ""
  },
  {
    "name": "Perception",
    "rank": 3,
    "rankbase": 3,
    "stat": "intelligence",
    "marked": true,
    "damage": "",
    "grind_bank": "",
    "notes": ""
  },
  {
    "name": "First Aid",
    "rank": 1,
    "rankbase": 1,
    "stat": "intelligence",
    "marked": "",
    "damage": "",
    "grind_bank": "",
    "notes": "On Success, the patient regains 1 Health Bar slot. Each higher degree of Success heals 1 additional slot. UPGRADES Rank 5: If you spend 5 minutes, the patient also heals a Minor Injury Debuff. Rank 10: If you spend 10 minutes, the patient also heals a Long-Term Minor Injury Debuff. Rank 15: The patient regains 1 additional Health Bar slot. If you spend 15 minutes, the patient also heals a Major Injury Debuff."
  },
  {
    "name": "Ambush",
    "rank": 1,
    "rankbase": 1,
    "stat": "intelligence",
    "marked": false,
    "damage": "",
    "grind_bank": "",
    "notes": "When a Mob is moving toward you, even if they are aware of your general presence, make an Int-Opposed Skill Check. On Success, you gain a surprise Action against the Mob before combat starts. As an unseen attacker, you Attack with Advantage. UPGRADES Rank 5: If you Attack with your Surprise Action, add an Ambush Rank damage die to your Surprise Attack damage. Rank 10: When other crawlers in your party roll this skill untrained, they roll as normal (not with Disadvantage). Rank 15: You gain a second bonus Action as a sur‑ prise Action. This bonus Action can’t be an Attack."
  },
  {
    "name": "Endurance",
    "rank": 2,
    "rankbase": 2,
    "stat": "intelligence",
    "marked": "",
    "damage": "",
    "grind_bank": "",
    "notes": ""
  },
  {
    "name": "Streetwise",
    "rank": 2,
    "rankbase": 2,
    "stat": "intelligence",
    "marked": "",
    "damage": "",
    "grind_bank": "",
    "notes": ""
  },
  {
    "name": "Investigation",
    "rank": 1,
    "rankbase": 1,
    "stat": "intelligence",
    "marked": "",
    "damage": "",
    "grind_bank": "",
    "notes": ""
  },
  {
    "name": "Repair",
    "rank": 1,
    "rankbase": 1,
    "stat": "intelligence",
    "marked": "",
    "damage": "",
    "grind_bank": "",
    "notes": ""
  },
  {
    "name": "Climbing",
    "rank": 1,
    "rankbase": 1,
    "stat": "strength",
    "marked": "",
    "damage": "",
    "grind_bank": "",
    "notes": ""
  },
  {
    "name": "Swimming",
    "rank": 1,
    "rankbase": 1,
    "stat": "strength",
    "marked": "",
    "damage": "",
    "grind_bank": "",
    "notes": ""
  }
]
},
  'notes' : ""
};
