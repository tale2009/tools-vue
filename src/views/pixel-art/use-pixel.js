import {arrayToColor, colorToArray, getStraightDotList} from '@/utils';

const usePixel = (usePixelKey, type) => {
    const {
        form,
        dotList,
        currentDot,
        isMousedown
    } = usePixelKey;

    if (!currentDot.value || !isMousedown.value) {
        return;
    }
    const {rowIndex, colIndex} = currentDot.value;

    const usePencil = () => {
        console.log(getStraightDotList({x: 1, y: 1}, {x: 1, y: 5}));
        dotList.value[rowIndex][colIndex] = colorToArray(form.color, true);
    };

    const useEraser = () => {
        dotList.value[rowIndex][colIndex] = [255, 255, 255, 0];
    };

    const useAbsorber = () => {
        form.color = arrayToColor(dotList.value[rowIndex][colIndex], true);
    };

    switch (type) {
        case 'pencil':
            usePencil();
            break;
        case 'eraser':
            useEraser();
            break;
        case 'absorber':
            useAbsorber();
            break;
    }
};

export default usePixel;
