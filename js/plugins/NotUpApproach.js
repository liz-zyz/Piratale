/*:
 * @plugindesc イベントのメモに <notup> がある場合、プレイヤーに近づくときに上方向(8)の移動を禁止します。
 * @author GPT
 *
 * @help
 * イベントの「メモ欄」に <notup> と書いてください。
 * それがあるイベントは「プレイヤーに近づく」時に上方向に進まなくなります。
 */

(function() {
    const _Game_Character_moveTowardCharacter = Game_Character.prototype.moveTowardCharacter;
    Game_Character.prototype.moveTowardCharacter = function(character) {
        // イベント以外 or プレイヤー以外への移動 → 通常通り
        if (!(this instanceof Game_Event) || character !== $gamePlayer) {
            return _Game_Character_moveTowardCharacter.call(this, character);
        }

        // イベントのメモ確認
        const note = this.event().note || "";
        const forbidUp = note.includes("<notup>");

        // 現在位置との差分
        const sx = this.deltaXFrom(character.x);
        const sy = this.deltaYFrom(character.y);
        const absSx = Math.abs(sx);
        const absSy = Math.abs(sy);

        // 移動ロジック（上禁止を考慮）
        if (absSx > absSy) {
            this.moveStraight(sx > 0 ? 4 : 6); // 左右優先
            if (!this.isMovementSucceeded() && sy !== 0) {
                if (forbidUp && sy > 0) {
                    // 上禁止時、上方向回避 → 左右失敗なら下へ
                    this.moveStraight(2); // 下
                } else {
                    this.moveStraight(sy > 0 ? 8 : 2); // 上 or 下
                }
            }
        } else if (sy !== 0) {
            if (forbidUp && sy > 0) {
                // 上方向を禁止
                if (sx !== 0) {
                    this.moveStraight(sx > 0 ? 4 : 6); // 左右代替
                } else {
                    this.moveRandom(); // 左右も無理ならランダム
                }
            } else {
                this.moveStraight(sy > 0 ? 8 : 2); // 上 or 下
                if (!this.isMovementSucceeded() && sx !== 0) {
                    this.moveStraight(sx > 0 ? 4 : 6); // 左右代替
                }
            }
        } else if (sx !== 0) {
            this.moveStraight(sx > 0 ? 4 : 6); // 左右
        }
    };
})();
