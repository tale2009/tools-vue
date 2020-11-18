export default {
    install(Vue, options) {
        // 解析游戏王卡片
        Vue.prototype.parseYugiohCard = function (data, lang) {
            console.log(data);
            let card = {
                // type: 'monster',
                // attribute: 'dark',
                // icon: '',
                // image: '',
                // cardType: 'normal',
                // pendulumType: 'normal-pendulum',
                // level: 0,
                // rank: 0,
                // pendulumScale: 0,
                // pendulumDescription: '',
                // monsterType: '',
                // atk: 0,
                // def: 0,
                // arrowList: [],
                // description: '',
                // package: '',
                // password: ''
            };
            card.name = data.name;
            card.attribute = parseAttribute(data);
            console.log(card.attribute);
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
            text = fullToHalf(text);
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
function fullToHalf(value) {
    // 全角A：65313，半角A：65
    // 全角Z：65338，半角Z：90
    // 全角a：65345，半角a：97
    // 全角z：65370，半角z：122
    // 全角-半角=65248
    let charList = Array.from(value).map(char => {
        let code = char.charCodeAt();
        if ((code >= 65313 && code <= 65338) || (code >= 65345 && code <= 65370)) {
            return String.fromCharCode(code - 65248);
        }
        return char;
    });
    return charList.join('');
}

// 判断0x数字是否包含另一个数字
function isInclude(a, b) {
    a = a.toString(16);
    b = b.toString(16);
    let aList = Array.from(a).map((value, index, arr) => value + '0'.repeat(arr.length - index - 1));
    return aList.includes(b);
}

// 解析attribute
function parseAttribute(data) {
    if (data.attribute === 0x1) {
        return 'earth';
    } else if (data.attribute === 0x2) {
        return 'water';
    } else if (data.attribute === 0x4) {
        return 'fire';
    } else if (data.attribute === 0x8) {
        return 'wind';
    } else if (data.attribute === 0x10) {
        return 'light';
    } else if (data.attribute === 0x20) {
        return 'dark';
    } else if (data.attribute === 0x40) {
        return 'divine';
    } else if (isInclude(data.type, 0x2)) {
        return 'spell';
    } else if (isInclude(data.type, 0x4)) {
        return 'trap';
    } else {
        return data.attribute;
    }
}