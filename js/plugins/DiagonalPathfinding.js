/*:
 * @plugindesc プレイヤーに最短距離で近づく際に斜め移動を活用するプラグイン
 * @author 
 * 
 * @help
 * このプラグインは、イベントの「プレイヤーに近づく」挙動において、
 * 最短距離で移動するために斜め移動を活用するようにします。
 *
 * 【使用方法】
 * プラグインを導入するだけで機能します。
 *
 */

(function() {
    Game_Character.prototype.moveTowardCharacter = function(character) {
        const sx = this.deltaXFrom(character.x);
        const sy = this.deltaYFrom(character.y);
        const absSx = Math.abs(sx);
        const absSy = Math.abs(sy);
        
        if (sx !== 0 && sy !== 0) {
            // 斜め移動を試みる
            const horz = sx > 0 ? 4 : 6;
            const vert = sy > 0 ? 8 : 2;
            
            if (this.canPassDiagonally(this.x, this.y, horz, vert)) {
                this.moveDiagonally(horz, vert);
                return;
            }
        }
        
        // 一方向のみの移動
        if (absSx > absSy) {
            if (!this.moveStraight(sx > 0 ? 4 : 6) && sy !== 0) {
                this.moveStraight(sy > 0 ? 8 : 2);
            }
        } else {
            if (!this.moveStraight(sy > 0 ? 8 : 2) && sx !== 0) {
                this.moveStraight(sx > 0 ? 4 : 6);
            }
        }
    };

    // 斜め移動が可能か判定
    Game_Character.prototype.canPassDiagonally = function(x, y, horz, vert) {
        const x2 = $gameMap.roundXWithDirection(x, horz);
        const y2 = $gameMap.roundYWithDirection(y, vert);
        return $gameMap.isPassable(x, y, horz) && $gameMap.isPassable(x, y, vert) && $gameMap.isPassable(x2, y2, vert);
    };
})();
