import kanjiKanaMap from '@/assets/json/kanji-kana.json';
import monsterTypeList from '@/assets/json/monster-type-list.json';

// 解析游戏王卡片
export function parseYugiohCard(data, lang) {
  let card = {
    name: parseName(data),
    type: parseType(data),
    attribute: parseAttribute(data),
    icon: parseIcon(data),
    image: parseImage(data),
    cardType: parseCardType(data),
    pendulumType: parsePendulumType(data),
    level: parseLevelRank(data),
    rank: parseLevelRank(data),
    pendulumScale: parsePendulumScale(data),
    pendulumDescription: parsePendulumDescription(data, lang),
    monsterType: parseMonsterType(data, lang),
    atk: parseAtk(data),
    def: parseDef(data),
    arrowList: parseArrowList(data),
    description: parseDescription(data, lang),
    firstLineCompress: parseFirstLineCompress(data),
    package: parsePackage(data, lang),
    password: parsePassword(data),
  };
  if (lang === 'jp') {
    // 添加注音
    card.name = kanjiToKana(card.name);
    card.pendulumDescription = kanjiToKana(card.pendulumDescription);
    card.monsterType = kanjiToKana(card.monsterType);
    card.description = kanjiToKana(card.description);
  }
  return card;
}

// 添加假名
export function kanjiToKana(text = '') {
  // 重新排序kanjiKanaMap，最长key的放在最前
  let kanjiKanaReg = new RegExp(Object.keys(kanjiKanaMap).sort((a, b) => b.length - a.length).join('|'), 'g');
  return text.replace(/\[.*?\(.*?\)]/g, s => `|${s}|`).split('|').filter(value => value).map(value => {
    if (!/\[.*?\(.*?\)]/g.test(value)) {
      return value.replace(kanjiKanaReg, s => kanjiKanaMap[s]);
    }
    return value;
  }).join('');
}

// 移除假名
export function removeKanjiKana(text = '') {
  return text.replace(/\[(.*?)\(.*?\)]/g, '$1');
}

// 英文字母全角转半角
export function characterToHalf(value) {
  // 全角A：65313，半角A：65
  // 全角Z：65338，半角Z：90
  // 全角a：65345，半角a：97
  // 全角z：65370，半角z：122
  // 全角-半角=65248
  let charList = Array.from(String(value)).map(char => {
    let code = char.charCodeAt(0);
    if (char === '　') {
      return ' ';
    } else if (char === '﹒') {
      return '·';
    } else if (['＠', '．', '＆', '？', '！'].includes(char) || (code >= 65313 && code <= 65338) || (code >= 65345 && code <= 65370)) {
      return String.fromCharCode(code - 65248);
    }
    return char;
  });
  let text = charList.join('');
  // 日文引号中的数字转半角
  text = text.replace(/「.*?」/g, s => numberToHalf(s));
  return text;
}

// 数字转半角
export function numberToHalf(value) {
  let charList = Array.from(String(value)).map(char => {
    let code = char.charCodeAt(0);
    if (code >= 65296 && code <= 65305) {
      return String.fromCharCode(code - 65248);
    }
    return char;
  });
  return charList.join('');
}

// 数字转全角
export function numberToFull(value) {
  let charList = Array.from(String(value)).map(char => {
    let code = char.charCodeAt(0);
    if (code >= 48 && code <= 57) {
      return String.fromCharCode(code + 65248);
    }
    return char;
  });
  return charList.join('');
}

export function parseName(data) {
  let name = characterToHalf(data.name);
  // 名字的数字要转半角
  name = numberToHalf(name);
  return name;
}

