import axios from "axios";

export default {
    getCardNameList(list, language, callback) {
        let cardSet = Array.from(new Set(list));
        cardSet = cardSet.map(e => e.trim());
        axios.post('/ydk/names', JSON.stringify({ids: cardSet, lang: language})).then(res => {
            let d = res.data.data;
            let arr = cardSet.map(e => {
                return {id: e, name: this.findCardFromList(d, e), exported: false, count: this.getCardCount(list, e)};
            });
            callback(arr);
        });
    },

    findCardFromList(list, id) {
        let name = `!NOTFOUND!(${id})`;
        for (let i = 0; i < list.length; i++) {
            if (parseInt(list[i].id) === parseInt(id)) {
                name = list[i].name;
                break;
            }
        }
        return name;
    },

    getCardCount(list, id) {
        let count = 0;
        for (let i = 0; i < list.length; i++) {
            if (parseInt(list[i]) === parseInt(id)) {
                count++;
            }
        }
        return count;
    }
}