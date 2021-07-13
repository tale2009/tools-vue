import Color from 'color';

// 颜色系列
export const colorToArray = (color, isAlpha) => {
    const colorObj = Color(color);
    const array = colorObj.array();
    if (isAlpha) {
        array.push(colorObj.valpha);
    }
    return array;
};

export const arrayToColor = (array, isAlpha) => {
    if (isAlpha) {
        return `rgba(${array[0]}, ${array[1]}, ${array[2]}, ${array[3]})`;
    }
    return `rgba(${array[0]}, ${array[1]}, ${array[2]})`;
};

// 坐标系列
// 获取直线两点间所有坐标
export const getStraightDotList = (dot1, dot2) => {
    let x1 = dot1.x;
    let y1 = dot1.y;
    let x2 = dot2.x;
    let y2 = dot2.y;
    const k = x1 === x2 ? 0 : (y2 - y1) / (x2 - x1);
    const b = y1 - k * x1;
    const fx = x => k * x + b;
    const fy = y => k ? (y - b) / k : b;
    const dotList = [];
    if (x1 > x2) {
        [x1, y1] = [y1, x1];
        [x2, y2] = [y2, x2];
        for (let x = x1; x <= x2; x++) {
            dotList.push({
                x,
                y: fx(x)
            });
        }
    }
    if (y1 > y2) {
        [x1, y1] = [y1, x1];
        [x2, y2] = [y2, x2];
        for (let y = y1; y <= y2; y++) {
            dotList.push({
                x: fy(y),
                y
            });
        }
    }
    return dotList;
};
