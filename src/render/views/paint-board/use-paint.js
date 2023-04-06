const usePaint = (usePaintKey, type, e) => {
  const {
    context,
    form,
    downPoint,
    lastPoint,
    historyList,
  } = usePaintKey;

  const history = historyList.value[historyList.value.length - 1];

  const shiftKey = e.shiftKey;
  const x = e.offsetX;
  const y = e.offsetY;
  // 初始化以下为默认变量
  context.value.globalCompositeOperation = 'source-over';
  context.value.lineCap = 'butt';
  context.value.lineJoin = 'miter';
  context.value.lineWidth = form.lineWidth;
  context.value.strokeStyle = form.color;
  context.value.fillStyle = form.fillColor;

  const usePencil = () => {
    context.value.beginPath();
    if (Object.keys(lastPoint.value).length) {
      context.value.moveTo(lastPoint.value.x, lastPoint.value.y);
    } else {
      context.value.moveTo(x, y);
    }
    context.value.lineTo(x, y);
    context.value.lineCap = 'round';
    context.value.lineJoin = 'round';
    context.value.stroke();
  };

  const useBucket = () => {

  };

  const useText = () => {
    form.editPosition = { x, y };
  };

  const useEraser = () => {
    context.value.globalCompositeOperation = 'destination-out';
    usePencil();
  };

  const useAbsorber = () => {
    const imageData = context.value.getImageData(x, y, 1, 1);
    const r = imageData.data[0];
    const g = imageData.data[1];
    const b = imageData.data[2];
    form.color = `rgb(${r}, ${g}, ${b})`;
  };

  const useStraight = () => {
    context.value.putImageData(history, 0, 0);
    context.value.beginPath();
    context.value.moveTo(downPoint.value.x, downPoint.value.y);
    if (shiftKey) {
      // 数学直角坐标系的角度
      const angle = -Math.atan2(y - downPoint.value.y, x - downPoint.value.x) * 180 / Math.PI;
      // 45°偏移
      const offset = (Math.abs(x - downPoint.value.x) + Math.abs(y - downPoint.value.y)) / 2;
      let newX;
      let newY;
      if (angle >= -157.5 && angle < -112.5) {
        newX = downPoint.value.x - offset;
        newY = downPoint.value.y + offset;
      } else if (angle >= -112.5 && angle < -67.5) {
        newX = downPoint.value.x;
        newY = y;
      } else if (angle >= -67.5 && angle < -22.5) {
        newX = downPoint.value.x + offset;
        newY = downPoint.value.y + offset;
      } else if (angle >= -22.5 && angle < 22.5) {
        newX = x;
        newY = downPoint.value.y;
      } else if (angle >= 22.5 && angle < 67.5) {
        newX = downPoint.value.x + offset;
        newY = downPoint.value.y - offset;
      } else if (angle >= 67.5 && angle < 112.5) {
        newX = downPoint.value.x;
        newY = y;
      } else if (angle >= 112.5 && angle < 157.5) {
        newX = downPoint.value.x - offset;
        newY = downPoint.value.y - offset;
      } else {
        newX = x;
        newY = downPoint.value.y;
      }
      context.value.lineTo(newX, newY);
    } else {
      context.value.lineTo(x, y);
    }
    context.value.lineCap = 'round';
    context.value.lineJoin = 'round';
    context.value.stroke();
  };

  const useRectangle = () => {
    context.value.putImageData(history, 0, 0);
    if (shiftKey) {
      const length = Math.min(x - downPoint.value.x, y - downPoint.value.y);
      context.value.strokeRect(downPoint.value.x, downPoint.value.y, length, length);
      if (form.fillColor) {
        context.value.fillRect(downPoint.value.x, downPoint.value.y, length, length);
      }
    } else {
      context.value.strokeRect(downPoint.value.x, downPoint.value.y, x - downPoint.value.x, y - downPoint.value.y);
      if (form.fillColor) {
        context.value.fillRect(downPoint.value.x, downPoint.value.y, x - downPoint.value.x, y - downPoint.value.y);
      }
    }
  };

  const useEllipse = () => {
    context.value.putImageData(history, 0, 0);
    context.value.beginPath();
    let radiusX = Math.abs((x - downPoint.value.x) / 2);
    let radiusY = Math.abs((y - downPoint.value.y) / 2);
    if (shiftKey) {
      let radius = Math.min(radiusX, radiusY);
      let centerX = x > downPoint.value.x ? radius + downPoint.value.x : downPoint.value.x - radius;
      let centerY = y > downPoint.value.y ? radius + downPoint.value.y : downPoint.value.y - radius;
      context.value.ellipse(centerX, centerY, radius, radius, 0, 0, Math.PI * 2);
    } else {
      let centerX = radiusX + Math.min(downPoint.value.x, x);
      let centerY = radiusY + Math.min(downPoint.value.y, y);
      context.value.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    }
    context.value.stroke();
    if (form.fillColor) {
      context.value.fill();
    }
  };

  switch (type) {
    case 'pencil':
      usePencil();
      break;
    case 'bucket':
      useBucket();
      break;
    case 'text':
      useText();
      break;
    case 'eraser':
      useEraser();
      break;
    case 'absorber':
      useAbsorber();
      break;
    case 'straight':
      useStraight();
      break;
    case 'rectangle':
      useRectangle();
      break;
    case 'ellipse':
      useEllipse();
      break;
  }
};

export default usePaint;
