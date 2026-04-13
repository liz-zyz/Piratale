/*:
 * @plugindesc イベントの表示位置をY方向にずらすプラグイン。メモ欄に <offsetY:数値> を指定してください。@author ChatGPT
 *
 * @help
 * ■使い方
 * イベントのメモ欄に以下のように記述：
 *   <offsetY:80>
 *
 * → 表示だけY方向にずれます（当たり判定や実際の位置には影響しません）
 *
 * 数値はマイナスも可能（例：<offsetY:-40> で上にずらす）
 */

(function() {
    const _Sprite_Character_updatePosition = Sprite_Character.prototype.updatePosition;
    Sprite_Character.prototype.updatePosition = function() {
        _Sprite_Character_updatePosition.call(this);

        let offsetY = 0;

        // イベントならメモ欄から offsetY を取得
        if (this._character instanceof Game_Event) {
            const note = this._character.event().note;
            const match = note.match(/<offsetY:\s*(-?\d+)>/);
            offsetY = match ? Number(match[1]) : 0;
        }

        this.y += offsetY;
    };
})();
