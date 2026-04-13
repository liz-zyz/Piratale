/*:
 * @target MV
 * @plugindesc 特定のイベントを通常キャラより下に描画し、すり抜けられるようにするプラグイン
 * @author
 *
 * @help
 * イベントのメモ欄に <UpperLayer> と記述すると、そのイベントの
 * 表示優先度が通常キャラと同じになり、すり抜け不可になります。
 */

(function() {
    const _Game_Event_initMembers = Game_Event.prototype.initMembers;
    Game_Event.prototype.initMembers = function() {
        _Game_Event_initMembers.call(this);
        this._upperLayer = false;
    };

    const _Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
    Game_Event.prototype.setupPageSettings = function() {
        _Game_Event_setupPageSettings.call(this);
        this._upperLayer = this.event().note.includes("<UpperLayer>");
    };

    const _Sprite_Character_updatePosition = Sprite_Character.prototype.updatePosition;
    Sprite_Character.prototype.updatePosition = function() {
        _Sprite_Character_updatePosition.call(this);
        if (this._character instanceof Game_Event && !this._character._upperLayer) {
            this.z = 2; // 通常キャラより下のレイヤーに設定
        }
    };

    const _Game_Event_isNormalPriority = Game_Event.prototype.isNormalPriority;
    Game_Event.prototype.isNormalPriority = function() {
        if (!this._upperLayer) {
            return false; // デフォルトですり抜け可能にする
        }
        return _Game_Event_isNormalPriority.call(this);
    };
})();