// 解析type
export function parseType(data) {
  if (data.type & 0x1000000) {
    return 'pendulum';
  } else if (data.type & 0x4) {
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
    return 'light';
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
  return `https://storage.googleapis.com/ygoprodeck.com/pics_artgame/${data.id}.jpg`;
}

export function parseCardType(data) {
  if (data.type & 0x4000000) {
    return 'link';
  } else if (data.type & 0x800000) {
    return 'xyz';
  } else if (data.type & 0x4000) {
    return 'token';
  } else if (data.type & 0x2000) {
    return 'synchro';
  } else if (data.type & 0x80) {
    return 'ritual';
  } else if (data.type & 0x40) {
    return 'fusion';
  } else if (data.type & 0x20) {
    return 'effect';
  } else if (data.type & 0x10) {
    return 'normal';
  } else {
    return 'normal';
  }
}

export function parsePendulumType(data) {
  if (parseType(data) === 'pendulum') {
    if (data.type & 0x800000) {
      return 'xyz-pendulum';
    } else if (data.type & 0x2000) {
      return 'synchro-pendulum';
    } else if (data.type & 0x80) {
      return 'ritual-pendulum';
    } else if (data.type & 0x40) {
      return 'fusion-pendulum';
    } else if (data.type & 0x20) {
      return 'effect-pendulum';
    } else if (data.type & 0x10) {
      return 'normal-pendulum';
    } else {
      return 'normal-pendulum';
    }
  } else {
    return 'normal-pendulum';
  }
}

export function parseLevelRank(data) {
  let number = parseInt(data.level.toString(16).substr(-1), 16);
  if (number <= 13) {
    return number;
  } else {
    return 1;
  }
}

export function parsePendulumScale(data) {
  if (parseType(data) === 'pendulum') {
    let list = data.desc.split('【Pendulum Effect】');
    return parseInt(list[0]?.replace(/[^\d]/g, ''));
  } else {
    return 0;
  }
}

export function parsePendulumDescription(data, lang) {
  if (parseType(data) === 'pendulum') {
    let description = characterToHalf(data.desc).replace(/'''/g, '')
      .replace(/\r/g, '\n').replace(/\n\n/g, '\n');
    const list = description.split(/【Pendulum Effect】|【Monster Effect】|【Flavor Text】|【怪獸敘述】|【怪獸效果】|【怪獸描述】/).filter(item => item && item !== '\n');
    if (lang === 'tc') {
      description = list[2]?.replace(/\d+→|\n/g, '') || '';
    } else {
      description = list[1]?.replace(/\d+→|\n/g, '') || '';
    }
    if (['jp', 'sc'].includes(lang)) {
      // 效果数字全角，卡名数字半角
      description = numberToFull(description).replace(/(「.*?」)|(“.*?”)/g, s => numberToHalf(s));
    }
    return description.trim();
  } else {
    return '';
  }
}

export function parseMonsterType(data, lang) {
  let list = [];
  // 先判断种族
  if (data.race & 0x1000000) {
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
  if (data.type & 0x4000000) {
    list.push('link');
  } else if (data.type & 0x1000000) {
    list.push('pendulum');
  } else if (data.type & 0x800000) {
    list.push('xyz');
  } else if (data.type & 0x2000) {
    list.push('synchro');
  } else if (data.type & 0x80) {
    list.push('ritual');
  } else if (data.type & 0x40) {
    list.push('fusion');
  }
  if (data.type & 0x400000) {
    list.push('toon');
  }
  if (data.type & 0x200000) {
    list.push('flip');
  }
  if (data.type & 0x1000) {
    list.push('tuner');
  }
  if (data.type & 0x800) {
    list.push('gemini');
  }
  if (data.type & 0x400) {
    list.push('union');
  }
  if (data.type & 0x200) {
    list.push('spirit');
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

export function parseAtk(data) {
  if (data.atk === -2) {
    return -1;
  } else {
    return data.atk;
  }
}

export function parseDef(data) {
  if (parseCardType(data) !== 'link') {
    if (data.def === -2) {
      return -1;
    } else {
      return data.def;
    }
  } else {
    return 0;
  }
}

export function parseArrowList(data) {
  let arrowList = [];
  if (parseCardType(data) === 'link') {
    if (data.def & 0x100) {
      arrowList.push(2); // ↗
    }
    if (data.def & 0x80) {
      arrowList.push(1); // ↑
    }
    if (data.def & 0x40) {
      arrowList.push(8); // ↖
    }
    if (data.def & 0x20) {
      arrowList.push(3); // →
    }
    if (data.def & 0x8) {
      arrowList.push(7); // ←
    }
    if (data.def & 0x4) {
      arrowList.push(4); // ↘
    }
    if (data.def & 0x2) {
      arrowList.push(5); // ↓
    }
    if (data.def & 0x1) {
      arrowList.push(6); // ↙
    }
  }
  return arrowList;
}

export function parseDescription(data, lang) {
  let description = characterToHalf(data.desc).replace(/'''/g, '')
    .replace(/\r/g, '\n').replace(/\n\n/g, '\n');
  if (parseType(data) === 'pendulum') {
    const list = description.split(/【Pendulum Effect】|【Monster Effect】|【Flavor Text】|【怪獸敘述】|【怪獸效果】|【怪獸描述】/).filter(item => item && item !== '\n');
    if (lang === 'tc') {
      description = list[3] || '';
    } else {
      description = list[2] || '';
    }
  }
  // 融合、同调、超量、连接、衍生物保留一个换行
  if (['fusion', 'synchro', 'xyz', 'link', 'token'].includes(parseCardType(data))) {
    let lfCount = 0;
    let charList = Array.from(description).map(char => {
      if (char === '\n') {
        if (lfCount > 0) {
          return '';
        }
        lfCount++;
      }
      return char;
    });
    description = charList.join('');
  } else {
    description = description.replace(/\n/g, '');
  }
  if (['jp', 'sc'].includes(lang)) {
    // 效果数字全角，卡名数字半角
    description = numberToFull(description).replace(/(「.*?」)|(“.*?”)/g, s => numberToHalf(s));
  }
  return description.trim();
}

export function parseFirstLineCompress(data) {
  // 首行压缩，换行符至少要有1个
  const hasLf = parseDescription(data).includes('\n');
  const hasType = ['monster', 'pendulum'].includes(parseType(data));
  const hasCardType = ['fusion', 'synchro', 'xyz', 'link'].includes(parseCardType(data));
  return hasLf && hasType && hasCardType;
}

export function parsePackage(data, lang) {
  // const packageList = data.setid.split(',').reverse();
  // return packageList.find(value => value.includes(`-${lang.toUpperCase()}`)) || '';
  // 数据库setid字段被删除了
  return '';
}

export function parsePassword(data) {
  let password = data.id.toString();
  if (password.length < 8) {
    password = '0'.repeat(8 - password.length) + password;
  }
  return password;
}
