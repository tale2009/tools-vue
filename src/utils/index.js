import Color from 'color';
import store from '@/store';

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
// 获取直线上两点间所有坐标
export const getStraightDotList = (dot1, dot2) => {
  let x1 = dot1.x;
  let y1 = dot1.y;
  let x2 = dot2.x;
  let y2 = dot2.y;

  const k = x1 === x2 ? 0 : (y2 - y1) / (x2 - x1);
  const b = y1 - k * x1;
  const fx = x => y1 === y2 ? y1 : k * x + b;
  const fy = y => x1 === x2 || !k ? x1 : (y - b) / k;

  const dotList = [];

  if (x1 > x2) {
    [x1, x2] = [x2, x1];
  }
  for (let x = x1; x <= x2; x++) {
    dotList.push({ x, y: fx(x) >= 0 ? Math.ceil(fx(x)) : Math.floor(fx(x)) });
  }
  if (y1 > y2) {
    [y1, y2] = [y2, y1];
  }
  for (let y = y1; y <= y2; y++) {
    dotList.push({ x: fy(y) >= 0 ? Math.ceil(fy(y)) : Math.floor(fy(y)), y });
  }

  return [...new Set(dotList.map(v => JSON.stringify(v)))].map(v => JSON.parse(v));
};

// 动态加载css
export const loadCSS = url => {
  let css = document.createElement('link');
  css.href = url;
  css.rel = 'stylesheet';
  document.head.appendChild(css);
};

// 获取电脑和手机的client坐标
export const getClientXY = e => {
  let clientX;
  let clientY;
  if (e.type.startsWith('touch')) {
    clientY = e.touches[0].clientY;
    clientX = e.touches[0].clientX;
  } else {
    clientY = e.clientY;
    clientX = e.clientX;
  }
  return {
    clientX,
    clientY,
  };
};

export const maxDialogWidth = (width, margin = 10) => {
  const offsetWidth = store.state.bodyOffsetWidth;
  return offsetWidth > width + margin * 2 ? width : offsetWidth - margin * 2;
};
