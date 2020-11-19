export default {
    install(Vue, options) {
        // 解析游戏王卡片
        Vue.prototype.parseYugiohCard = function (data, lang) {
            console.log(data);
            let card = {
                name: parseName(data),
                type: parseType(data),
                attribute: parseAttribute(data),
                icon: parseIcon(data),
                image: '',
                cardType: parseCardType(data),
                pendulumType: parsePendulumType(data),
                level: parseLevelRank(data),
                rank: parseLevelRank(data),
                pendulumScale: parsePendulumScale(data),
                pendulumDescription: parsePendulumDescription(data),
                monsterType: parseMonsterType(data, lang),
                atk: parseAtk(data),
                def: parseDef(data),
                arrowList: parseArrowList(data),
                description: parseDescription(data),
                package: parsePackage(data),
                password: parsePassword(data)
            };
            if (lang === 'jp') {
                // 添加注音
                card.name = Vue.prototype.kanjiToKana(card.name);
                card.pendulumDescription = Vue.prototype.kanjiToKana(card.pendulumDescription);
                card.monsterType = Vue.prototype.kanjiToKana(card.monsterType);
                card.description = Vue.prototype.kanjiToKana(card.description);
            }
            return card;
        };
        // 添加假名
        Vue.prototype.kanjiToKana = function (text = '') {
            text = characterToHalf(text);
            // 重新排序kanjiKanaMap，最长key的放在最前
            let kanjiKanaReg = new RegExp(Object.keys(kanjiKanaMap).sort((a, b) => b.length - a.length).join('|'), 'g');
            return text.replace(/\[.*?\(.*?\)]/g, s => `|${s}|`).split('|').filter(value => value).map(value => {
                if (!/\[.*?\(.*?\)]/g.test(value)) {
                    return value.replace(kanjiKanaReg, s => kanjiKanaMap[s]);
                }
                return value;
            }).join('');
        };
    }
};

const kanjiKanaMap = require('@/assets/json/kanji-kana.json');

// 英文字母全角转半角
function characterToHalf(value) {
    // 全角A：65313，半角A：65
    // 全角Z：65338，半角Z：90
    // 全角a：65345，半角a：97
    // 全角z：65370，半角z：122
    // 全角-半角=65248
    let charList = Array.from(value).map(char => {
        let code = char.charCodeAt();
        if (char === '　') {
            return ' ';
        } else if (['＠', '．', '＆', '？', '！'].includes(char) || (code >= 65313 && code <= 65338) || (code >= 65345 && code <= 65370)) {
            return String.fromCharCode(code - 65248);
        }
        return char;
    });
    let text = charList.join('');
    // 日文卡名中的数字转半角
    text = text.replace(/「.*?」/g, s => numberToHalf(s));
    return text;
}

// 数字转半角
function numberToHalf(value) {
    let charList = Array.from(value).map(char => {
        let code = char.charCodeAt();
        if (code >= 65296 && code <= 65305) {
            return String.fromCharCode(code - 65248);
        }
        return char;
    });
    return charList.join('');
}

function parseName(data) {
    let name = characterToHalf(data.name);
    // 名字的数字要转半角
    name = numberToHalf(name);
    return name;
}

// 解析type
function parseType(data) {
    if (data.type & 0x1000000) {
        return 'pendulum';
    } else if (data.type & 0x4) {
        return 'trap';
    } else if (data.type & 0x2) {
        return 'spell';
    } else if (data.type & 0x1) {
        return 'monster';
    } else {
        return '';
    }
}

// 解析attribute
function parseAttribute(data) {
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
    } else if (data.type & 0x4) {
        return 'trap';
    } else if (data.type & 0x2) {
        return 'spell';
    } else {
        return '';
    }
}

function parseIcon(data) {
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

function parseCardType(data) {
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
        return '';
    }
}

function parsePendulumType(data) {
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
            return '';
        }
    } else {
        return '';
    }
}

function parseLevelRank(data) {
    let number = parseInt(data.level.toString(16).substr(-1), 16);
    if (number <= 12) {
        return number;
    } else {
        return 0;
    }
}

function parsePendulumScale(data) {
    if (parseType(data) === 'pendulum') {
        let list = data.desc.split(/【.*?】/);
        return parseInt(list?.[0].replace(/[^\d]/g, ''));
    } else {
        return 0;
    }
}

function parsePendulumDescription(data) {
    if (parseType(data) === 'pendulum') {
        let list = data.desc.replace(/\r/g, '\n').replace(/\n\n/g, '\n').split(/【.*?】/);
        return list?.[1].replace(/\d+→|\n/g, '').trim();
    } else {
        return '';
    }
}

function parseMonsterType(data, lang) {
    return '';
}

function parseAtk(data) {
    if (data.atk === -2) {
        return -1;
    } else {
        return data.atk;
    }
}

function parseDef(data) {
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

function parseArrowList(data) {
    let arrowList = [];
    if (parseCardType(data) === 'link') {
        if (data.def & 0x100) {
            arrowList.push(2);  // ↗
        }
        if (data.def & 0x80) {
            arrowList.push(1);  // ↑
        }
        if (data.def & 0x40) {
            arrowList.push(8);  // ↖
        }
        if (data.def & 0x20) {
            arrowList.push(3);  // →
        }
        if (data.def & 0x8) {
            arrowList.push(7);  // ←
        }
        if (data.def & 0x4) {
            arrowList.push(4);  // ↘
        }
        if (data.def & 0x2) {
            arrowList.push(5);  // ↓
        }
        if (data.def & 0x1) {
            arrowList.push(6);  // ↙
        }
    }
    return arrowList;
}

function parseDescription(data) {
    let description = data.desc.replace(/\r/g, '\n').replace(/\n\n/g, '\n');
    if (parseType(data) === 'pendulum') {
        let list = description.split(/【.*?】/);
        description = list?.[2].replace(/\n/g, '').trim();
    } else {
        // 融合、同调、超量、连接保留一个换行
        if (['fusion', 'synchro', 'xyz', 'link'].includes(parseCardType(data))) {
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
    }
    return description;
}

function parsePackage(data) {
    return data.setid.split(',').reverse()[0];
}

function parsePassword(data) {
    let password = data.id.toString();
    if (password.length < 8) {
        password = '0'.repeat(8 - password.length) + password;
    }
    return password;
}
