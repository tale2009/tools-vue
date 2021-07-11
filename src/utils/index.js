import Color from 'color';

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
