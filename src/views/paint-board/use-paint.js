const usePaint = (usePaintKey, type, e) => {
    const {
        context,
        form,
        downPoint,
        lastPoint,
        historyList
    } = usePaintKey;

    const history = historyList.value[historyList.value.length - 1];

    const shiftKey = e.shiftKey;
    const x = e.offsetX;
    const y = e.offsetY;
    context.value.lineCap = 'butt';
    context.value.lineJoin = 'miter';
    context.value.lineWidth = form.lineWidth;
    context.value.strokeStyle = form.color;

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

    const useText = () => {

    };

    const useEraser = () => {
        context.value.clearRect(x, y, form.lineWidth, form.lineWidth);
    };

    const useStraight = () => {
        context.value.putImageData(history, 0, 0);
        context.value.beginPath();
        context.value.moveTo(downPoint.value.x, downPoint.value.y);
        context.value.lineTo(x, y);
        context.value.lineCap = 'round';
        context.value.lineJoin = 'round';
        context.value.stroke();
    };

    const useRectangle = () => {
        context.value.putImageData(history, 0, 0);
        if (shiftKey) {
            const length = Math.min(x - downPoint.value.x, y - downPoint.value.y);
            context.value.strokeRect(downPoint.value.x, downPoint.value.y, length, length);
        } else {
            context.value.strokeRect(downPoint.value.x, downPoint.value.y, x - downPoint.value.x, y - downPoint.value.y);
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
    };

    switch (type) {
        case 'pencil':
            usePencil();
            break;
        case 'text':
            useText();
            break;
        case 'eraser':
            useEraser();
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
