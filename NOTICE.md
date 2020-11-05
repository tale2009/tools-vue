# html2canvas
请在6200行左右，自行修改原始代码
```js
CanvasRenderer.prototype.renderTextWithLetterSpacing = function (text, letterSpacing) {
    var _this = this;
    if (letterSpacing === 0) {
        this.ctx.fillText(text.text, text.bounds.left, text.bounds.top + text.bounds.height);
    }
    // ...
};
```
修改为
```js
CanvasRenderer.prototype.renderTextWithLetterSpacing = function (text, letterSpacing) {
    var _this = this;
    if (navigator.userAgent.indexOf('Firefox') === -1){
        // 非火狐浏览器加这个
        this.ctx.textBaseline = 'ideographic';
    }
    if (letterSpacing === 0) {
        this.ctx.fillText(text.text, text.bounds.left, text.bounds.top + text.bounds.height);
    }
    // ...
};
```