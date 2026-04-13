/*:
 * @plugindesc Debug window background
 */
(function() {
    const _createBackSprite = Window.prototype._createBackSprite;
    Window.prototype._createBackSprite = function() {
        _createBackSprite.call(this);

        // 背景スプライトが存在するか色で確認
        this._windowBackSprite.bitmap.fillAll('red');
        this._windowBackSprite.opacity = 255;
    };
})();
