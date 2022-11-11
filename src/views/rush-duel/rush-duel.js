import monsterTypeList from '@/assets/json/monster-type-list.json';
import { characterToHalf, kanjiToKana, numberToFull, numberToHalf } from '@/views/yugioh/yugioh';

// 解析游戏王卡片
export function parseRushDuelCard(data, lang) {
  let card = {
    name: parseName(data),
    type: parseType(data),
    attribute: parseAttribute(data),
    icon: parseIcon(data),
    image: parseImage(data),
    cardType: parseCardType(data),
    level: parseLevel(data),
    monsterType: parseMonsterType(data, lang),
    maximumAtk: parseMaximumAtk(data),
    atk: parseAtk(data),
    def: parseDef(data),
    description: parseDescription(data, lang),
    firstLineCompress: parseFirstLineCompress(data),
    package: parsePackage(data, lang),
    password: parsePassword(data),
    legend: parseLegend(data),
  };
  if (lang === 'jp') {
    // 添加注音
    card.name = kanjiToKana(card.name);
    card.monsterType = kanjiToKana(card.monsterType);
    card.description = kanjiToKana(card.description);
  }
  return card;
}

export function parseName(data) {
  let name = characterToHalf(data.name);
  // 名字的数字要转半角
  name = numberToHalf(name);
  return name;
}

// 解析type
export function parseType(data) {
  if (data.type & 0x4) {
    return 'trap';
  } else if (data.type & 0x2) {
    return 'spell';
  } else if (data.type & 0x1) {
    return 'monster';
  } else {
    return 'monster';
  }
}

// 解析attribute
export function parseAttribute(data) {
  if (data.attribute & 0x40) {
    return 'divine';
  } else if (data.attribute & 0x20) {
    return 'dark';
  } else if (data.attribute & 0x10) {
    return 'light';
  } else if (data.attribute & 0x8) {
    return 'wind';
  } else if (data.attribute & 0x4) {
    return 'fire';
  } else if (data.attribute & 0x2) {
    return 'water';
  } else if (data.attribute & 0x1) {
    return 'earth';
  } else {
    return '';
  }
}

export function parseIcon(data) {
  if (data.type & 0x100000) {
    return 'counter';
  } else if (data.type & 0x80000) {
    return 'filed';
  } else if (data.type & 0x40000) {
    return 'equip';
  } else if (data.type & 0x20000) {
    return 'continuous';
  } else if (data.type & 0x10000) {
    return 'quick-play';
  } else if (data.type & 0x80) {
    return 'ritual';
  } else {
    return '';
  }
}

export function parseImage(data) {
  return `https://images.ygoprodeck.com/images/cards_cropped/${data.id}.jpg`;
}

export function parseCardType(data) {
  if (data.type & 0x40) {
    return 'fusion';
  } else if (data.type & 0x20) {
    return 'effect';
  } else if (data.type & 0x10) {
    return 'normal';
  } else {
    return 'normal';
  }
}

export function parseLevel(data) {
  let number = parseInt(data.level);
  if (number <= 13) {
    return number;
  } else {
    return 1;
  }
}

export function parseMonsterType(data, lang) {
  if (!data.race) {
    return '';
  }
  let list = [];
  // 先判断种族
  if (data.race & 0x40000000) {
    list.push('galaxy');
  } else if (data.race & 0x20000000) {
    list.push('celestialKnight');
  } else if (data.race & 0x10000000) {
    list.push('omegaPsycho');
  } else if (data.race & 0x8000000) {
    list.push('hydragon');
  } else if (data.race & 0x4000000) {
    list.push('magicalKnight');
  } else if (data.race & 0x2000000) {
    list.push('cyborg');
  } else if (data.race & 0x1000000) {
    list.push('cyberse');
  } else if (data.race & 0x800000) {
    list.push('wyrm');
  } else if (data.race & 0x400000) {
    list.push('creatorGod');
  } else if (data.race & 0x200000) {
    list.push('divineBeast');
  } else if (data.race & 0x100000) {
    list.push('psychic');
  } else if (data.race & 0x80000) {
    list.push('reptile');
  } else if (data.race & 0x40000) {
    list.push('seaSerpent');
  } else if (data.race & 0x20000) {
    list.push('fish');
  } else if (data.race & 0x10000) {
    list.push('dinosaur');
  } else if (data.race & 0x8000) {
    list.push('beastWarrior');
  } else if (data.race & 0x4000) {
    list.push('beast');
  } else if (data.race & 0x2000) {
    list.push('dragon');
  } else if (data.race & 0x1000) {
    list.push('thunder');
  } else if (data.race & 0x800) {
    list.push('insect');
  } else if (data.race & 0x400) {
    list.push('plant');
  } else if (data.race & 0x200) {
    list.push('wingedBeast');
  } else if (data.race & 0x100) {
    list.push('rock');
  } else if (data.race & 0x80) {
    list.push('pyro');
  } else if (data.race & 0x40) {
    list.push('aqua');
  } else if (data.race & 0x20) {
    list.push('machine');
  } else if (data.race & 0x10) {
    list.push('zombie');
  } else if (data.race & 0x8) {
    list.push('fiend');
  } else if (data.race & 0x4) {
    list.push('fairy');
  } else if (data.race & 0x2) {
    list.push('spellcaster');
  } else if (data.race & 0x1) {
    list.push('warrior');
  }
  // 判断其他,顺序根据实卡做调整
  if (data.type & 0x2000000) {
    list.push('spsummon');
  }
  if (data.type & 0x40) {
    list.push('fusion');
  }
  if (data.type & 0x20) {
    list.push('effect');
  } else if (data.type & 0x10) {
    list.push('normal');
  }
  list = list.map(value => monsterTypeList[lang][value]).filter(value => value);

  let separator;
  if (['tc', 'jp'].includes(lang)) {
    separator = '／';
  } else if (lang === 'kr') {
    separator = ' / ';
  } else {
    separator = '/';
  }
  return list.join(separator);
}

export function parseMaximumAtk(data) {
  if (data.desc.includes('极大攻击')) {
    return parseInt(data.desc.match(/极大攻击 (\d*)/)?.[1]) || 0;
  }
  return 0;
}

export function parseAtk(data) {
  if (data.atk === -2) {
    return -1;
  } else {
    return data.atk;
  }
}

export function parseDef(data) {
  if (data.def === -2) {
    return -1;
  } else {
    return data.def;
  }
}

export function parseDescription(data, lang) {
  let description = characterToHalf(data.desc).replace(/'''/g, '')
    .replace(/\r/g, '\n').replace(/(\n)\1*/g, '\n');
  description = description.replace(/RD\/.*?\n/g, '');
  description = description.replace(/(【.*?】)\n/g, '$1');
  description = description.replace(/极大攻击 \d*\n/g, '');
  description = description.replace(/《传说卡》\n/g, '');
  description = description.replace(/(【.*?】)/g, '<b>$1</b>');
  if (['jp', 'sc'].includes(lang)) {
    // 效果数字全角，卡名数字半角
    description = numberToFull(description).replace(/(「.*?」)|(“.*?”)/g, s => numberToHalf(s));
  }
  return description.trim();
}

export function parseFirstLineCompress(data) {
  // 首行压缩，换行符至少要有1个
  const hasLf = parseDescription(data).includes('\n');
  const hasType = parseType(data) === 'monster';
  const hasCardType = parseCardType(data) === 'fusion';
  return hasLf && hasType && hasCardType;
}

export function parsePackage(data, lang) {
  return '';
}

export function parsePassword(data) {
  return data.id.toString();
}

export function parseLegend(data) {
  return data.desc.includes('《传说卡》');
}
