import { arrayToColor, colorToArray, getStraightDotList } from '@/render/utils';

const usePixel = (usePixelKey, type) => {
  const {
    form,
    dotList,
    downDot,
    lastDot,
    currentDot,
    isMousedown,
    addDot,
  } = usePixelKey;

  if (!Object.keys(currentDot.value).length || !isMousedown.value) {
    return;
  }

  const downX = downDot.value.x;
  const downY = downDot.value.y;
  const lastX = lastDot.value.x;
  const lastY = lastDot.value.y;
  const currentX = currentDot.value.x;
  const currentY = currentDot.value.y;

  const usePencil = () => {
    const addDotList = getStraightDotList({ x: lastX, y: lastY }, { x: currentX, y: currentY });
    const colors = colorToArray(form.color, true);
    addDotList.forEach(dot => {
      dotList.value[dot.x][dot.y] = colors;
      addDot(dot.x, dot.y, colors);
    });
  };

  const useEraser = () => {
    const addDotList = getStraightDotList({ x: lastX, y: lastY }, { x: currentX, y: currentY });
    addDotList.forEach(dot => {
      const colors = [255, 255, 255, 0];
      dotList.value[dot.x][dot.y] = colors;
      addDot(dot.x, dot.y, colors);
    });
  };

  const useAbsorber = () => {
    form.color = arrayToColor(dotList.value[currentX][currentY], true);
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
